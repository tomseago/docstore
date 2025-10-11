import { OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

/**
 * Non-recursive tree node facade with explicit OpenAPI property definitions.
 * This makes the Swagger example and structure visible.
 */
const TreeNode = z
    .object({
        id: z.string().openapi({
            type: "string",
            description: "Unique document ID",
            example: "doc_123",
        }),
        title: z.string().openapi({
            type: "string",
            description: "Document title",
            example: "Project Overview",
        }),
        children: z
            .array(
                z.object({
                    id: z.string().openapi({
                        type: "string",
                        description: "Child document ID",
                        example: "doc_456",
                    }),
                    title: z.string().openapi({
                        type: "string",
                        description: "Child document title",
                        example: "Introduction",
                    }),
                })
            )
            .optional()
            .openapi({
                type: "array",
                description:
                    "Child nodes (recursively shaped at runtime). Only one level shown for documentation clarity.",
            }),
    })
    .openapi({
        type: "object",
        refId: "TreeNode",
        description: "A document node in the tree hierarchy.",
        example: {
            id: "root-1",
            title: "Root Node",
            children: [
                { id: "child-1", title: "First child" },
                { id: "child-2", title: "Second child" },
            ],
        },
    });

// Explicit top-level response schema so structure is visible in docs
const TreeResponse = z
    .object({
        series: z.object({
            success: z.boolean().openapi({
                type: "boolean",
                description: "Indicates whether the request was successful",
                example: true,
            }),
            result: TreeNode,
        }),
    })
    .openapi({
        type: "object",
        refId: "TreeResponse",
        description: "Response payload containing the document tree.",
        example: {
            series: {
                success: true,
                result: {
                    id: "root-1",
                    title: "Root Node",
                    children: [
                        { id: "child-1", title: "First child" },
                        { id: "child-2", title: "Second child" },
                    ],
                },
            },
        },
    });

export class GetDocTree extends OpenAPIRoute {
    schema = {
        tags: ["Documents"],
        summary: "Return the subtree rooted at a document",
        description:
            "Retrieves a hierarchical representation of documents under the specified root document. \
      The `children` field may itself contain further nodes recursively at runtime.",
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({
                id: Str({ description: "The document ID to retrieve the tree for" }),
            }),
            query: z.object({
                depth: z
                    .number()
                    .int()
                    .positive()
                    .max(100)
                    .optional()
                    .openapi({
                        type: "integer",
                        description:
                            "Optional maximum recursion depth to traverse (default: unlimited).",
                        example: 3,
                    }),
            }),
        },
        responses: {
            "200": {
                description: "Tree retrieved successfully",
                content: {
                    "application/json": {
                        schema: TreeResponse,
                    },
                },
            },
            "404": {
                description: "Root document not found",
                content: {
                    "application/json": {
                        schema: z.object({
                            series: z.object({
                                success: z.boolean().openapi({ type: "boolean" }),
                                error: z
                                    .string()
                                    .openapi({ type: "string", description: "Error message" }),
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
        const { depth } = data.query || {};

        const exists = true;
        if (!exists) {
            return Response.json(
                { series: { success: false, error: "Root document not found" } },
                { status: 404 }
            );
        }

        const full = {
            id,
            title: "Root Title",
            children: [
                { id: "child-1", title: "Child 1" },
                {
                    id: "child-2",
                    title: "Child 2",
                    children: [{ id: "grandchild-2a", title: "Grandchild 2A" }],
                },
            ],
        };

        if (depth && depth > 0) {
            const prune = (node, d) => {
                if (d <= 1) return { id: node.id, title: node.title };
                return {
                    id: node.id,
                    title: node.title,
                    children: (node.children || []).map((ch) => prune(ch, d - 1)),
                };
            };
            return { series: { success: true, result: prune(full, depth) } };
        }

        return { series: { success: true, result: full } };
    }
}