ARG GO_VERSION=latest
from golang:$GO_VERSION as builder

WORKDIR /app/

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

######## Start a new stage from scratch #######
FROM scratch

COPY --from=builder /app/main .

ENTRYPOINT ["./main"]

LABEL GO_VERSION=${GO_VERSION} \
      maintainer="VenturPlex <victor.avila@venturplex.com>"
