import base64
import hashlib
import hmac
import json
import logging
import os
import requests

logger = logging.getLogger(__name__)


class SelcomPaymentService:
    def __init__(self):
        self.base_url = os.environ.get("SELCOM_BASE_URL", "https://apigw.selcom.net/v1")
        self.api_key = os.environ.get("SELCOM_API_KEY", "")
        self.api_secret = os.environ.get("SELCOM_API_SECRET", "")
        self.vendor_id = os.environ.get("SELCOM_VENDOR_ID", "AL_FIRDAUS")
        self.is_sandbox = os.environ.get("SELCOM_SANDBOX", "True").lower() in ("true", "1", "yes")

    def generate_digest(self, timestamp, payload_str):
        raw_data = f"timestamp={timestamp}&{payload_str}"
        digest = hmac.new(
            self.api_secret.encode("utf-8"),
            raw_data.encode("utf-8"),
            hashlib.sha256
        ).digest()
        return base64.b64encode(digest).decode("utf-8")

    def create_checkout_order(self, donation):
        """Creates a Selcom Checkout payment order and returns payment URL & order details."""
        order_id = f"ORD-{donation.reference}"

        # If live credentials are missing, generate a sandbox mockup response for development
        if not self.api_key or not self.api_secret:
            logger.info("Selcom API Key/Secret missing. Generating Sandbox Checkout URL.")
            sandbox_url = f"https://checkout.selcom.net/sandbox/pay?order_id={order_id}&reference={donation.reference}"
            return {
                "result": "SUCCESS",
                "resultcode": "000",
                "order_id": order_id,
                "payment_url": sandbox_url,
                "payment_gateway": "SELCOM_SANDBOX",
                "message": "Selcom Sandbox Order Created Successfully",
            }

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"SELCOM {self.api_key}",
        }

        payload = {
            "vendor_id": self.vendor_id,
            "order_id": order_id,
            "buyer_email": donation.donor_email or "donor@alfirdaus.or.tz",
            "buyer_name": donation.donor_name or "Anonymous Donor",
            "buyer_phone": donation.donor_phone or "255700000000",
            "amount": float(donation.amount),
            "currency": "TZS",
            "redirect_url": f"https://al-firdaus.org/donation/thank-you?ref={donation.reference}",
            "cancel_url": f"https://al-firdaus.org/donation/cancel?ref={donation.reference}",
            "webhook_url": f"https://api.al-firdaus.org/api/donations/webhook/selcom/",
        }

        try:
            url = f"{self.base_url}/checkout/create-order-minimal"
            res = requests.post(url, json=payload, headers=headers, timeout=10)
            data = res.json()
            if res.status_code == 200 and data.get("result") == "SUCCESS":
                payment_url = data.get("payment_url") or data.get("data", [{}])[0].get("payment_url", "")
                return {
                    "result": "SUCCESS",
                    "order_id": order_id,
                    "payment_url": payment_url,
                    "payment_gateway": "SELCOM_LIVE",
                }
            else:
                logger.error(f"Selcom order creation failed: {data}")
                return {
                    "result": "FAIL",
                    "order_id": order_id,
                    "message": data.get("message", "Selcom API error"),
                }
        except Exception as e:
            logger.exception("Error connecting to Selcom API gateway")
            return {"result": "FAIL", "order_id": order_id, "message": str(e)}
