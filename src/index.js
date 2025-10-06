import { fromHono } from "chanfana";
import { Hono } from "hono";
import { bearerAuth } from 'hono/bearer-auth'


import { AuthHello } from "./endpoints/hello";
import { Ping } from "./endpoints/ping";

import { CreateDoc } from "./endpoints/docs/create-doc";
import { GetDoc } from "./endpoints/docs/get-doc";


// Start a Hono app
const app = new Hono();




app.use('/auth/*', (c, next) => {
    console.log("env variables");
    console.log(c.env);

    var secret = c.env.AUTH_SECRET;
    if (!secret) {
        secret = 'DEFAULT_AUTH_SECRET';
        console.error(`AUTH_SECRET not set. Will use default value ${secret}`);
    }
    const bearerMiddleware = bearerAuth({
        token: secret,
    });

    return bearerMiddleware(c, next)
});


// Setup OpenAPI registry
const openapi = fromHono(app, {
    docs_url: "/",
});
openapi.registry.registerComponent(
    'securitySchemes',
    'bearerAuth',
    {
        type: 'http',
        scheme: 'bearer',
        // bearerFormat: 'JWT',
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

openapi.post("/auth/docs/create", CreateDoc);
openapi.get("/auth/docs/:id", GetDoc);


// You may also register routes for non OpenAPI directly on Hono
// app.get('/test', (c) => c.text('Hono!'))

// Export the Hono app
export default app;