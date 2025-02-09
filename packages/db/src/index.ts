// server.js
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { getUserById } from "./lib/users";

const apiPrefix = '/v1';

const app = new Hono();

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

// Error handling middleware
app.onError((err, c) => {
    console.error(`${err}`)
    return c.json({ error: 'Internal Server Error' }, 500)
})

// Not Found handler
app.notFound((c) => {
    return c.json({ error: 'Not Found' }, 404)
})

// DB connection

// Root route
app.get('/', (c) => c.text('SYNAPZE DB API Server v0.0.1'))

// health check
app.get('/health', (c) => c.text('OK'))

app.get(`${apiPrefix}/users/:id`, async (c) => {
    try {
        const user = await getUserById(c.req.param('id'));
        return c.json(user);

    } catch (err) {
        return c.json({ error: err }, 404);
    }
});

Bun.serve({
    fetch: app.fetch,
    port: 8787,
});

console.log('🫙 Synapze DB server running on http://localhost:8787');