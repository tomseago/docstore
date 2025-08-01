import { OpenAPIRoute } from "chanfana";
import { z } from "zod";

export class AuthHello extends OpenAPIRoute {
    schema = {
        summary: "Return a hello world message (with JWT auth required)",
        security: [{ bearerAuth: [] }], // Specify the JWT security scheme
        responses: {
            "200": {
                description: "Returns a hello world message",
                content: {
                    "text/plain": {
                        schema: z.string(),
                    },
                },
            },
            "401": {
                description: "JWT token is missing or invalid",
            },
        },
    };

    async handle() {
        return new Response("Hello World (authenticated)", {
            headers: {
                "Content-Type": "text/plain",
            },
        });
    }
}