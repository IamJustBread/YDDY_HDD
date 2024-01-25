FROM golang:1.21.5

WORKDIR /app
COPY . .

RUN go mod download
RUN go fmt ./...
RUN go build -o main .



EXPOSE 8080

CMD ["./main"]

