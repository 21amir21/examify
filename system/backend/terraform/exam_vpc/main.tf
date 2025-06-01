terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.98.0"
    }
  }

  backend "s3" {
    bucket               = "224049-examify-tf-backend-state"
    workspace_key_prefix = "exam-vpcs"
    key                  = "backend-state"
    region               = "eu-central-1"
    dynamodb_table       = "224049-examify-tf-backend-state_locks"
    encrypt              = true
  }
}

provider "aws" {
  region = "eu-central-1"
}

# create a VPC
resource "aws_vpc" "vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
  instance_tenancy     = "default"

  tags = {
    "name" = terraform.workspace
  }
}

# create a subnet
resource "aws_subnet" "subnet" {
  vpc_id                  = aws_vpc.vpc.id
  cidr_block              = "10.0.0.0/16"
  map_public_ip_on_launch = true

  tags = {
    "name" = "${terraform.workspace}-public-subnet"
  }
}


# create internet gatway (igw)
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.vpc.id

  tags = {
    "name" = "${terraform.workspace}-igw"
  }
}


# create a custom routing table (crt)
resource "aws_route_table" "custom-route-table" {
  vpc_id = aws_vpc.vpc.id

  route = {
    # associated subnet can communicate with any ip on the internet
    cidr_block = "0.0.0.0/0"
    # let the custom route table use the created igw to reach internet
    gatway_id = aws_internet_gateway.igw.id
  }

  tags = {
    "name" = "${terraform.workspace}-crt"
  }
}


# associate the custom route table with the public subnet
resource "aws_route_table_association" "crta-public-subnet-1" {
  subnet_id      = aws_subnet.subnet.id
  route_table_id = aws_route_table.custom-route-table.id
}


resource "aws_security_group" "sg" {
  name   = "${terraform.workspace}-sg"
  vpc_id = aws_vpc.vpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3389
    to_port     = 3389
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 5986
    to_port     = 5986
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 5900
    to_port     = 5900
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 6080
    to_port     = 6080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }


  egress {
    from_port   = 0
    to_port     = 0
    protocol    = -1
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    "name" = "${terraform.workspace}-sg"
  }
}
