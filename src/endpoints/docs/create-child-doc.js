import { OpenAPIRoute, Str, Bool } from "chanfana";
import { z } from "zod";

export class CreateChildDoc extends OpenAPIRoute {
    schema = {
        tags: ["Documents"],
        summary: "Create a child document under a parent document",
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({
                id: Str({ description: "The ID of the parent document" }),
            }),
            body: {
                content: {
                    "application/json": {
                        schema: z.object({
                            title: Str({ description: "Title of the new child document" }),
                            content: Str({ description: "Content of the new document in markdown format" }),
                            metadata: z.record(z.any()).optional(),
                        }),
                    },
                },
            },
        },
        responses: {
            "200": {
                description: "Child document created successfully",
                content: {
                    "application/json": {
                        schema: z.object({
                            series: z.object({
                                success: Bool(),
                                result: z.object({
                                    id: Str(),
                                    title: Str(),
                                    content: Str(),
                                    parentId: Str(),
                                    metadata: z.record(z.any()).optional(),
                                }),
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
        const parentId = data.params.id;
        const { title, content, metadata } = data.body.content["application/json"];

        // TODO: Validate parent existence using Notion API
        const parentExists = true;

        if (!parentExists) {
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

        const childDoc = {
            id: crypto.randomUUID(),
            title,
            content,
            parentId,
            metadata,
        };

        // TODO: Save to Notion

        return {
            series: {
                success: true,
                result: childDoc,
            },
        };
    }
}