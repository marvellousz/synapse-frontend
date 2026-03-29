# frontend

this is the web app for synapse (next.js).

main features: memories, folders, graph, semantic search, and chat.
auth includes email verification + forgot/reset password flows.

## quick start

```bash
pnpm install
pnpm dev
```

windows note: if `pnpm` is not recognized:

```powershell
corepack enable
corepack prepare pnpm@latest --activate
pnpm install
pnpm dev
```

open http://localhost:3000

env: set `NEXT_PUBLIC_API_URL` if your api is not on localhost:8000.

run backend first so auth/search/chat calls work.
