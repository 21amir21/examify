variable "digitalocean_token_env" {
  type        = string
  description = "value for DigitalOcean API token"
}

variable "docker_image" {
  type        = string
  description = "Specifices Docker image to be used in the pods"
}

variable "mongo_uri_env" {
  type        = string
  description = "Specifices the MongoDB URI to use in the container env variable"
}

variable "port_env" {
  type        = number
  description = "Specifices the port to use in the container"
}

variable "jwt_secret_env" {
  type        = string
  description = "Specifices the JWT secret to be used"
}

variable "aws_access_key_id" {
  type        = string
  description = "Specifices AWS access key id"
}

variable "aws_secret_access_key" {
  type        = string
  description = "Specifices AWS secret access key"
}

variable "admin_password_env" {
  type        = string
  description = "Specifices Admin Password"
}
