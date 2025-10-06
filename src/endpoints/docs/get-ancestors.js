import { OpenAPIRoute, Str, Bool } from "chanfana";
import { z } from "zod";

export class GetDocAncestors extends OpenAPIRoute {
    schema = {
        tags: ["Documents"],
        summary: "Return breadcrumb ancestors for a document",
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({
                id: Str({ description: "The document ID to resolve ancestors for" }),
            }),
        },
        responses: {
            "200": {
                description: "Ancestors retrieved successfully",
                content: {
                    "application/json": {
                        schema: z.object({
                            series: z.object({
                                success: Bool(),
                                result: z.array(
                                    z.object({
                                        id: Str(),
                                        title: Str(),
                                    })
                                ),
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

        // TODO: Replace with a Notion query to compute ancestors
        const exists = true;
        if (!exists) {
            return Response.json(
                { series: { success: false, error: "Document not found" } },
                { status: 404 }
            );
        }

        const mockAncestors = [
            { id: "root", title: "Root" },
            { id: "collection-1", title: "Collection" },
            { id, title: "Current Doc" },
        ];

        return { series: { success: true, result: mockAncestors } };
    }
}