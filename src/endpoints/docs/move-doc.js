import { OpenAPIRoute, Str, Bool } from "chanfana";
import { z } from "zod";

export class MoveDoc extends OpenAPIRoute {
    schema = {
        tags: ["Documents"],
        summary: "Move a document to a new parent within the tree",
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({
                id: Str({ description: "ID of the document to move" }),
            }),
            body: {
                content: {
                    "application/json": {
                        schema: z.object({
                            newParentId: Str({ description: "ID of the new parent document" }),
                        }),
                    },
                },
            },
        },
        responses: {
            "200": {
                description: "Document moved successfully",
                content: {
                    "application/json": {
                        schema: z.object({
                            series: z.object({
                                success: Bool(),
                                result: z.object({
                                    id: Str(),
                                    newParentId: Str(),
                                }),
                            }),
                        }),
                    },
                },
            },
            "404": {
                description: "Document or new parent not found",
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
        const { newParentId } = data.body.content["application/json"];

        // TODO: Check if both the document and new parent exist in Notion
        const docExists = true;
        const newParentExists = true;

        if (!docExists || !newParentExists) {
            return Response.json(
                {
                    series: {
                        success: false,
                        error: "Document or new parent not found",
                    },
                },
                { status: 404 }
            );
        }

        // TODO: Update the document's parent relationship in Notion

        return {
            series: {
                success: true,
                result: {
                    id,
                    newParentId,
                },
            },
        };
    }
}