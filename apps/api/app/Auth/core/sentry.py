import os
import logging
import sentry_sdk

logger = logging.getLogger(__name__)

def init_sentry() -> None:
    """
    Initializes Sentry exception monitoring if SENTRY_DSN is present.
    """
    sentry_dsn = os.getenv("SENTRY_DSN")
    if sentry_dsn and os.getenv("TESTING") != "True":
        try:
            sentry_sdk.init(
                dsn=sentry_dsn,
                traces_sample_rate=1.0,
                profiles_sample_rate=1.0,
            )
            logger.info("Sentry monitoring initialized successfully.")
        except Exception as e:
            logger.error(f"Failed to initialize Sentry: {e}")
