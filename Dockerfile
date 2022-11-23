FROM denoland/deno:latest as base

WORKDIR /app

COPY . ./

RUN deno cache index.js

CMD ["run", "--allow-all", "index.js"]