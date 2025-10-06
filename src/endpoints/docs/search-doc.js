import { OpenAPIRoute, Str, Bool } from "chanfana";
import { z } from "zod";

export class SearchDocs extends OpenAPIRoute {
    schema = {
        tags: ["Search"],
        summary: "Search documents by keyword",
        security: [{ bearerAuth: [] }],
        request: {
            query: z.object({
                q: Str({ description: "Search query string" }),
                limit: z.coerce.number().int().positive().max(100).optional()
                    .describe("Max results to return (default depends on backend, max 100)"),
                cursor: Str({ description: "Opaque pagination cursor" }).optional(),
            }),
        },
        responses: {
            "200": {
                description: "Search results",
                content: {
                    "application/json": {
                        schema: z.object({
                            series: z.object({
                                success: Bool(),
                                result: z.object({
                                    items: z.array(
                                        z.object({
                                            id: Str(),
                                            title: Str(),
                                            // Optional helpful fields:
                                            snippet: Str().optional(),    // e.g., markdown excerpt
                                            path: z
                                                .array(z.object({ id: Str(), title: Str() }))
                                                .optional(),                // breadcrumb path
                                        })
                                    ),
                                    nextCursor: Str().optional(),
                                }),
                            }),
                        }),
                    },
                },
            },
        },
    };

    async handle(c) {
        const data = await this.getValidatedData();
        const { q, limit, cursor } = data.query;

        // TODO: Wire to Notion search API.
        // Respect limit & cursor for pagination.

        const mock = [
            {
                id: "doc-123",
                title: "How to wire the Notion API",
                snippet: "…use the official SDK and map your block tree…",
                path: [{ id: "root", title: "Root" }, { id: "col", title: "Guides" }],
            },
            {
                id: "doc-456",
                title: "Markdown Conventions",
                snippet: "…headers, lists, code blocks, and callouts…",
                path: [{ id: "root", title: "Root" }],
            },
        ];

        const items = typeof limit === "number" ? mock.slice(0, limit) : mock;
        const nextCursor = undefined; // Set if you have more pages

        return {
            series: {
                success: true,
                result: { items, nextCursor },
            },
        };
    }
}