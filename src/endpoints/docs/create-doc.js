import { OpenAPIRoute, Str, Bool } from "chanfana";
import { z } from "zod";

export class CreateDoc extends OpenAPIRoute {
    schema = {
        tags: ["Documents"],
        summary: "Create a new document",
        security: [{ bearerAuth: [] }], // Specify the JWT security scheme
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: z.object({
                            title: Str({ description: "Title of the new document" }),
                            content: Str({ description: "Document content in markdown format" }),
                            parentId: Str({ description: "Optional parent document ID", optional: true }),
                            metadata: z.record(z.any()).optional(),
                        })
                    }
                }
            },
        },
        responses: {
            "200": {
                description: "Document created successfully",
                content: {
                    "application/json": {
                        schema: z.object({
                            series: z.object({
                                success: Bool(),
                                result: z.object({
                                    id: Str(),
                                    title: Str(),
                                    content: Str(),
                                    parentId: Str().optional(),
                                    metadata: z.record(z.any()).optional(),
                                }),
                            }),
                        }),
                    },
                },
            },
            "400": {
                description: "Invalid request or failed to create document",
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
        const { title, content, parentId, metadata } = data.body;

        // TODO: Replace this with Notion API integration
        const newDoc = {
            id: crypto.randomUUID(), // mock ID for now
            title,
            content,
            parentId,
            metadata,
        };

        const success = !!newDoc;

        if (!success) {
            return Response.json(
                {
                    series: {
                        success: false,
                        error: "Failed to create document",
                    },
                },
                { status: 400 }
            );
        }

        return {
            series: {
                success: true,
                result: newDoc,
            },
        };
    }
}