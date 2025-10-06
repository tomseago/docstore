import { OpenAPIRoute, Str, Bool } from "chanfana";
import { z } from "zod";

export class ReplaceDoc extends OpenAPIRoute {
    schema = {
        tags: ["Documents"],
        summary: "Replace an entire document",
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({
                id: Str({ description: "The ID of the document to replace" }),
            }),
            body: {
                content: {
                    "application/json": {
                        schema: z.object({
                            title: Str(),
                            content: Str(),
                            metadata: z.record(z.any()).optional(),
                        }),
                    },
                },
            },
        },
        responses: {
            "200": {
                description: "Document replaced successfully",
                content: {
                    "application/json": {
                        schema: z.object({
                            series: z.object({
                                success: Bool(),
                                result: z.object({
                                    id: Str(),
                                    title: Str(),
                                    content: Str(),
                                    metadata: z.record(z.any()).optional(),
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
        const { title, content, metadata } = data.body.content["application/json"];

        // TODO: Replace with Notion API logic
        const exists = true;

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

        const updated = {
            id,
            title,
            content,
            metadata,
        };

        return {
            series: {
                success: true,
                result: updated,
            },
        };
    }
}