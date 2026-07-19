import logging
import sys

def setup_logging():
    # Setup basic logging to stdout with clear human readable formatting
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        handlers=[
            logging.StreamHandler(sys.stdout)
        ]
    )
    
    # Set levels for third party logs if necessary
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
