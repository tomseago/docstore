import { fromHono } from "chanfana";
import { Hono } from "hono";
import { jwt } from 'hono/jwt'


import { AuthHello } from "./endpoints/hello";

import { Ping } from "./endpoints/ping";
// import { TaskCreate } from "./endpoints/taskCreate";
// import { TaskDelete } from "./endpoints/taskDelete";
// import { TaskFetch } from "./endpoints/taskFetch";
// import { TaskList } from "./endpoints/taskList";

// Start a Hono app
const app = new Hono();




app.use('/auth/*', (c, next) => {

    var secret = c.env.JWT_SECRET;
    if (!secret) {
        secret = 'DEFAULT_HS256_SECRET_ABC12345678';
        console.error("JWT_SECRET not set. Will use default value '$(secret)'");
    }
    const jwtMiddleware = jwt({
        secret: secret,
    });

    return jwtMiddleware(c, next)
})

// Setup OpenAPI registry
const openapi = fromHono(app, {
    docs_url: "/",
});
const bearerAuth = openapi.registry.registerComponent(
    'securitySchemes',
    'bearerAuth',
    {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
    },
);

// Register OpenAPI endpoints
//openapi.get("/api/hello", Hello);
openapi.get("/api/ping/:designator", Ping);
// openapi.get("/api/tasks", TaskList);
// openapi.post("/api/tasks", TaskCreate);
// openapi.get("/api/tasks/:taskSlug", TaskFetch);
// openapi.delete("/api/tasks/:taskSlug", TaskDelete);

// So we can test auth
openapi.get("/auth/hello", AuthHello);

// You may also register routes for non OpenAPI directly on Hono
// app.get('/test', (c) => c.text('Hono!'))

// Export the Hono app
export default app;