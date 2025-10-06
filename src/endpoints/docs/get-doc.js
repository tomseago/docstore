import { OpenAPIRoute, Str, Bool } from "chanfana";
import { z } from "zod";

export class GetDoc extends OpenAPIRoute {
    schema = {
        tags: ["Documents"],
        summary: "Fetch a single document by ID",
        security: [{ bearerAuth: [] }], // Specify the JWT security scheme
        request: {
            params: z.object({
                id: Str({ description: "The document ID" }),
            }),
        },
        responses: {
            "200": {
                description: "Document retrieved successfully",
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

        // TODO: Replace this mock with a Notion API fetch
        const mockDoc = {
            id,
            title: "Mock Title",
            content: "# Example Markdown Content",
            metadata: {
                createdBy: "system",
            },
        };

        const exists = !!mockDoc;

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

        return {
            series: {
                success: true,
                result: mockDoc,
            },
        };
    }
}