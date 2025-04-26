# Use a minimal Go base image
FROM golang:1.24-alpine

# Install necessary tools
RUN apk add --no-cache git bash zip wget


ENV TERRAFORM_VERSION=1.11.3

# Install Terraform
RUN wget -O terraform.zip https://releases.hashicorp.com/terraform/${TERRAFORM_VERSION}/terraform_${TERRAFORM_VERSION}_linux_amd64.zip && \
    unzip terraform.zip -d /usr/local/bin && \
    rm -f terraform.zip


# Create working directory
WORKDIR /app


# Copy source code
COPY . .

# Build the Go app
RUN go build -o main main.go

# Make entrypoint script executable
RUN chmod +x ./docker-entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["./docker-entrypoint.sh"]