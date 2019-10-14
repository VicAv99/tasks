resource "aws_s3_bucket" "taskify_bucket" {
  bucket = var.DOMAIN_NAME
  acl    = "public-read"
  policy = file("./policy.json")

  website {
    index_document = "index.html"
    error_document = "index.html"
  }
}

resource "aws_acm_certificate" "certificate" {
  domain_name               = "*.${var.ROOT_DOMAIN_NAME}"
  validation_method         = "DNS"
  subject_alternative_names = [var.ROOT_DOMAIN_NAME]

  lifecycle {
    create_before_destroy = true
  }
}

data "aws_route53_zone" "zone" {
  name         = var.ROOT_DOMAIN_NAME
}

resource "aws_route53_record" "certificate_validation" {
  name    = aws_acm_certificate.certificate.domain_validation_options.0.resource_record_name
  type    = aws_acm_certificate.certificate.domain_validation_options.0.resource_record_type
  zone_id = data.aws_route53_zone.zone.id
  records = [aws_acm_certificate.certificate.domain_validation_options.0.resource_record_value]
  ttl     = "30"
}

resource "aws_acm_certificate_validation" "certificate" {
  certificate_arn         = aws_acm_certificate.certificate.arn
  validation_record_fqdns = [aws_route53_record.certificate_validation.fqdn]
}

resource "aws_cloudfront_distribution" "frontend_devops_distribution" {
  origin {
    custom_origin_config {
      http_port              = "80"
      https_port             = "443"
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1", "TLSv1.1", "TLSv1.2"]
    }

    domain_name = aws_s3_bucket.taskify_bucket.website_endpoint
    origin_id   = var.DOMAIN_NAME
  }

  enabled              = true
  default_root_object  = "index.html"

  default_cache_behavior {
    viewer_protocol_policy = "redirect-to-https"
    compress               = true
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = var.DOMAIN_NAME
    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  aliases = [var.DOMAIN_NAME]

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.certificate.arn
    minimum_protocol_version = "TLSv1"
    ssl_support_method       = "sni-only"
  }
}

resource "aws_route53_record" "frontend_devops" {
  zone_id = data.aws_route53_zone.zone.zone_id
  name    = var.DOMAIN_NAME
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.frontend_devops_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.frontend_devops_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}
