FROM node:18
WORKDIR /app
COPY . .
RUN apt update && \
  apt install make && \
  npm ci && \
  npm run prisma:generate
EXPOSE 3001
CMD ["make", "start"]

