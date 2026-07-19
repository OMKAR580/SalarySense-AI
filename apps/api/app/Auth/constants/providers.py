from enum import Enum

class ProviderName(str, Enum):
    """Enumeration of authentication providers."""
    LOCAL = "local"
    GOOGLE = "google"
    GITHUB = "github"
    FACEBOOK = "facebook"
    APPLE = "apple"
