


import { fromHono } from "chanfana";
import { Hono } from "hono";
import { bearerAuth } from 'hono/bearer-auth'


import { AuthHello } from "./endpoints/hello";
import { Ping } from "./endpoints/ping";

import { CreateDoc } from "./endpoints/docs/create-doc";
import { GetDoc } from "./endpoints/docs/get-doc";
import {DeleteDoc} from "./endpoints/docs/delete-doc";
import {PatchDoc} from "./endpoints/docs/patch-doc";
import {ReplaceDoc} from "./endpoints/docs/replace-doc";
import {GetDocChildren} from "./endpoints/docs/children-docs";
import {CreateChildDoc} from "./endpoints/docs/create-child-doc";
import {MoveDoc} from "./endpoints/docs/move-doc";
import {GetDocAncestors} from "./endpoints/docs/get-ancestors";
import {GetDocTree} from "./endpoints/docs/get-tree";
import {SearchDocs} from "./endpoints/docs/search-doc";


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

openapi.post("/auth/docs", CreateDoc);
openapi.get("/auth/docs/:id", GetDoc);
openapi.delete("/auth/docs/:id", DeleteDoc);
openapi.patch("/auth/docs/:id", PatchDoc);
openapi.put("/auth/docs/:id", ReplaceDoc);

openapi.get("/auth/docs/:id/children", GetDocChildren);
openapi.post("/auth/docs/:id/children", CreateChildDoc);
openapi.patch("/auth/docs/:id/move", MoveDoc);

openapi.get("/auth/docs/:id/ancestors", GetDocAncestors );
openapi.get("/auth/docs/:id/tree", GetDocTree );
openapi.get("/auth/search", SearchDocs );

// You may also register routes for non OpenAPI directly on Hono
// app.get('/test', (c) => c.text('Hono!'))

// Export the Hono app
export default app;