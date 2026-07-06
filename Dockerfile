FROM alpine:3.18
RUN apk add --no-cache bash
COPY . /app
WORKDIR /app
CMD ["sh"]
