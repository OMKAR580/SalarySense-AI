from typing import Protocol, Any

class AuthenticationPolicy(Protocol):
    def evaluate(self, context: Any, user: Any) -> bool: ...

class AllowLoginPolicy(AuthenticationPolicy): pass
class AccountStatusPolicy(AuthenticationPolicy): pass
class PasswordExpiredPolicy(AuthenticationPolicy): pass
class MaximumSessionsPolicy(AuthenticationPolicy): pass
class TenantPolicy(AuthenticationPolicy): pass
class OrganizationPolicy(AuthenticationPolicy): pass
class CountryRestrictionPolicy(AuthenticationPolicy): pass
class TimeRestrictionPolicy(AuthenticationPolicy): pass
class RoleRestrictionPolicy(AuthenticationPolicy): pass
class AdaptivePolicy(AuthenticationPolicy): pass
