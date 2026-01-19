# PaymentController v2 Architecture

The PaymentController v2 architecture provides a standardized interface for payment gateway integrations in ERPNext. It introduces a unified API for handling payment flows, session tracking, and webhook processing while maintaining backward compatibility with existing v1 gateways.

## Overview

The PaymentController architecture addresses several limitations of the legacy payment integration:

- **Standardized Interface**: All v2 gateways implement the same `PaymentController` base class
- **Session Tracking**: Payment sessions are tracked via `Payment Session Log` for debugging and reconciliation
- **Webhook Support**: Built-in support for asynchronous payment status updates
- **Security**: Server-side amount validation prevents URL parameter tampering
- **SCA Compliance**: Automatic handling of 3D Secure and Strong Customer Authentication

## Architecture Components

### PaymentController

The base class that all v2 payment gateways extend. It provides:

- `initiate()` - Start a payment flow, creating a Payment Session Log
- `proceed()` - Continue the flow after user interaction
- `process()` - Handle the payment processing result
- `get_payment_url()` - Generate the URL for the payment page

### Payment Session Log

A DocType that tracks payment sessions throughout their lifecycle:

| Status | Description |
|--------|-------------|
| Created | Session initialized, awaiting user action |
| Started | User has begun the payment flow |
| Initiated | Payment initiated with the gateway |
| Processing | Awaiting confirmation from gateway |
| Paid | Payment successful |
| Declined | Payment was declined |
| Error | An error occurred during processing |

### TxData

The standardized transaction data structure passed between ERPNext and the payment gateway:

```python
@dataclass
class TxData:
    amount: float              # Payment amount
    currency: str              # Currency code (e.g., "USD", "EUR")
    reference_doctype: str     # DocType of the reference document
    reference_docname: str     # Name of the reference document
    payer_contact: dict        # Contact information
    payer_address: dict        # Address information
    loyalty_points: list | None
    discount_amount: float | None
```

## Integration with ERPNext Payment Request

When a Payment Request is submitted in ERPNext, it automatically detects whether the configured payment gateway supports the v2 interface:

```
Payment Request submitted
         │
         ▼
   Is v2 gateway?
    /         \
  Yes          No
   │            │
   ▼            ▼
PaymentController   Legacy flow
.initiate()        (unchanged)
   │
   ▼
Payment Session Log created
   │
   ▼
Payment URL generated
   │
   ▼
Email sent to customer
```

### Checking Gateway Version

Use the `is_v2_gateway()` utility to check if a gateway supports the v2 interface:

```python
from payments.utils import is_v2_gateway

if is_v2_gateway("Stripe"):
    # Use v2 PaymentController flow
    pass
else:
    # Use legacy v1 flow
    pass
```

## Implementing a v2 Payment Gateway

To create a v2-compatible payment gateway, extend the `PaymentController` class:

```python
from payments.controllers import PaymentController
from payments.types import (
    FrontendDefaults,
    Initiated,
    Processed,
    SessionStates,
)

class MyGatewaySettings(PaymentController):
    # Required: Define the states your gateway uses
    flowstates = SessionStates(
        success=["succeeded", "paid"],
        pre_authorized=["requires_capture"],
        processing=["pending", "processing"],
        declined=["failed", "canceled"],
    )

    # Required: Define frontend defaults for the payment UI
    frontend_defaults = FrontendDefaults(
        gateway_css="/* Custom CSS */",
        gateway_js="// Custom JavaScript",
        gateway_wrapper="<div id='payment-container'></div>",
    )

    def _initiate_charge(self) -> Initiated:
        """Initiate a one-time charge with the gateway."""
        # Call your gateway's API
        response = self.create_payment_intent(
            amount=self.state.tx_data.amount,
            currency=self.state.tx_data.currency,
        )

        return Initiated(
            correlation_id=response["id"],
            payload={"client_secret": response["client_secret"]},
        )

    def _process(self, response) -> Processed:
        """Process the gateway's response."""
        # Verify and process the payment result
        return Processed(
            status="succeeded",
            payload=response,
        )
```

### Required Methods

| Method | Description |
|--------|-------------|
| `_initiate_charge()` | Start a one-time payment |
| `_process()` | Handle the payment result |
| `validate_tx_data()` | Validate transaction data (optional) |

### Optional Methods

| Method | Description |
|--------|-------------|
| `_initiate_mandated_charge()` | Start a payment using a saved mandate |
| `_initiate_mandate_acquisition()` | Set up a payment mandate (e.g., for subscriptions) |
| `_pre_data_capture_hook()` | Called before showing payment form to user |

## Stripe v2 Configuration

The Stripe integration has been updated to use the PaymentController v2 architecture with the following improvements:

- **PaymentIntent API**: Uses the modern `stripe.PaymentIntent.create()` instead of the deprecated Charge API
- **Webhook Support**: Receives real-time payment status updates
- **3D Secure**: Automatic handling of SCA requirements

### Setup Steps

1. Run `bench migrate` to apply schema changes

2. Open **Stripe Settings** in ERPNext

3. Copy the **Webhook Endpoint URL** displayed in the settings

4. In your [Stripe Dashboard](https://dashboard.stripe.com/webhooks):
   - Click **Add endpoint**
   - Paste the webhook URL
   - Select events:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `payment_intent.canceled`
   - Click **Add endpoint**

5. Copy the **Signing secret** from Stripe and paste it into the **Webhook Signing Secret** field in Stripe Settings

### New Stripe Settings Fields

| Field | Description |
|-------|-------------|
| Webhook Endpoint URL | Read-only, displays the URL to configure in Stripe |
| Webhook Signing Secret | Secret for verifying webhook signatures |
| Collect Billing Address | Enable to collect billing address during checkout |
| Enable Debug Logging | Enable detailed logging for troubleshooting |

## API Reference

### PaymentController.initiate()

```python
@staticmethod
def initiate(
    tx_data: TxData,
    gateway: str,
) -> (PaymentController, PSLName)
```

Initiates a payment flow with the specified gateway.

**Parameters:**
- `tx_data`: Transaction data (amount, currency, reference, etc.)
- `gateway`: Name of the Payment Gateway document

**Returns:**
- Tuple of (PaymentController instance, Payment Session Log name)

### PaymentController.get_payment_url()

```python
@staticmethod
def get_payment_url(psl_name: PSLName) -> PaymentUrl
```

Generates the URL for the payment page.

**Parameters:**
- `psl_name`: Name of the Payment Session Log

**Returns:**
- URL string for the `/pay` endpoint with session reference

### PaymentController.proceed()

```python
@staticmethod
def proceed(
    psl_name: PSLName,
    updated_tx_data: TxData = None
) -> Proceeded
```

Continues the payment flow after user interaction.

**Parameters:**
- `psl_name`: Name of the Payment Session Log
- `updated_tx_data`: Optional updates to transaction data (only whitelisted fields)

**Returns:**
- `Proceeded` object with gateway payload for frontend

## Backward Compatibility

The v2 architecture is fully backward compatible:

- Existing v1 gateways continue to work unchanged
- Payment Request automatically detects gateway version
- No migration required for existing payment configurations
- v1 and v2 gateways can coexist in the same installation

## Troubleshooting

### Payment Session Log shows "Error"

Check the Error Log for details. Common causes:
- Invalid API credentials
- Network connectivity issues
- Gateway-specific validation errors

### Webhook not updating payment status

1. Verify the webhook URL is correctly configured in your gateway dashboard
2. Check that the signing secret matches
3. Enable debug logging in gateway settings
4. Check the Error Log for webhook processing errors

### "Gateway not configured" error

Ensure both **Gateway Settings** and **Gateway Controller** are set in the Payment Gateway document.

## Related Documentation

- [Payment Request](/docs/user/manual/en/accounts/payment-request)
- [Payment Gateway Setup](/docs/user/manual/en/erpnext_integration/payment-gateway)
- [Stripe Integration](/docs/user/manual/en/erpnext_integration/stripe-integration)
