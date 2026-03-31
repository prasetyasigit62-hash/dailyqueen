This is a Mall website for SRLand project.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Config Environment Variable

Rename .env.example to be .env.local and change the value. The Mall ID is

- 1 : Queen City Mall Semarang
- 2 : Kediri Mall
- 3 : Lawu Plaza
- 4 : Pacific Mall Tegal

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

Before push your commit, remember to always run `yarn build` first. it will trigger husky to run eslint check to make sure your code is clean.
