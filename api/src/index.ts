// server.js
import { Hono } from 'hono';
import { bearerAuth } from 'hono/bearer-auth'
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { cors } from 'hono/cors'
import Docker from 'dockerode';
import tar from 'tar-fs';
import { Writable } from 'stream';
import { generateDockerComposeFile } from './lib/compose';
import { writeDefaultCharacterJson } from './lib/write-defaultchar';
import { readDefaultCharacterJson } from './lib/read-defaultchar';
import { runDeployment } from './lib/deploy/deploy-compose';
import { runComposeDown } from './lib/down/compose-down';
import { runCopyFile } from './lib/copy/copy-file';
import { runComposeRemove } from './lib/remove/compose-remove';
import { parseAndExtractEnvVariables } from './lib/envs/parse-extract';
import { createAgentSubdomain } from './lib/domains/create-domain';
import { removeAgentSubdomain } from './lib/domains/remove-domain';
import { signJwt } from './lib/jwt/sign';
import * as path from 'path';
import * as fs from 'fs';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import { fetchPlugins, fetchPluginsListing } from './lib/plugins';

const apiPrefix = '/v1';
const authToken = process.env.JWT_AGENT_API ?? '';

// Create a default Docker instance using the UNIX socket.
const docker = new Docker({ socketPath: '/var/run/docker.sock' });

export const app = new Hono();

if (process.env.NODE_ENV !== 'test') {
  app.use(logger());
}

// Add pretty JSON middleware for development
if (process.env.NODE_ENV === 'development') {
    app.use(prettyJSON({ space: 4 })) // With options: prettyJSON({ space: 4 })
  }
  
  // Add secure headers middleware
  //app.use('*', secureHeaders())
  
  // Add timing middleware
  //app.use(timing())
  
  // API specs docs
  //app.use('/docs/*', serveStatic({ precompressed: true, root: './' }));
  //app.use('/favicon.ico', serveStatic({ path: './public/favicon.ico' }))
  
  // CORS should be called before the route
  app.use(`${apiPrefix}/*`, cors())

  // Bearer auth middleware
  app.use(`${apiPrefix}/*`, bearerAuth({ token: authToken }))

  // Error handling middleware
  app.onError((err, c) => {
    console.error(`${err}`)
    return c.json({ error: 'Internal Server Error' }, 500)
  })
  
  // Health check endpoint
  app.get('/health', (c) => c.json({ status: 'OK' }))

// Email verification endpoint
app.post(`${apiPrefix}/auth/is-verified`, async (c) => {
  try {
    // Validate request body
    const schema = z.object({
      id: z.string()
    });

    const body = await c.req.json();
    const { id } = schema.parse(body);

    // Check if user exists and token is valid
    const userQuery = await Bun.sql`
      SELECT * FROM users WHERE id = ${id} LIMIT 1
    `.values();

    if (userQuery.length === 0) {
      return c.json({ success: false,error: 'User not found' }, 404);
    }
    console.log({ userQuery })

    const user = userQuery[0];
    if (user[6] as boolean) { // verified status is at index 6
      return c.json({ success: true, message: 'User verified', onboarding: user[8] as boolean }, 200);
    } else {
      return c.json({ success: false, message: 'User not verified', onboarding: user[8] as boolean }, 200);
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ success: false, error: `${error.errors[0].path[0]}: ${error.errors[0].message}` }, 400);
    }
    console.error('Verification error:', error);
    return c.json({ success: false, error: 'Failed to verify user' }, 500);
  }
});

// Email verification endpoint
app.post(`${apiPrefix}/auth/verify-email`, async (c) => {
  try {
    // Validate request body
    const schema = z.object({
      id: z.string(),
      email: z.string().email('Invalid email address').optional(),
      verificationToken: z.string().optional()//.min('Verification token is required')
    });

    const body = await c.req.json();
    const { id, email, verificationToken } = schema.parse(body);

    // Check if user exists and token is valid
    const userQuery = await Bun.sql`
      SELECT * FROM users WHERE id = ${id} LIMIT 1
    `.values();

    if (userQuery.length === 0) {
      return c.json({ error: 'User not found' }, 404);
    }
    console.log({ userQuery })

    const user = userQuery[0];

    // Update user as verified
    const now = new Date().toISOString();
    
    // Verify the token matches
    if (verificationToken) {
      if (user[7] !== verificationToken) {
        return c.json({ success: false, error: 'Invalid verification token' }, 500);
      } else {
        await Bun.sql`
          UPDATE users 
          SET verified = true,
              verification_token = NULL,
              onboarding = false,
              updated_at = ${now}
          WHERE id = ${id}
        `;
      }

      return c.json({
        success: true,
        message: 'Email Verified!',
        description: 'Your email was verified successfully, thank you!',
      });

    }

    if (user[6] as boolean) { // verified status is at index 3
      return c.json({ 
        success: true, 
        message: 'Email already verified',
        description: 'Your email is already verified.'
      }, 200);
    }

    // Check if user already exists and is verified
    const existingUserQuery = await Bun.sql`
      SELECT verified FROM users WHERE id = ${id} LIMIT 1
    `.values();

    if (existingUserQuery.length > 0 && existingUserQuery[0][0]) { // verified status is at index 3
      return c.json({
        success: true,
        message: 'Already verified',
        description: 'Your email is already verified.'
      });
    }

    // Create a verification token
    let _verificationToken = null
    if (!verificationToken) {
    _verificationToken = Math.random().toString(36).substring(2, 15);
    }

    if (existingUserQuery.length > 0) {
      // Update existing user with new verification token
      await Bun.sql`
        UPDATE users 
        SET verification_token = ${_verificationToken},
            updated_at = ${now},
            email_address = ${email}
        WHERE id = ${id}
      `;


    // Configure email transport (replace with your SMTP settings)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'mail.synapze.xyz',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send verification email
    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Synapze" <hello@synapze.xyz>',
      to: email,
      subject: 'Verify your email address',
      html: `
        <h1>Welcome to Synapze</h1>
        <h3>Email Verification</h3>
        <p>Click the link below to verify your email address:</p>
        <a href="${process.env.APP_HOST_URL}/verify-email/${_verificationToken}">
          Verify Email
        </a>
      `,
    });

    return c.json({
      success: true,
      message: 'Verification email sent successfully',
      description: 'Please check your inbox click the link to verify your account.'
    });

    } else {
      // Create new user with verification token
      /*const userId = crypto.randomUUID();
      await Bun.sql`
        INSERT INTO users (id, email_address, verification_token, verified, created_at, updated_at)
        VALUES (${userId}, ${email}, ${_verificationToken}, false, ${now}, ${now})
      `;*/
      return c.json({
        success: true,
        message: 'User ID invalid or already verified',
      });
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: `${error.errors[0].path[0]}: ${error.errors[0].message}` }, 400);
    }
    console.error('Email verification error:', error);
    return c.json({ success: false, error: 'Failed to send verification email' }, 500);
  }
});

// Not Found handler
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404)
})


  // DB connection
  
  // Root route
  app.get('/', (c) => c.text('SYNAPZE API Server v0.0.6'))

// Docker Info endpoint
app.get(`${apiPrefix}/docker/info`, async (c) => {
  try {
    const info = await new Promise((resolve, reject) => {
      docker.info((err, info) => err ? reject(err) : resolve(info));
    });
    return c.json({ serverVersion: info.ServerVersion, ...info });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// Docker Version endpoint
app.get(`${apiPrefix}/docker/version`, async (c) => {
  try {
    const version = await new Promise((resolve, reject) => {
      docker.version((err, version) => err ? reject(err) : resolve(version));
    });
    return c.json({ 
      version: version.Version,
      apiVersion: version.ApiVersion,
      ...version 
    });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// Container Inspect endpoint
app.get(`${apiPrefix}/containers/:id/inspect`, async (c) => {
  try {
    const container = docker.getContainer(c.req.param('id'));
    const info = await new Promise((resolve, reject) => {
      container.inspect((err, data) => err ? reject(err) : resolve(data));
    });
    return c.json(info);
  } catch (err) {
    return c.json({ error: err.message }, 404);
  }
});

// Container Stats endpoint
app.get(`${apiPrefix}/containers/:id/stats`, async (c) => {
  try {
    const container = docker.getContainer(c.req.param('id'));
    console.log('ID STATS', c.req.param('id'))
    const stats = await new Promise((resolve, reject) => {
      container.stats({ stream: false }, (err, data) => err ? reject(err) : resolve(data));
    });
    return c.json(stats);
  } catch (err) {
    return c.json({ error: err.message }, 404);
  }
});

// Container Top endpoint
app.get(`${apiPrefix}/containers/:id/top`, async (c) => {
  try {
    const container = docker.getContainer(c.req.param('id'));
    // First ensure container exists and get its state
    const inspectData = await new Promise((resolve, reject) => {
      container.inspect((err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });

    // If not running, start it
    if (!inspectData.State.Running) {
      await new Promise((resolve, reject) => {
        container.start((err) => {
          if (err) return reject(err);
          resolve(void 0);
        });
      });

      // Wait for container to be fully started
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Get processes
    const processes = await new Promise((resolve, reject) => {
      container.top({ps_args: 'aux'}, (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });

    return c.json(processes);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// List Volumes endpoint
app.get(`${apiPrefix}/volumes`, async (c) => {
  try {
    const data = await new Promise((resolve, reject) => {
      docker.listVolumes((err, data) => err ? reject(err) : resolve(data));
    });
    return c.json({ volumes: data.Volumes || [] });
  } catch (err) {
    return c.json({ error: err.message }, 404);
  }
});

// List Images endpoint
app.get(`${apiPrefix}/images`, async (c) => {
  try {
    const images = await new Promise((resolve, reject) => {
      docker.listImages((err, data) => err ? reject(err) : resolve(data));
    });
    return c.json({ images });
  } catch (err) {
    return c.json({ error: err.message }, 404);
  }
});

// Image Inspect endpoint
app.get(`${apiPrefix}/images/:id/inspect`, async (c) => {
  try {
    const image = docker.getImage(c.req.param('id'));
    const info = await new Promise((resolve, reject) => {
      image.inspect((err, data) => err ? reject(err) : resolve(data));
    });
    return c.json(info);
  } catch (err) {
    return c.json({ error: err.message }, 404);
  }
});

// Docker Pull endpoint
app.post(`${apiPrefix}/docker/pull`, async (c) => {
  try {
    const { imageName } = await c.req.json();
    if (!imageName) {
      return c.json({ error: 'imageName is required' }, 400);
    }
    let pullOutput = [];
    await new Promise((resolve, reject) => {
      docker.pull(imageName, (err, stream) => {
        if (err) return reject(err);
        docker.modem.followProgress(stream, (err, output) => {
          if (err) return reject(err);
          pullOutput = output.map(o => o.status || '').filter(Boolean);
          resolve(void 0);
        });
      });
    });
    return c.json({ pullOutput: pullOutput.join('\n') });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
})

// Container logs without options endpoint
app.post(`${apiPrefix}/containers/:id/logs`, async (c) => {
  try {
    const container = docker.getContainer(c.req.param('id'));
    const logs = await new Promise((resolve, reject) => {
      container.logs({ stdout: true, stderr: true }, (err, logs) => {
        if (err) return reject(err);
        resolve(logs);
      });
    });
    return c.json({ output: logs ? logs.toString() : '' });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// Container wait endpoint
// Copy a local tar file to a container path
app.post(`${apiPrefix}/containers/:id/copy-file`, async (c) => {
  try {
    const { srcPath, destPath } = await c.req.json();
    
    // Validate required parameters
    if (!srcPath || !destPath) {
      return c.json({ error: 'Both srcPath and destPath are required' }, 400);
    }

    // Verify source file exists
    if (!fs.existsSync(srcPath)) {
      return c.json({ error: 'Source file does not exist' }, 404);
    }

    const container = docker.getContainer(c.req.param('id'));
    const containerId = c.req.param('id').substring(0, 12);

    // Call the runDeployment function
    const output = await runCopyFile(containerId, srcPath, destPath);

    // Start the container
    await new Promise((resolve, reject) => {
      container.restart((err) => {
        if (err) return reject(err);
        resolve(void 0);
      });
    });

    return c.json({ 
      success: true,
      message: 'File copied successfully and container restarted',
      output
    });
  } catch (err: any) {
    console.error('Error copying file to container:', err);
    return c.json({ 
      success: false, 
      error: err.message || 'Failed to copy file to container'
    }, 500);
  }
});

app.post(`${apiPrefix}/containers/:id/wait`, async (c) => {
  try {
    const container = docker.getContainer(c.req.param('id'));
    const { options } = await c.req.json().catch(() => ({ options: { condition: 'next-exit' } }));
    
    // Start listening for container exit before starting it
    const waitPromise = new Promise((resolve, reject) => {
      container.wait(options || { condition: 'next-exit' }, (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });

    // Start the container
    await new Promise((resolve, reject) => {
      container.start((err) => {
        if (err) return reject(err);
        resolve(void 0);
      });
    });

    // Wait for container to exit
    const waitResult = await waitPromise;
    return c.json({ 
      statusCode: waitResult.StatusCode || 0,
      error: waitResult.Error || null
    });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// A helper function to wrap docker.createContainer in a Promise.
function createContainerPromise(options: any) {
  return new Promise((resolve, reject) => {
    docker.createContainer(options, (err, container) => {
      if (err) reject(err);
      else resolve(container);
    });
  });
}

/* ============================================================
   1. Duplex Container Endpoint
   URL: POST /containers/duplex
   Request JSON may include:
     - createOptions: object for container creation (defaults below)
     - attachOptions: object for container.attach (defaults below)
     - removeTimeout: number in ms before ending & removing (default: 5000)
   ============================================================ */
   app.post(`${apiPrefix}/containers/duplex`, async (c) => {
    try {
      // Parse JSON body (if any)
      const { createOptions, attachOptions, removeTimeout } =
        await c.req.json().catch(() => ({}));
  
      // Use defaults if options are not provided.
      const _createOptions = createOptions || {
        Image: 'ubuntu:latest',
        Cmd: ['/bin/bash', '-c', 'sleep 1'],
        OpenStdin: true,
        Tty: true,
        StopTimeout: 1,
        AttachStdin: false,
        AttachStdout: true,
        AttachStderr: true
      };
      const _attachOptions = attachOptions || { stream: true, stdin: true, stdout: true };
      const _removeTimeout = removeTimeout || 5000; // Use 5000ms as default for cleanup delay
  
      // Create the container
      const container = await createContainerPromise(_createOptions);
      if (!container) {
        throw new Error('Failed to create container');
      }
  
      // Attach to the container to get the stream
      const stream = await new Promise((resolve, reject) => {
        container.attach(_attachOptions, (err, stream) => {
          if (err) return reject(err);
          resolve(stream);
        });
      });
  
      // Start the container
      await new Promise((resolve, reject) => {
        container.start((err) => {
          if (err) return reject(err);
          resolve();
        });
      });
  
      // Wait until the container is running
      await new Promise((resolve, reject) => {
        const checkRunning = () => {
          container.inspect((err, data) => {
            if (err) return reject(err);
            if (data.State.Running) {
              resolve();
            } else {
              setTimeout(checkRunning, 100);
            }
          });
        };
        checkRunning();
      });
  
      // Send the response immediately once the container is running.
      c.json({ message: 'Container created and attached successfully' });
  
      // Schedule cleanup in the background after _removeTimeout milliseconds.
      setTimeout(() => {
        try {
          if (stream) {
            stream.end();
          }
        } catch (e) {
          console.error('Error ending stream:', e);
        }
        container.stop(() => {
          container.remove();
        });
      }, _removeTimeout);
    } catch (err) {
      console.error('Duplex container error:', err);
      return c.json({ error: err.message }, 500);
    }
  });

/* ============================================================
   2. Exec in Running Container Endpoint
   URL: POST /containers/exec
   Request JSON may include:
     - createOptions: options for container creation (default: Ubuntu bash)
     - startOptions: options for container.start (default: {})
     - execOptions: options for container.exec (default provided below)
   ============================================================ */
app.post(`${apiPrefix}/containers/exec`, async (c) => {
  try {
    const {
      createOptions,
      startOptions,
      execOptions
    } = await c.req.json().catch(() => ({}));

    const _createOptions = createOptions || { Image: 'ubuntu:latest', Cmd: ['/bin/bash'], Tty: true };
    const _startOptions = startOptions || {};
    const _execOptions = execOptions || {
      Cmd: ['bash', '-c', 'echo test $VAR'],
      Env: ['VAR=ttslkfjsdalkfj'],
      AttachStdout: true,
      AttachStderr: true
    };

    const container: any = await createContainerPromise(_createOptions);
    if (!container) {
      throw new Error('Failed to create container');
    }

    await new Promise((resolve, reject) => {
      container.start(_startOptions, (err) => {
        if (err) return reject(err);
        resolve(void 0);
      });
    });

    const execInstance = await new Promise((resolve, reject) => {
      container.exec(_execOptions, (err, execInstance) => {
        if (err) return reject(err);
        resolve(execInstance);
      });
    });

    const { stream, output } = await new Promise((resolve, reject) => {
      let outputData = '';
      execInstance.start((err, stream) => {
        if (err) return reject(err);
        container.modem.demuxStream(
          stream,
          { write(chunk) { outputData += chunk.toString('utf8'); } },
          { write(chunk) { outputData += chunk.toString('utf8'); } }
        );
        stream.on('end', () => {
          resolve({ stream, output: outputData });
        });
        stream.on('error', reject);
      });
    });

    const data = await new Promise((resolve, reject) => {
      execInstance.inspect((err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });

    return c.json({ execData: data, output });
  } catch (err) {
    console.error('Exec container error:', err);
    return c.json({ error: err.message }, 500);
  }
});

/* ============================================================
   3. External Volume Endpoint
   URL: POST /containers/volume
   Request JSON may include:
     - createOptions: object for container creation (defaults below)
   ============================================================ */
app.post(`${apiPrefix}/containers/volume`, async (c) => {
  try {
    const { createOptions } = await c.req.json().catch(() => ({}));
    const _createOptions = createOptions || {
      Image: 'ubuntu',
      Cmd: ['/bin/ls', '/stuff'],
      Volumes: { '/stuff': {} },
      HostConfig: { Binds: ['/tmp:/stuff'] }
    };
    const container: any = await createContainerPromise(_createOptions);
    let outputData = '';
    await new Promise((resolve, reject) => {
      container.start((err) => {
        if (err) return reject(err);
        container.attach({ stream: true, stdout: true, stderr: true, tty: true }, (err, stream) => {
          if (err) return reject(err);
          stream.on('data', (chunk) => { outputData += chunk.toString('utf8'); });
          container.wait((err) => {
            if (err) return reject(err);
            resolve(void 0);
          });
        });
      });
    });
    return c.json({ output: outputData });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

/* ============================================================
   4. List Containers Endpoint
   URL: GET /containers
   Accepts query parameters:
     - all (true/false)
     - limit (number)
     - filters (JSON string or plain string)
   ============================================================ */
app.get(`${apiPrefix}/containers`, async (c) => {
  try {
    const allParam = c.req.query('all');
    const limitParam = c.req.query('limit');
    const filtersParam = c.req.query('filters');
    let opts = {};
    if (allParam !== undefined) {
      opts.all = (allParam === 'true');
    }
    if (limitParam) {
      opts.limit = parseInt(limitParam, 10);
    }
    if (filtersParam) {
      try {
        opts.filters = JSON.parse(filtersParam);
      } catch (e) {
        opts.filters = filtersParam;
      }
    }
    const containers = await new Promise((resolve, reject) => {
      docker.listContainers(opts, (err, containers) =>
        err ? reject(err) : resolve(containers)
      );
    });
    return c.json({ containers });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

/* ============================================================
   5. Container Logs Endpoint
   URL: POST /containers/logs
   Request JSON may include:
     - createOptions: container creation options (default below)
     - startOptions: options for container.start (default: {})
     - logsOptions: options for container.logs (default below)
     - logTimeout: timeout in ms to destroy the stream (default: 2000)
   ============================================================ */
app.post(`${apiPrefix}/containers/logs`, async (c) => {
  try {
    const {
      createOptions,
      startOptions,
      logsOptions,
      logTimeout
    } = await c.req.json().catch(() => ({}));
    const _createOptions = createOptions || {
      Image: 'ubuntu:latest',
      Cmd: ['/bin/bash', '-c', 'echo "test log"']
    };
    const _startOptions = startOptions || {};
    const _logsOptions = logsOptions || { follow: true, stdout: true, stderr: true };
    const _logTimeout = logTimeout || 2000;

    const container: any = await createContainerPromise(_createOptions);
    if (!container) {
      throw new Error('Failed to create container');
    }

    await new Promise((resolve, reject) => {
      container.start(_startOptions, (err) => {
        if (err) return reject(err);
        resolve(void 0);
      });
    });

    const stream = await new Promise((resolve, reject) => {
      container.logs(_logsOptions, (err, stream) => {
        if (err) return reject(err);
        resolve(stream);
      });
    });

    let output = '';
    container.modem.demuxStream(
      stream,
      { write(chunk) { output += chunk.toString('utf8'); } },
      { write(chunk) { output += chunk.toString('utf8'); } }
    );

    await new Promise((resolve) => {
      stream.on('end', resolve);
      setTimeout(() => {
        stream.destroy();
        resolve(void 0);
      }, _logTimeout);
    });

    await new Promise((resolve, reject) => {
      container.remove((err) => {
        if (err) return reject(err);
        resolve(void 0);
      });
    });

    return c.json({ output });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

/* ============================================================
   6. Docker Run Shortcut Endpoint
   URL: POST /containers/run
   Request JSON must include (or default):
     - image: container image name (default: "ubuntu")
     - cmd: an array of command arguments (default: [])
     - options: container run options (volumes, ports, labels, etc.)
   ============================================================ */
app.post(`${apiPrefix}/containers/run`, async (c) => {
  try {
    const { image, cmd, options } = await c.req.json().catch(() => ({}));
    const _image = image || 'ubuntu:latest';
    const _cmd = cmd || ['echo', 'test'];
    const _options = options || {};

    let outputData = '';
    const outputStream = new Writable({
      write(chunk, encoding, callback) {
        outputData += chunk.toString('utf8');
        callback();
      }
    });

    const { data, container, waitData } = await new Promise((resolve, reject) => {
      docker.run(_image, _cmd, outputStream, _options, (err, data, container) => {
        if (err) return reject(err);
        container.wait((err, waitData) => {
          if (err) return reject(err);
          resolve({ data, container, waitData });
        });
      });
    });

    if (!container) {
      throw new Error('Failed to create container');
    }

    return c.json({
      statusCode: data.StatusCode,
      output: outputData,
      containerId: container.id,
      waitStatus: waitData
    });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

/* ============================================================
   7. Interactive Container Endpoint
   URL: POST /containers/interactive
   Request JSON may include:
     - createOptions: object for container creation (defaults below)
   Note: Since an HTTP API cannot stream an interactive TTY,
         this endpoint returns the container ID for external attachment.
   ============================================================ */
app.post(`${apiPrefix}/containers/interactive`, async (c) => {
  try {
    const { createOptions } = await c.req.json().catch(() => ({}));
    const _createOptions = createOptions || {
      Hostname: '',
      User: '',
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      Tty: true,
      OpenStdin: true,
      StdinOnce: false,
      Env: null,
      Cmd: ['/bin/bash'],
      Dns: ['8.8.8.8', '8.8.4.4'],
      Image: 'ubuntu',
      Volumes: {},
      VolumesFrom: []
    };
    const container: any = await createContainerPromise(_createOptions);
    await new Promise((resolve, reject) => {
      container.start((err) => {
        if (err) return reject(err);
        container.attach({ stream: true, stdin: true, stdout: true, stderr: true }, (err, stream) => {
          if (err) return reject(err);
          resolve(void 0);
        });
      });
    });
    return c.json({
      message: 'Interactive container started. Attach via "docker attach <containerId>".',
      containerId: container.id
    });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

/* ============================================================
   8. Container Top Endpoint
   URL: GET /containers/:id/top
   Accepts an optional query parameter "ps_args" (default: "aux")
   ============================================================ */
app.get(`${apiPrefix}/containers/:id/top`, async (c) => {
  try {
    const id = c.req.param('id');
    if (!id) {
      return c.json({ error: 'Container ID is required' }, 400);
    }

    const ps_args = c.req.query('ps_args') || 'aux';
    const container: any = docker.getContainer(id);

    const data = await new Promise((resolve, reject) => {
      container.inspect((err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });

    if (!data || !data.State || !data.State.Running) {
      throw new Error('Container is not running');
    }

    const topData = await new Promise((resolve, reject) => {
      container.top({ ps_args }, (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });

    const response = { processes: topData.Processes, titles: topData.Titles };

    return c.json(response);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

/* ============================================================
   9. Timeout Example Endpoint
   URL: POST /containers/timeout
   Request JSON may include:
     - dockerOptions: options for new Docker instance (default below)
     - createOptions: for container creation (default below)
     - startOptions: for container.start (default: {})
     - topOptions: for container.top (default below)
   ============================================================ */
app.post(`${apiPrefix}/containers/timeout`, async (c) => {
  try {
    const { dockerOptions, createOptions, startOptions, topOptions } = await c.req.json().catch(() => ({}));
    const _dockerOptions = dockerOptions || { host: 'http://127.0.0.1', port: 2375, timeout: 100 };
    const dockerTimeout = new Docker(_dockerOptions);
    const _createOptions = createOptions || { Image: 'ubuntu', Cmd: ['/bin/bash'] };
    const container: any = await new Promise((resolve, reject) => {
      dockerTimeout.createContainer(_createOptions, (err, container) => err ? reject(err) : resolve(container));
    });
    const _startOptions = startOptions || {};
    await new Promise((resolve, reject) => {
      container.start(_startOptions, (err) => (err ? reject(err) : resolve(void 0)));
    });
    const _topOptions = topOptions || { ps_args: 'aux' };
    const topData = await new Promise((resolve, reject) => {
      container.top(_topOptions, (err, data) => err ? reject(err) : resolve(data));
    });
    return c.json({ top: topData });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

/* ============================================================
   10. Build Image from Current Working Directory Endpoint
   URL: POST /build/buildcwd
   Request JSON may include:
     - contextDir: directory to pack (default: process.cwd())
     - tag: image tag (default: "imgcwd")
   ============================================================ */
app.post(`${apiPrefix}/build/buildcwd`, async (c) => {
  try {
    const { contextDir, tag } = await c.req.json().catch(() => ({}));
    const _contextDir = contextDir || process.cwd();
    const _tag = tag || 'imgcwd';
    const tarStream = tar.pack(_contextDir);
    const buildOutput = await new Promise((resolve, reject) => {
      docker.buildImage(tarStream, { t: _tag }, (err, output) => {
        if (err) return reject(err);
        let outputData = '';
        output.on('data', (chunk) => { outputData += chunk.toString('utf8'); });
        output.on('end', () => resolve(outputData));
        output.on('error', reject);
      });
    });
    return c.json({ buildOutput });
  } catch (err) {
    console.error('Build CWD error:', err);
    return c.json({ error: err.message }, 500);
  }
});

/* ============================================================
   11. Build Image from Specific Files Endpoint
   URL: POST /build/buildfiles
   Request JSON may include:
     - contextDir: directory to pack (default: process.cwd())
     - src: an array of filenames to include (default: ["Dockerfile", "run.js"])
     - tag: image tag (default: "imgcwd")
   ============================================================ */
app.post(`${apiPrefix}/build/buildfiles`, async (c) => {
  try {
    const { contextDir, src, tag } = await c.req.json().catch(() => ({}));
    const _contextDir = contextDir || process.cwd();
    const _src = src || ['Dockerfile', 'run.js'];
    const _tag = tag || 'imgcwd';
    const tarStream = tar.pack(_contextDir, { entries: _src });
    const buildOutput = await new Promise((resolve, reject) => {
      docker.buildImage(tarStream, { t: _tag }, (err, output) => {
        if (err) return reject(err);
        let outputData = '';
        output.on('data', (chunk) => { outputData += chunk.toString('utf8'); });
        output.on('end', () => resolve(outputData));
        output.on('error', reject);
      });
    });
    return c.json({ buildOutput });
  } catch (err) {
    console.error('Build files error:', err);
    return c.json({ error: err.message }, 500);
  }
});

/* ============================================================
   12. Build and Run Image from Tar File Endpoint
   URL: POST /build/run
   Request JSON must include:
     - tarFilePath: path to the tar file for build
   Request JSON may also include:
     - tag: image tag (default: "chrome")
     - containerOptions: options for container creation after build (default provided below)
   ============================================================ */
app.post(`${apiPrefix}/build/run`, async (c) => {
  try {
    const { tarFilePath, tag, containerOptions } = await c.req.json().catch(() => ({}));
    if (!tarFilePath) {
      return c.json({ error: 'tarFilePath is required' }, 400);
    }
    const _tag = tag || 'chrome';
    const buildOutput = await new Promise((resolve, reject) => {
      docker.buildImage(tarFilePath, { t: _tag }, (err, stream) => {
        if (err) return reject(err);
        let outputData = '';
        stream.on('data', (chunk) => { outputData += chunk.toString('utf8'); });
        stream.on('end', () => resolve(outputData));
        stream.on('error', reject);
      });
    });
    const _containerOptions = containerOptions || {
      Image: _tag,
      Cmd: ['/bin/bash', '-c', 'echo "test output"'],
      Tty: true
    };
    const container: any = await createContainerPromise(_containerOptions);
    let runOutput = '';
    await new Promise((resolve, reject) => {
      container.attach({ stream: true, stdout: true, stderr: true, tty: true }, (err, stream) => {
        if (err) return reject(err);
        stream.on('data', (chunk) => { runOutput += chunk.toString('utf8'); });
        container.start((err) => {
          if (err) return reject(err);
          container.wait((err) => {
            if (err) return reject(err);
            resolve(void 0);
          });
        });
      });
    });

    await new Promise((resolve, reject) => {
      container.remove((err) => {
        if (err) return reject(err);
        resolve(void 0);
      });
    });

    return c.json({ buildOutput, runOutput });
  } catch (err) {
    console.error('Build and run error:', err);
    return c.json({ error: err.message }, 500);
  }
});

/* ============================================================
   13. Container Top Endpoint
   URL: POST /containers/:id/exec
   Request JSON may include:
   - execOptions: options for container.exec (default provided below)
   ============================================================ */
   app.post(`${apiPrefix}/containers/:id/exec`, async (c) => {
    try {
      const id = c.req.param('id');
      const { execOptions } = await c.req.json();

      if (!id) {
        return c.json({ error: 'Container ID is required' }, 400);
      }

      const container: any = docker.getContainer(id);
  
      const _execOptions = execOptions ?? {
        Cmd: ['bash', '-c', 'echo test $VAR'],
        Env: ['VAR=Agent-Running'],
        AttachStdout: true,
        AttachStderr: true
      };

    // First ensure container exists and get its state
    const inspectData = await new Promise((resolve, reject) => {
      container.inspect((err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });

    // If not running, start it
    if (!inspectData.State.Running) {
      await new Promise((resolve, reject) => {
        container.start((err) => {
          if (err) return reject(err);
          resolve(void 0);
        });
      });

      // Wait for container to be fully started
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Execute the command
    const execInstance = await new Promise((resolve, reject) => {
      container.exec(_execOptions, (err, execInstance) => {
        if (err) return reject(err);
        resolve(execInstance);
      });
    });

    const { stream, output } = await new Promise((resolve, reject) => {
      
      let outputData = '';

      execInstance.start((err, stream) => {
        if (err) return reject(err);
        container.modem.demuxStream(
          stream,
          { write(chunk) { outputData += chunk.toString('utf8'); } },
          { write(chunk) { outputData += chunk.toString('utf8'); } }
        );
        stream.on('end', () => {
          resolve({ stream, output: outputData });
        });
        stream.on('error', reject);
      });
      
    });

    const data = await new Promise((resolve, reject) => {
      execInstance.inspect((err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });

    return c.json({ output });
    } catch (err) {
      return c.json({ error: err.message }, 500);
    }
  });


// Container inspection
app.get(`${apiPrefix}/containers/:id/inspect`, async (c) => {
  try {
    const container = docker.getContainer(c.req.param('id'));
    const data = await container.inspect();
    return c.json(data);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// Image endpoints
app.get(`${apiPrefix}/images`, async (c) => {
  try {
    const images = await docker.listImages();
    return c.json({ images });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// Docker info/version
app.get(`${apiPrefix}/docker/info`, async (c) => {
  try {
    const info = await docker.info();
    return c.json(info);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// Generate docker-compose file endpoint
app.post(`${apiPrefix}/docker/write-compose-file`, async (c) => {
  try {
    const { dockerImageName, envVars, agentServerPort, agentJwtSecret, agentHostDomain } = await c.req.json();
    
    // Validate required parameters
    if (!dockerImageName || !envVars || !agentServerPort || !agentJwtSecret || !agentHostDomain) {
      return c.json({ 
        error: 'Missing required parameters. Please provide dockerImageName, envVars, and agentServerPort' 
      }, 400);
    }

    // Call the generateDockerComposeFile function
    const composePath = generateDockerComposeFile({
      dockerImageName,
      envVars,
      agentServerPort,
      agentJwtSecret,
      agentHostDomain
    });

    return c.json({ 
      success: true, 
      message: 'Docker compose file generated successfully',
      composePath 
    });
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// Generate docker-compose file endpoint
app.post(`${apiPrefix}/docker/:agentId/write-compose-file`, async (c) => {
  try {
    const agentId = c.req.param('agentId');
    const { dockerImageName, envVars, agentServerPort, agentJwtSecret, agentHostDomain } = await c.req.json();
    
    // Validate required parameters
    if (!dockerImageName || !envVars || !agentServerPort) {
      return c.json({ 
        error: 'Missing required parameters. Please provide dockerImageName, envVars, and agentServerPort' 
      }, 400);
    }

    // Call the generateDockerComposeFile function
    const composePath = generateDockerComposeFile({
      dockerImageName,
      envVars,
      agentServerPort,
      agentJwtSecret,
      agentHostDomain
    });

    return c.json({ 
      success: true, 
      message: 'Docker compose file generated successfully',
      agentId,
      composePath 
    });

  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// Generate docker-compose file endpoint
app.get(`${apiPrefix}/docker/:agentId/read-default-character-json`, async (c) => {
  try {
    const agentId = c.req.param('agentId');
    const composePath = c.req.query('composePath');
    
    if (!composePath) {
      return c.json({ 
        success: false, 
        message: 'composePath is required' 
      }, 400);
    }

    const characterJson = readDefaultCharacterJson(composePath);
    
    if (!characterJson) {
      return c.json({ 
        success: false, 
        message: 'Failed to read default character JSON' 
      }, 404);
    }

    return c.json({ 
      success: true, 
      message: 'Default character JSON read successfully',
      characterJson,
      characterFilePath: `${path.dirname(composePath)}/default.character.json` 
    });
  } catch (err: any) {
    console.error('Error reading default character JSON:', err);
    return c.json({ 
      success: false, 
      message: err.message || 'Failed to read default character JSON'
    }, 500);
  }
});

app.post(`${apiPrefix}/docker/:agentId/write-default-character-json`, async (c) => {
  try {
    const agentId = c.req.param('agentId');
    const { composePath, characterJson } = await c.req.json();
    
    // Validate required parameters
    if (!composePath || !characterJson) {
      return c.json({ 
        error: 'Missing required parameters. Please provide composePath and characterJson' 
      }, 400);
    }

    // Call the generateDockerComposeFile function
    const defaultCharacterJson = writeDefaultCharacterJson(
      composePath,
      characterJson
    );

    // Extract the directory from the composePath.
    const dirPath = path.dirname(composePath);

    return c.json({ 
      success: true, 
      message: 'Default character JSON generated successfully',
      agentId,
      characterFilePath: `${dirPath}/default.character.json` 
    });

  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});


// Deploy docker-compose file endpoint
app.post(`${apiPrefix}/docker/:agentId/deploy-compose`, async (c) => {  
  let output: any;
  const agentId = c.req.param('agentId');

  try {  
    const { composePath } = await c.req.json();
    
    // Validate required parameter
    if (!composePath) {
      return c.json({ 
        error: 'Missing required parameter: composePath' 
      }, 400);
    }

    // Call the runDeployment function
    try {
      output = await runDeployment(composePath);
    } catch (e) {
      return c.json({ 
        success: false, 
        error: e.message || 'Failed to deploy docker-compose file'
      }, 500);
    }
    
    console.log({output})

  } catch (err) {
    return c.json({ 
      success: false, 
      error: err.message || 'Failed to deploy docker-compose file'
    }, 500);
  }

  return c.json({ 
    success: true, 
    message: 'Docker compose deployment executed successfully',
    agentId: agentId,
    output: output
  });

});


// Deploy docker-compose file endpoint
app.post(`${apiPrefix}/docker/deploy-compose`, async (c) => {
  try {
    const { composePath } = await c.req.json();
    
    // Validate required parameter
    if (!composePath) {
      return c.json({ 
        error: 'Missing required parameter: composePath' 
      }, 400);
    }

    // Call the runDeployment function
    const output = await runDeployment(composePath);

    return c.json({ 
      success: true, 
      message: 'Docker compose deployment executed successfully',
      output 
    });
  } catch (err) {
    return c.json({ 
      success: false, 
      error: err.message || 'Failed to deploy docker-compose file'
    }, 500);
  }
});


// Down docker-compose file endpoint
app.post(`${apiPrefix}/docker/:agentId/down-compose`, async (c) => {  
  let output: any;
  const agentId = c.req.param('agentId');

  try {  
    const { composePath } = await c.req.json();
    
    // Validate required parameter
    if (!composePath) {
      return c.json({ 
        error: 'Missing required parameter: composePath' 
      }, 400);
    }

    // Call the runComposeDown function
    try {
      output = await runComposeDown(`${composePath}/docker-compose.yaml`);
    } catch (e) {
      return c.json({ 
        success: false, 
        error: e.message || 'Failed to down docker-compose file'
      }, 500);
    }
    
    console.log({output})

  } catch (err) {
    return c.json({ 
      success: false, 
      error: err.message || 'Failed to down docker-compose file'
    }, 500);
  }

  return c.json({ 
    success: true, 
    message: 'Docker compose down executed successfully',
    agentId: agentId,
    output: output
  });

});


// Remove docker-compose file endpoint
app.post(`${apiPrefix}/docker/:agentId/remove-compose`, async (c) => {  
  let output: any;
  const agentId = c.req.param('agentId');

  try {  
    const { composePath } = await c.req.json();
    
    // Validate required parameter
    if (!composePath) {
      return c.json({ 
        error: 'Missing required parameter: composePath' 
      }, 400);
    }

    // Call the runComposeRemove function
    try {
      output = await runComposeRemove(`${composePath}/docker-compose.yaml`);
    } catch (e) {
      return c.json({ 
        success: false, 
        error: e.message || 'Failed to remove docker-compose file'
      }, 500);
    }
    
    console.log({output})

  } catch (err) {
    return c.json({ 
      success: false, 
      error: err.message || 'Failed to remove docker-compose file'
    }, 500);
  }

  return c.json({ 
    success: true, 
    message: 'Docker compose remove executed successfully',
    agentId: agentId,
    output: output
  });

});


// Create a agent subdomain endpoint
app.post(`${apiPrefix}/agent/create-subdomain`, async (c) => {
  try {
    const { composePath } = await c.req.json();

    // Validate required parameter
    if (!composePath) {
      return c.json({ 
        error: 'Missing required parameter: composePath' 
      }, 400);
    }

    const result = await createAgentSubdomain(composePath);

    return c.json({ 
      success: true, 
      message: 'Agent subdomain created successfully',
      result
    });

  } catch (err) {
    return c.json({ 
      success: false, 
      error: err.message || 'Failed to create agent subdomain'
    }, 500);
  }
});

// Remove a agent subdomain endpoint
app.post(`${apiPrefix}/agent/remove-subdomain`, async (c) => {
  try {
    const { composePath } = await c.req.json();

    // Validate required parameter
    if (!composePath) {
      return c.json({ 
        error: 'Missing required parameter: composePath' 
      }, 400);
    }

    const result = await removeAgentSubdomain(composePath);

    return c.json({ 
      success: true, 
      message: 'Agent subdomain removed successfully',
      result
    });

  } catch (err) {
    return c.json({ 
      success: false, 
      error: err.message || 'Failed to remove agent subdomain'
    }, 500);
  }
});

// Generate JWT token endpoint
app.post(`${apiPrefix}/jwt/:organizationId/sign`, async (c) => {
  try {
    const { userid, apikey, iat } = await c.req.json();

    // Validate required parameter
    if (!userid || !apikey || !iat) {
      return c.json({ 
        error: 'Missing required jwt parameter' 
      }, 400);
    }

    const result = await signJwt({userid, apikey, iat});

    return c.json({ 
      success: true, 
      message: 'JWT token generated successfully',
      result
    });

  } catch (err) {
    return c.json({ 
      success: false, 
      error: err.message || 'Failed to generate JWT token'
    }, 500);
  }
});


// Extract env variables default values endpoint
app.post(`${apiPrefix}/envs/extract`, async (c) => {
  try {
    const { keysToExtract } = await c.req.json();

    if (!keysToExtract) {
      return c.json({ error: 'Keys to extract is required' }, 400);
    }

    const envVariables = parseAndExtractEnvVariables(keysToExtract);

    return c.json({ 
      success: true, 
      message: 'Env variables extracted successfully',
      envVariables
    });

  } catch (err) {
    return c.json({ 
      success: false, 
      error: err.message || 'Failed to extract env variables'
    }, 500);
  }
});

// Get template file endpoint
app.get(`${apiPrefix}/templates/:tplname`, async (c) => {
  try {
    const tplname = c.req.param('tplname');
    if (!tplname) {
      return c.json({ error: 'Template name is required' }, 400);
    }

    // Ensure the template name has .json extension
    const fileName = tplname.endsWith('.json') ? tplname : `${tplname}.json`;
    const templatesDir = path.join(process.cwd(), 'src', 'templates');
    const filePath = path.join(templatesDir, fileName);

    // Check if file exists and is within templates directory (prevent directory traversal)
    if (!filePath.startsWith(templatesDir) || !fs.existsSync(filePath)) {
      return c.json({ error: 'Template not found' }, 404);
    }

    // Read and parse the JSON file
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const jsonContent = JSON.parse(fileContent);

    return c.json(jsonContent);
  } catch (err) {
    console.error('Error reading template:', err);
    return c.json({ 
      error: err instanceof SyntaxError ? 'Invalid JSON format' : 'Failed to read template file' 
    }, 500);
  }
});

// Get plugins endpoint
app.get(`${apiPrefix}/plugins`, async (c) => {
  try {
    const plugins = await fetchPlugins();
    return c.json(plugins);
  } catch (err) {
    return c.json({ error: err}, 500);
  }
});

// Get plugins listing endpoint
app.get(`${apiPrefix}/plugins/listing`, async (c) => {
  try {
    const plugins = await fetchPluginsListing();
    return c.json(plugins);
  } catch (err) {
    return c.json({ error: err}, 500);
  }
});

// Get plugin config file endpoint
app.get(`${apiPrefix}/plugins/:pluginname`, async (c) => {
  try {
    const pluginName = c.req.param('pluginname');
    if (!pluginName) {
      return c.json({ error: 'Plugin name is required' }, 400);
    }

    // Ensure the plugin name has .json extension
    const fileName = `package.json`;
    const pluginDir = path.join(process.cwd(), 'src', 'plugins', `${pluginName}`);
    const filePath = path.join(pluginDir, fileName);

    // Check if file exists and is within plugins directory (prevent directory traversal)
    if (!filePath.startsWith(pluginDir) || !fs.existsSync(filePath)) {
      return c.json({ error: 'Plugin not found' }, 404);
    }

    // Read and parse the JSON file
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const jsonContent = JSON.parse(fileContent);

    return c.json(jsonContent);
  } catch (err) {
    console.error('Error reading plugin config file:', err);
    return c.json({ 
      error: err instanceof SyntaxError ? 'Invalid JSON format' : 'Failed to read plugin config file' 
    }, 500);
  }
});

// Start the Bun server
Bun.serve({
  fetch: app.fetch,
  hostname: "0.0.0.0",
  port: 8387,
});

console.log('🤖 Synapze Agent API server running on http://localhost:8387');