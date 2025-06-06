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
  default = "win-server"
}

variable "admin-password" {
  type    = string
  default = "adm@!S3CR3T!1"
}
