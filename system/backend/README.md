# Table of Content

- [Table of Content](#table-of-content)
- [Building a REST API using Go and Gin](#building-a-rest-api-using-go-and-gin)
  - [Following a Layered Architecture/Project Structure](#following-a-layered-architectureproject-structure)
  - [Implementing Terraform Service using Child Process Node Module](#implementing-terraform-service-using-child-process-node-module)
  - [Parsing Terraform Output Using Async Iterator Pattern with Streams](#parsing-terraform-output-using-async-iterator-pattern-with-streams)
  - [Promises and Parallel Execution](#promises-and-parallel-execution)
- [Containerizing the Backend Server with Docker](#containerizing-the-backend-server-with-docker)

# Building a REST API using Go and Gin

**Note:** due to the project's limited time and the nature of being a proof of concept rather than an actual production server, some decisions have been taken to reduce the development time as much as possible and help iterate quickly.

For example, I would prefer if I had used Nest/Fastify instead of Express as the backend framework alongside TypeScript instead of plain JavaScript. This would have helped achieve better maintainability and code structure. Nevertheless, I've tried to follow some good development practices and design patterns as noted below.
