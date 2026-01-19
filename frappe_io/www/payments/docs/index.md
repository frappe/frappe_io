# Payments App Documentation

The Payments app provides payment gateway integrations for Frappe and ERPNext applications.

## PaymentController v2

The PaymentController v2 architecture provides a standardized interface for payment gateway integrations with improved session tracking, webhook support, and security features.

- [PaymentController v2 Architecture](/payments/docs/payment-controller-v2)

## Supported Gateways

The following payment gateways have been updated to support the v2 architecture:

- **Stripe** - Full v2 support with PaymentIntent API, webhooks, and 3D Secure

## Legacy Gateways

Existing v1 gateways continue to work without modification. The system automatically detects gateway version and routes accordingly.
