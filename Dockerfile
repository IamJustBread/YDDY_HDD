FROM golang:1.21.5

WORKDIR /app
COPY . .

RUN go mod download
RUN go fmt ./...
RUN CGO_ENABLED=1 GOOS=linux go build -a -installsuffix cgo -o main .



EXPOSE 8080

CMD ["./main"]

