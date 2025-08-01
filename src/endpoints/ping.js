import { Bool, OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";
// import { type AppContext, Task } from "../types";

export class Ping extends OpenAPIRoute {
    schema = {
        // tags: ["Tasks"],
        summary: "Return a pong message",
        request: {
            params: z.object({
                designator: Str({ description: "Ping designator to be echoed in response" }),
            }),
        },
        responses: {
            "200": {
                description: "Returns a pong message that includes the passed designator if any",
                content: {
                    "application/json": {
                        schema: z.object({
                            series: z.object({
                                success: Bool(),
                                result: z.object({
                                    designator: Str(),
                                }),
                            }),
                        }),
                    },
                },
            },
            "404": {
                description: "Ping not found",
                content: {
                    "application/json": {
                        schema: z.object({
                            series: z.object({
                                success: Bool(),
                                error: Str(),
                            }),
                        }),
                    },
                },
            },
        },
    };

    async handle(c) {
        // Get validated data
        const data = await this.getValidatedData();

        // Retrieve the validated slug
        const { designator } = data.params;

        // Implement your own object fetch here

        const exists = true;

        // @ts-ignore: check if the object exists
        if (exists === false) {
            return Response.json(
                {
                    success: false,
                    error: "Object not found",
                },
                {
                    status: 404,
                },
            );
        }

        return {
            success: true,
            designator: designator,
        };
    }
}
