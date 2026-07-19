from typing import Protocol

class EmailService(Protocol):
    async def send_verification_email(self, email: str, token: str) -> bool:
        ...
    async def send_reset_email(self, email: str, token: str) -> bool:
        ...
    async def send_password_changed_email(self, email: str) -> bool:
        ...
    async def send_mfa_otp(self, email: str, otp: str) -> bool:
        ...

class DummyEmailService(EmailService):
    async def send_verification_email(self, email: str, token: str) -> bool:
        # Placeholder for real async celery/smtp queue
        print(f"[DummyEmailService] Sent verification email to {email} with token {token}")
        return True

    async def send_reset_email(self, email: str, token: str) -> bool:
        print(f"[DummyEmailService] Sent password reset email to {email} with token {token}")
        return True

    async def send_password_changed_email(self, email: str) -> bool:
        print(f"[DummyEmailService] Sent password changed email confirmation to {email}")
        return True

    async def send_mfa_otp(self, email: str, otp: str) -> bool:
        print(f"[DummyEmailService] Sent MFA OTP {otp} to {email}")
        return True


import smtplib
import os
import logging
import asyncio
import socket
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

logger = logging.getLogger(__name__)

class SMTPDeliveryError(Exception):
    pass

class SMTPEmailService(EmailService):
    def __init__(self):
        load_dotenv()
        self.smtp_host = os.getenv("SMTP_HOST", "localhost")
        self.smtp_port = int(os.getenv("SMTP_PORT", "1025"))
        self.smtp_user = os.getenv("SMTP_USER", "")
        self.smtp_password = os.getenv("SMTP_PASSWORD", "")
        self.smtp_from = os.getenv("SMTP_FROM", "no-reply@example.com")
        self.use_tls = os.getenv("SMTP_USE_TLS", "false").lower() == "true"

    def _send(self, to_email: str, subject: str, body: str) -> bool:
        try:
            logger.info(f"Connecting to SMTP Host: {self.smtp_host}:{self.smtp_port}")
            server = smtplib.SMTP(self.smtp_host, self.smtp_port, timeout=10)
            logger.info("SMTP Host Connected")
            
            # Identify ourselves to the SMTP server
            server.ehlo()
            
            if self.use_tls:
                try:
                    server.starttls()
                    server.ehlo()
                    logger.info("TLS Enabled")
                except Exception as e:
                    logger.error(f"TLS Failure: {str(e)}")
                    raise SMTPDeliveryError(f"TLS Failure: {str(e)}")

            if self.smtp_user and self.smtp_password:
                try:
                    server.login(self.smtp_user, self.smtp_password)
                    logger.info("SMTP Login Successful")
                except smtplib.SMTPAuthenticationError as e:
                    logger.error(f"SMTP Authentication Failed. Reason: {e.smtp_code} {e.smtp_error.decode('utf-8') if isinstance(e.smtp_error, bytes) else e.smtp_error}")
                    raise SMTPDeliveryError("SMTP Authentication Failed")
                except Exception as e:
                    logger.error(f"SMTP Login Failed: {str(e)}")
                    raise SMTPDeliveryError(f"SMTP Login Failed: {str(e)}")

            msg = MIMEMultipart()
            msg["From"] = self.smtp_from
            msg["To"] = to_email
            msg["Subject"] = subject
            msg.attach(MIMEText(body, "html"))

            try:
                server.sendmail(self.smtp_from, to_email, msg.as_string())
                logger.info("Email Sent")
            except smtplib.SMTPRecipientsRefused as e:
                logger.error(f"Invalid Recipient: {str(e)}")
                raise SMTPDeliveryError("Invalid Recipient")
            except smtplib.SMTPSenderRefused as e:
                logger.error(f"Invalid Sender: {str(e)}")
                raise SMTPDeliveryError("Invalid Sender")
            except Exception as e:
                logger.error(f"Failed to send email data: {str(e)}")
                raise SMTPDeliveryError(f"Failed to send email data: {str(e)}")

            server.quit()
            return True

        except socket.timeout:
            logger.error("SMTP Timeout")
            raise SMTPDeliveryError("SMTP Timeout")
        except socket.gaierror:
            logger.error("DNS Failure: Could not resolve SMTP host")
            raise SMTPDeliveryError("DNS Failure")
        except ConnectionRefusedError:
            logger.error("SMTP Connection Refused")
            raise SMTPDeliveryError("SMTP Connection Refused")
        except SMTPDeliveryError:
            # Re-raise explicit errors
            raise
        except Exception as e:
            logger.error(f"Unexpected SMTP error: {str(e)}")
            raise SMTPDeliveryError(f"Unexpected SMTP error: {str(e)}")

    async def send_verification_email(self, email: str, token: str) -> bool:
        html = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 10px;">SalarySense AI &mdash; Verify Your Email</h2>
                <p>Hello,</p>
                <p>Welcome to SalarySense AI.</p>
                <p>Your verification code is:</p>
                <div style="background-color: #f8f9fa; border-radius: 4px; padding: 15px; margin: 20px 0; text-align: center;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #007bff;">{token}</span>
                </div>
                <p>This code expires in 10 minutes.</p>
                <p style="font-size: 0.9em; color: #6c757d; margin-top: 30px;">If you didn't request this,<br>please ignore this email.</p>
                <p style="margin-top: 30px; font-weight: bold;">&mdash; SalarySense AI Team</p>
            </body>
        </html>
        """
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(None, self._send, email, "SalarySense AI — Verify Your Email", html)

    async def send_reset_email(self, email: str, token: str) -> bool:
        html = f"<p>Password reset code: <strong>{token}</strong></p>"
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(None, self._send, email, "Reset Your Password", html)

    async def send_password_changed_email(self, email: str) -> bool:
        html = "<p>Your password has been changed successfully.</p>"
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(None, self._send, email, "Password Changed Successfully", html)

    async def send_mfa_otp(self, email: str, otp: str) -> bool:
        html = f"<p>Your MFA OTP code is: <strong>{otp}</strong></p>"
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(None, self._send, email, "MFA Verification Code", html)
