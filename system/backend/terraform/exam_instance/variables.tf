variable "vpc_id" {
  type = string
}

variable "security_group_id" {
  type = string
}

variable "instance_type" {
  type    = string
  default = "c5.xlarge"
}

variable "ami_name" {
  type    = string
  default = "win-basic"
}

variable "admin-password" {
  type = string
  # TODO: im not sure thats right
  default = "adm@!S3CR3T!1"
}
