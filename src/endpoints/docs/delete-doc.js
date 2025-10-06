import { OpenAPIRoute, Str, Bool } from "chanfana";
import { z } from "zod";

export class DeleteDoc extends OpenAPIRoute {
    schema = {
        tags: ["Documents"],
        summary: "Delete a document by ID",
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({
                id: Str({ description: "The document ID to delete" }),
            }),
            query: z.object({
                cascade: z
                    .enum(["true", "false"])
                    .optional()
                    .describe("If true, also delete all children of this document"),
            }),
        },
        responses: {
            "200": {
                description: "Document deleted successfully",
                content: {
                    "application/json": {
                        schema: z.object({
                            series: z.object({
                                success: Bool(),
                                result: z.object({
                                    id: Str(),
                                    cascade: Bool(),
                                }),
                            }),
                        }),
                    },
                },
            },
            "404": {
                description: "Document not found",
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
        const data = await this.getValidatedData();
        const { id } = data.params;
        const cascade = c.req.query("cascade") === "true";

        // TODO: Replace with Notion delete logic
        const exists = true; // Simulated check

        if (!exists) {
            return Response.json(
                {
                    series: {
                        success: false,
                        error: "Document not found",
                    },
                },
                { status: 404 }
            );
        }

        // Simulated deletion
        return {
            series: {
                success: true,
                result: {
                    id,
                    cascade,
                },
            },
        };
    }
}