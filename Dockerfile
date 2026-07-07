FROM node:24-slim AS run

RUN npm install -g textlint @fenril058/textlint-plugin-org textlint-rule-preset-ja-technical-writing

WORKDIR /work