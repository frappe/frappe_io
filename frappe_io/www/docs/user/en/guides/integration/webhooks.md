<!-- add-breadcrumbs -->
# Webhooks

Webhooks are "user-defined HTTP callbacks". For a select DocType, you can create a webhook that triggers on specific document events under certain conditions, if required.

When the `doc_event` occurs, the source site makes an HTTP request to the URI configured for the webhook. Users can configure these webhooks to use events on one site to invoke behaviour on another.

## Configuring a Webhook

To add a Webhook go to,

> Integrations > Webhook > Webhook

<img class="screenshot" src="/docs/assets/img/webhook.png">

1. Select the DocType for which the Webhook needs to be triggered (e.g. `Quotation`).
1. Select the Doc Event that will trigger the Webhook (e.g. `on_update`).
1. Optionally, you can set additional document Conditions to trigger Webhooks for specific scenarios.
1. Enter a valid request URL that will receive the Webhook data.
1. Once the Doc Event is completed, a `POST` request is made to the Request URL with the body generated from the Webhook Data section.
1. Optionally, you can add HTTP headers to the request. (e.g. useful for sending an API key, if required).

### Data Structure

- If your request structure is based on forms, you can select fields from the document in the table, which uses the fieldname as the `key`.
- If your request structure is based on JSON, you can insert fields from the document using jinja templating (make sure to wrap your fields with double-quotes).

### Webhook Security

> Introduced in Version 13

To optionally add security to your webhook requests and ensure that the webhook is being sent from Frappe, you can set up a "Webhook Secret" along with the request. Do not share the secret publicly.

If enabled, an additional header (`X-Frappe-Webhook-Signature`) will be added to the request before it's sent out, with its value being generated from the secret as a base64-encoded HMAC-SHA256 hash of the payload.

### Example Webhook Request

- **DocType**: `Quotation`
- **Doc Event**: `on_update`
- **Request URL**: `https://httpbin.org/post`
- **Request Structure**: `Form URL-Encoded`
- **Webhook Headers**:
  1. **Key**: `Content-Type:`, **Value**: `application/x-www-form-urlencoded`
- **Webhook Data**:
  1. **Fieldname**: `name`,  **Key**: `id`
  1. **Fieldname**: `items`,  **Key**: `lineItems`

The above configuration creates the following JSON request (sent by a Frappe server on `Quotation` - `on_update` to https://httpbin.org/post):

```
{
  "args": {},
  "data": "{\"lineItems\": [{\"stock_qty\": 1.0, \"base_price_list_rate\": 1.0, \"image\": \"\", \"creation\": \"2017-09-14 13:41:58.373023\", \"base_amount\": 1.0, \"qty\": 1.0, \"margin_rate_or_amount\": 0.0, \"rate\": 1.0, \"owner\": \"Administrator\", \"stock_uom\": \"Unit\", \"base_net_amount\": 1.0, \"page_break\": 0, \"modified_by\": \"Administrator\", \"base_net_rate\": 1.0, \"discount_percentage\": 0.0, \"item_name\": \"I1\", \"amount\": 1.0, \"actual_qty\": 0.0, \"net_rate\": 1.0, \"conversion_factor\": 1.0, \"warehouse\": \"Finished Goods - R\", \"docstatus\": 0, \"prevdoc_docname\": null, \"uom\": \"Unit\", \"description\": \"I1\", \"parent\": \"QTN-00001\", \"brand\": null, \"gst_hsn_code\": null, \"base_rate\": 1.0, \"item_code\": \"I1\", \"projected_qty\": 0.0, \"margin_type\": \"\", \"doctype\": \"Quotation Item\", \"rate_with_margin\": 0.0, \"pricing_rule\": null, \"price_list_rate\": 1.0, \"name\": \"QUOD/00001\", \"idx\": 1, \"item_tax_rate\": \"{}\", \"item_group\": \"Products\", \"modified\": \"2017-09-14 17:09:51.239271\", \"parenttype\": \"Quotation\", \"customer_item_code\": null, \"net_amount\": 1.0, \"prevdoc_doctype\": null, \"parentfield\": \"items\"}], \"id\": \"QTN-00001\"}",
  "files": {},
  "form": {},
  "headers": {
    "Accept": "*/*",
    "Accept-Encoding": "gzip, deflate",
    "Connection": "close",
    "Content-Length": "1075",
    "Host": "httpbin.org",
    "User-Agent": "python-requests/2.18.1"
  },
  "json": {
    "id": "QTN-00001",
    "lineItems": [
      {
        "actual_qty": 0.0,
        "amount": 1.0,
        "base_amount": 1.0,
        "base_net_amount": 1.0,
        "base_net_rate": 1.0,
        "base_price_list_rate": 1.0,
        "base_rate": 1.0,
        "brand": null,
        "conversion_factor": 1.0,
        "creation": "2017-09-14 13:41:58.373023",
        "customer_item_code": null,
        "description": "I1",
        "discount_percentage": 0.0,
        "docstatus": 0,
        "doctype": "Quotation Item",
        "gst_hsn_code": null,
        "idx": 1,
        "image": "",
        "item_code": "I1",
        "item_group": "Products",
        "item_name": "I1",
        "item_tax_rate": "{}",
        "margin_rate_or_amount": 0.0,
        "margin_type": "",
        "modified": "2017-09-14 17:09:51.239271",
        "modified_by": "Administrator",
        "name": "QUOD/00001",
        "net_amount": 1.0,
        "net_rate": 1.0,
        "owner": "Administrator",
        "page_break": 0,
        "parent": "QTN-00001",
        "parentfield": "items",
        "parenttype": "Quotation",
        "prevdoc_docname": null,
        "prevdoc_doctype": null,
        "price_list_rate": 1.0,
        "pricing_rule": null,
        "projected_qty": 0.0,
        "qty": 1.0,
        "rate": 1.0,
        "rate_with_margin": 0.0,
        "stock_qty": 1.0,
        "stock_uom": "Unit",
        "uom": "Unit",
        "warehouse": "Finished Goods - R"
      }
    ]
  },
  "url": "https://httpbin.org/post"
}
```
