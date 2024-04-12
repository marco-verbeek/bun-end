FROM oven/bun

COPY bun.lockb . 
COPY package.json . 

RUN bun install

COPY src ./src 
COPY drizzle ./drizzle

CMD ["bun", "run", "src/index.ts"]
