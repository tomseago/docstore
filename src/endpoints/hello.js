import { OpenAPIRoute } from "chanfana";
import { z } from "zod";

export class Hello extends OpenAPIRoute {
    schema = {
        summary: "Return a hello world message",
        responses: {
            "200": {
                description: "Returns a hello world message",
                content: {
                    "text/plain": {
                        schema: z.string(),
                    },
                },
            },
        },
    };

    async handle() {
        return new Response("Hello World", {
            headers: {
                "Content-Type": "text/plain"
            }
        });
    }
}