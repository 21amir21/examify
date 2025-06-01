output "instance_ip" {
  value = aws_instance.windows_instance.public_ip
}

output "temp_password" {
  value = random_password.instance_password.result
}
