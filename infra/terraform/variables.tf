variable "aws_region" {
  description = "AWS region used for all resources."
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name used for resource naming."
  type        = string
  default     = "shopsmart"
}

variable "environment" {
  description = "Deployment environment name."
  type        = string
  default     = "prod"
}

variable "app_port" {
  description = "Container port exposed by the backend service."
  type        = number
  default     = 5000
}

variable "frontend_port" {
  description = "Container port exposed by the frontend service."
  type        = number
  default     = 80
}

variable "cpu" {
  description = "Fargate task CPU units."
  type        = number
  default     = 256
}

variable "memory" {
  description = "Fargate task memory in MiB."
  type        = number
  default     = 512
}

variable "desired_count" {
  description = "Initial ECS service task count. The CI/CD deploy step raises this after pushing an image."
  type        = number
  default     = 0
}

variable "task_execution_role_arn" {
  description = "Existing IAM role ARN for ECS task execution. Leave null in AWS Academy labs to use arn:aws:iam::<account>:role/LabRole."
  type        = string
  default     = null
}
