output "s3_bucket_name" {
  description = "Unique encrypted S3 bucket with versioning and blocked public access."
  value       = aws_s3_bucket.app.bucket
}

output "ecr_repository_url" {
  description = "ECR repository URL for the backend image."
  value       = aws_ecr_repository.backend.repository_url
}

output "ecs_cluster_name" {
  description = "ECS cluster name."
  value       = aws_ecs_cluster.main.name
}

output "ecs_service_name" {
  description = "ECS service name."
  value       = aws_ecs_service.backend.name
}

output "ecs_task_family" {
  description = "ECS task definition family."
  value       = aws_ecs_task_definition.backend.family
}

output "ecs_task_execution_role_arn" {
  description = "Existing IAM role ARN used by the ECS task definition."
  value       = local.task_execution_role_arn
}

output "load_balancer_dns_name" {
  description = "Public HTTP endpoint for the backend service."
  value       = aws_lb.app.dns_name
}
