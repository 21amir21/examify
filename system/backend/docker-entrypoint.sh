#!/bin/bash
terraform -chdir=./terraform/exam_instance init
terraform -chdir=./terraform/exam_vpc init

echo "Building Go binary inside container..."
go build -o main main.go

./main # Run your Go binary
