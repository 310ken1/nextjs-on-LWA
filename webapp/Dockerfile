FROM public.ecr.aws/docker/library/node:22-slim AS builder
WORKDIR "/build"
COPY . .
RUN --mount=type=cache,target=/root/.npm npm ci
RUN --mount=type=cache,target=/build/.next/cache npm run build

FROM public.ecr.aws/docker/library/node:22-slim AS runner
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.9.1 /lambda-adapter /opt/extensions/lambda-adapter
ENV PORT=7000
WORKDIR "/var/task"
COPY --from=builder /build/.next/static ./.next/static
COPY --from=builder /build/.next/standalone ./
COPY --from=builder /build/public ./public  
COPY --from=builder /build/run.sh ./run.sh
RUN ln -s /tmp/cache ./.next/cache
ENTRYPOINT ["sh"]
CMD ["run.sh"]
