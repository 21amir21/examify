terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.98.0"
    }
  }

  backend "s3" {
    bucket                  = "windows-vs-demo-backend-state-unique"
    workspace_key_prefix    = "exam-name"
    key                     = "backend-state"
    region                  = "eu-central-1"
    dynamodb_table          = "windows-vs-demo_locks"
    encrypt                 = true
    shared_credentials_file = "~/.aws/credentials"
  }

}

provider "aws" {
  region                   = "eu-central-1"
  shared_credentials_files = ["~/.aws/credentials"]
}


# Creating a random password
resource "random_string" "instance_password" {
  length  = 12
  special = false
}


# Creating an EC2 Instance
resource "aws_instance" "windows_instance" {
  ami                    = data.aws_ami.target_ami.id
  key_name               = "default-ec2"
  instance_type          = var.instance_type
  vpc_security_group_ids = [data.aws_security_group.sg.id]
  subnet_id              = tolist(data.aws_subnets.vpc_subnets.ids)[0]

  ebs_block_device {
    volume_size           = 100
    device_name           = "/dev/sda1"
    delete_on_termination = true
  }

  connection {
    type     = "winrm"
    user     = "admin"
    password = "adm@!S3CR3T!1"
    host     = self.public_ip
    insecure = true
    https    = true
  }

  provisioner "remote-exec" {
    inline = [
      "powershell net user student ${random_string.instance_password.result}",
      "powershell Remove-Item -Path 'C:\\Users\\admin\\Desktop\\EC2 Feedback.website'",
      "powershell Remove-Item -Path 'C:\\Users\\admin\\Desktop\\EC2 Microsoft Windows Guide.website'"
    ]
  }

}
