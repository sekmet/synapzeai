import { describe, expect, test, mock, beforeAll } from "bun:test";
import { app } from "../index";
import Docker from 'dockerode';

import { Readable, Writable, Duplex } from 'stream';

export const sleep = async (ms: number) => {
  await new Promise((resolve) => setTimeout(resolve, ms));
};

// Mock Duplex stream for bidirectional communication
class MockDuplex extends Duplex {
  constructor(options = {}) {
    super(options);
  }

  _read() {}

  _write(chunk: any, encoding: string, callback: Function) {
    this.push(chunk);
    callback();
  }

  _final(callback: Function) {
    this.push(null);
    callback();
  }
}

// Mock container with callback-style methods
const mockContainer = {
  id: 'test-container-id',
  attach: (opts: any, cb: Function) => {
    if (!opts || !opts.stream) {
      process.nextTick(() => cb(new Error('Stream option is required')));
      return;
    }
    const stream = new MockDuplex();
    process.nextTick(() => {
      stream.push(Buffer.from('test output'));
      stream.push(null);
      cb(null, stream);
    });
  },
  start: (opts: any, cb: Function) => {
    if (typeof opts === 'function') {
      cb = opts;
      opts = {};
    }
    process.nextTick(() => cb(null));
  },
  exec: (opts: any, cb: Function) => {
    if (!opts || !opts.Cmd) {
      process.nextTick(() => cb(new Error('Command is required')));
      return;
    }
    const exec = {
      start: (opts: any, cb: Function) => {
        if (typeof opts === 'function') {
          cb = opts;
          opts = {};
        }
        const stream = new MockDuplex();
        process.nextTick(() => {
          stream.push(Buffer.from('test output'));
          stream.push(null);
          cb(null, stream);
        });
      },
      inspect: (cb: Function) => {
        process.nextTick(() => cb(null, { ExitCode: 0 }));
      }
    };
    process.nextTick(() => cb(null, exec));
  },
  remove: (opts: any, cb: Function) => {
    if (typeof opts === 'function') {
      cb = opts;
      opts = {};
    }
    process.nextTick(() => cb(null));
  },
  top: (opts: any, cb: Function) => {
    if (typeof opts === 'function') {
      cb = opts;
      opts = {};
    }
    process.nextTick(() => cb(null, { Processes: [['1', 'root', '0:00', '/bin/bash']], Titles: ['PID', 'USER', 'TIME', 'COMMAND'] }));
  },
  logs: (opts: any, cb: Function) => {
    if (typeof opts === 'function') {
      cb = opts;
      opts = {};
    }
    if (!opts || (!opts.stdout && !opts.stderr)) {
      process.nextTick(() => cb(new Error('stdout or stderr option is required')));
      return;
    }
    const stream = new MockDuplex();
    process.nextTick(() => {
      stream.push(Buffer.from('test log'));
      stream.push(null);
      cb(null, stream);
    });
  },
  wait: (opts: any, cb: Function) => {
    if (typeof opts === 'function') {
      cb = opts;
      opts = {};
    }
    process.nextTick(() => cb(null, { StatusCode: 0 }));
  },
  inspect: (cb: Function) => {
    process.nextTick(() => cb(null, { State: { Running: true } }));
  },
  modem: {
    demuxStream: (stream: any, stdout: any, stderr: any) => {
      stream.on('data', (chunk: Buffer) => {
        stdout.write(chunk);
      });
    }
  }
};

// Mock Docker client
const mockDocker = {
  createContainer: (opts: any, cb: Function) => {
    if (!opts.Image) {
      process.nextTick(() => cb(new Error('Image is required')));
      return;
    }
    // Mock image pull for ubuntu images
    if (opts.Image === 'ubuntu:12.04' || opts.Image === 'ubuntu' || opts.Image === 'ubuntu:latest') {
      process.nextTick(() => cb(null, mockContainer));
      return;
    }
    process.nextTick(() => cb(new Error(`No such image: ${opts.Image}`)));
  },
  listContainers: (opts: any, cb: Function) => {
    process.nextTick(() => cb(null, [{ Id: 'test-container-id', Names: ['/test'], Image: 'ubuntu:latest' }]));
  },
  getContainer: (id: string) => mockContainer,
  buildImage: (tarStream: any, opts: any, cb: Function) => {
    if (typeof tarStream === 'string') {
      if (!tarStream.endsWith('.tar')) {
        process.nextTick(() => cb(new Error('Cannot locate specified Dockerfile: Dockerfile')));
        return;
      }
      if (!require('fs').existsSync(tarStream)) {
        process.nextTick(() => cb(new Error(`ENOENT: no such file or directory, open '${tarStream}'`)));
        return;
      }
    }
    const stream = new MockDuplex();
    process.nextTick(() => {
      stream.push(Buffer.from('{"stream":"Step 1/1 : FROM ubuntu\n"}'));
      stream.push(Buffer.from('{"stream":"Successfully built test-image\n"}'));
      stream.push(null);
      cb(null, stream);
    });
    return stream;
  },
  run: (image: string, cmd: string[], output: any, opts: any, cb: Function) => {
    if (!image || !(image === 'ubuntu:12.04' || image === 'ubuntu' || image === 'ubuntu:latest')) {
      process.nextTick(() => cb(new Error(`No such image: ${image}`)));
      return;
    }
    output.write('test output');
    process.nextTick(() => cb(null, { StatusCode: 0 }, mockContainer));
    return mockContainer;
  }
};

// Mock Docker constructor
mock.module('dockerode', () => {
  return function() {
    return mockDocker;
  };
});

// Mock tar-fs
mock.module('tar-fs', () => ({
  pack: (dir: string, opts: any) => {
    if (opts?.entries?.includes('Dockerfile')) {
      const fs = require('fs');
      const path = require('path');
      const dockerfilePath = path.join(dir, 'Dockerfile');
      if (!fs.existsSync(dockerfilePath)) {
        throw new Error(`ENOENT: no such file or directory, lstat '${dockerfilePath}'`);
      }
    }
    const stream = new MockDuplex();
    process.nextTick(() => {
      stream.push(Buffer.from('mock tar content'));
      stream.push(null);
    });
    return stream;
  }
}));

beforeAll(() => {
  process.env.NODE_ENV = 'test';
});

const apiPrefix = '/v1';

describe('API Endpoints', () => {
  // Root and Health endpoints
  describe('Basic Endpoints', () => {
    test('GET / should return server version', async () => {
      const res = await app.request('/');
      expect(res.status).toBe(200);
      expect(await res.text()).toBe('SYNAPZE DOCKER API Server v0.0.1');
    });

    test('GET /health should return OK status', async () => {
      const res = await app.request('/health');
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toEqual({ status: 'OK' });
    });
  });

  // Container endpoints
  describe('Container Endpoints', () => {
    test('POST /containers/duplex should create and remove a container', async () => {
      const res = await app.request(`${apiPrefix}/containers/duplex`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          createOptions: {
            Image: 'ubuntu:12.04',
            Cmd: ['/bin/bash'],
            OpenStdin: true,
            Tty: true
          }
        })
      });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty('message');
    });

    test('POST /containers/exec should execute command in container', async () => {
      const res = await app.request(`${apiPrefix}/containers/exec`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          createOptions: { 
            Image: 'ubuntu:12.04', 
            Cmd: ['/bin/bash'], 
            Tty: true 
          }
        })
      });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty('output');
    });

    test('GET /containers should list containers', async () => {
      const res = await app.request(`${apiPrefix}/containers?all=true&limit=5`);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty('containers');
      expect(Array.isArray(data.containers)).toBe(true);
    });

    test('POST /containers/logs should get container logs', async () => {
      const res = await app.request(`${apiPrefix}/containers/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          createOptions: {
            Image: 'ubuntu:12.04',
            Cmd: ['/bin/bash', '-c', 'echo "test log"']
          }
        })
      });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty('output');
    });

    test('POST /containers/run should run a container', async () => {
      const res = await app.request(`${apiPrefix}/containers/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: 'ubuntu:12.04',
          cmd: ['echo', 'test']
        })
      });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty('output');
      expect(data).toHaveProperty('containerId');
    });

    test('GET /containers/:id/top should get container processes', async () => {
      // First create a container that stays running
      const createRes = await app.request(`${apiPrefix}/containers/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: 'ubuntu:12.04',
          cmd: ['sleep', '10']
        })
      });
      const { containerId } = await createRes.json();
      await sleep(10000);
      const res = await app.request(`${apiPrefix}/containers/${containerId}/top`);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty('processes');
      expect(data).toHaveProperty('titles');
    });
  });

  // Build endpoints
  describe('Build Endpoints', () => {
    test('POST /build/buildcwd should build image from current directory', async () => {
      const res = await app.request(`${apiPrefix}/build/buildcwd`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tag: 'test-image'
        })
      });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty('buildOutput');
    });

    test('POST /build/buildfiles should build image from specific files', async () => {
      const res = await app.request(`${apiPrefix}/build/buildfiles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          src: ['Dockerfile'],
          tag: 'test-image-files'
        })
      });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty('buildOutput');
    });

    test('POST /build/run should build and run image from tar', async () => {
      const res = await app.request(`${apiPrefix}/build/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tarFilePath: './test.tar',
          tag: 'test-run-image'
        })
      });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty('buildOutput');
      expect(data).toHaveProperty('runOutput');
    });
  });

  // Error handling
  describe('Error Handling', () => {
    test('Non-existent endpoint should return 404', async () => {
      const res = await app.request('/non-existent');
      expect(res.status).toBe(404);
      const data = await res.json();
      expect(data).toEqual({ error: 'Not Found' });
    });

    test('Invalid container ID should return 500', async () => {
      const res = await app.request(`${apiPrefix}/containers/invalid-id/top`);
      expect(res.status).toBe(500);
      const data = await res.json();
      expect(data).toHaveProperty('error');
    });
  });
});
