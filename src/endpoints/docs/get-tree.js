import {OpenAPIRoute, Str} from "chanfana";
import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

// OpenAPI-safe (non-recursive) facade for docs
const TreeNode = z
    .object({
        id: z.string().openapi({ type: "string", description: "Document ID" }),
        title: z.string().openapi({ type: "string", description: "Document title" }),
        children: z
            .array(
                z.object({}).passthrough().openapi({
                    type: "object",
                    description:
                        "Child node (recursively shaped at runtime). OpenAPI keeps this generic to avoid recursion.",
                })
            )
            .optional()
            .openapi({ type: "array" }),
    })
    .openapi({
        type: "object",
        refId: "TreeNode",
        description: "Tree node (non-recursive OpenAPI facade).",
    });
// const TreeNode = z
//     .lazy(() =>
//         z.object({
//             id: z.string().openapi({ type: "string", description: "Document ID" }),
//             title: z.string().openapi({ type: "string", description: "Document title" }),
//             // Explicit array typing; the refId below allows $ref to resolve cleanly.
//             // children: z
//             //     .array(TreeNode)
//             //     .optional()
//             //     .openapi({
//             //         type: "array",
//             //         description: "Optional child nodes",
//             //         // items gets inferred from the $ref to TreeNode; explicit here is okay but not required
//             //         // items: { $ref: "#/components/schemas/TreeNode" }
//             //     }),
//         }).openapi({
//             // Give the OBJECT a concrete OpenAPI identity
//             type: "object",
//             refId: "TreeNode",
//             description: "Recursive document tree node",
//         })
//     )
//     // Also annotate the LAZY itself (helps some generator paths)
//     .openapi({ refId: "TreeNode" });

export class GetDocTree extends OpenAPIRoute {
    schema = {
        tags: ["Documents"],
        summary: "Return the subtree rooted at a document",
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({
                id: Str({ description: "The document ID to resolve ancestors for" }),
            }),

            // params: z.object({
            //     id: z.string().openapi({
            //         name: "id",
            //         type: "string",
            //         description: "Root document ID",
            //         // 👇 REQUIRED for parameters
            //         param: { name: "id", in: "path", required: true },
            //         example: "doc_123",
            //     }),
            // }),
            query: z
                .object({
                    depth: z.coerce.number().int().positive().max(100).optional()
                        .describe("Max results to return (default depends on backend, max 100)"),
                    // depth: z
                    //     .string()
                    //     .openapi({
                    //         type: "string",
                    //         description: "Optional max depth as a positive integer",
                    //         example: "2",
                    //         // // 👇 REQUIRED for parameters
                    //         // param: { name: "depth", in: "query", required: false },
                    //     })
                    //     .optional(),
                })
        },
        responses: {
            "200": {
                description: "Tree retrieved successfully",
                content: {
                    "application/json": {
                        schema: z.object({
                            series: z.object({
                                success: z.boolean().openapi({ type: "boolean" }),
                                // result: TreeNodeOA,
                                // result: z.string().openapi({ type: "string" }),
                                result: TreeNode,
                            }),
                        }),
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
                                error: z.string().openapi({ type: "string" }),
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
        const depthStr = data.query?.depth;
        const depth = typeof depthStr === "string" && /^\d+$/.test(depthStr) ? parseInt(depthStr, 10) : undefined;

        // TODO: Notion traversal respecting depth
        const exists = true;
        if (!exists) {
            return Response.json({ series: { success: false, error: "Root document not found" } }, { status: 404 });
        }

        const full = {
            id,
            title: "Root Title",
            children: [
                { id: "child-1", title: "Child 1" },
                { id: "child-2", title: "Child 2", children: [{ id: "grandchild-2a", title: "Grandchild 2A" }] },
            ],
        };

        if (typeof depth === "number" && depth > 0) {
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