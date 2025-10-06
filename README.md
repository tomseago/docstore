# docstore
API to integrate with a document store such as Notion making it usable via chatGPT

Small change

## API

⸻

📚 Core Document Endpoints

    GET /docs/:id

Retrieve a specific document, including its content and metadata.

    POST /docs

Create a new document. Accepts:
•	title
•	content (markdown text)
•	parentId (optional, for tree placement)
•	metadata (optional)

    PUT /docs/:id

Replace all fields (title, content, metadata) for a document.

    PATCH /docs/:id

Partially update fields like title, content, or metadata.

    DELETE /docs/:id

Delete a document. Optionally include a cascade=true query param to delete all its children.

⸻--

🌲 Tree Structure Endpoints

    GET /docs/:id/children

Fetch all direct children of a document.

    POST /docs/:id/children

Create a child document under the specified parent.

    PATCH /docs/:id/move

Move a document to a new parent. Accepts:
•	newParentId

⸻

🧭 Navigation & Query Endpoints

    GET /docs/:id/ancestors

Return a list of ancestor documents up to the root (breadcrumb path).

    GET /docs/:id/tree

Recursively return the entire subtree (IDs, titles, structure) rooted at this document.

    GET /search?q=...

Perform a keyword or metadata-based search. Can use Notion’s search API under the hood.

⸻

🏷️ Metadata & Tagging (Optional)

    PATCH /docs/:id/tags

Add or remove tags. Accepts:
•	add: string[]
•	remove: string[]

    GET /tags

Return a list of all tags used in the document store.

⸻

🛠️ Utility Endpoints

    POST /sync

Trigger a background refresh from Notion, if needed.

    GET /health

Basic health check (e.g. { status: "ok" })
