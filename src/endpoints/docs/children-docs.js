import { OpenAPIRoute, Str, Bool } from "chanfana";
import { z } from "zod";

export class GetDocChildren extends OpenAPIRoute {
    schema = {
        tags: ["Documents"],
        summary: "Get immediate children of a document",
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({
                id: Str({ description: "ID of the parent document" }),
            }),
        },
        responses: {
            "200": {
                description: "Children documents retrieved successfully",
                content: {
                    "application/json": {
                        schema: z.object({
                            series: z.object({
                                success: Bool(),
                                result: z.array(
                                    z.object({
                                        id: Str(),
                                        title: Str(),
                                        content: Str(),
                                        metadata: z.record(z.any()).optional(),
                                    })
                                ),
                            }),
                        }),
                    },
                },
            },
            "404": {
                description: "Parent document not found",
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

        // TODO: Replace with Notion API call to retrieve children
        const exists = true;

        if (!exists) {
            return Response.json(
                {
                    series: {
                        success: false,
                        error: "Parent document not found",
                    },
                },
                { status: 404 }
            );
        }

        const mockChildren = [
            {
                id: crypto.randomUUID(),
                title: "Child Document 1",
                content: "# Child 1 Content",
                metadata: { createdBy: "user" },
            },
            {
                id: crypto.randomUUID(),
                title: "Child Document 2",
                content: "# Child 2 Content",
                metadata: { createdBy: "user" },
            },
        ];

        return {
            series: {
                success: true,
                result: mockChildren,
            },
        };
    }
}