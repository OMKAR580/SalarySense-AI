from dataclasses import dataclass, field
from typing import Optional, Dict, Any
from uuid import UUID

@dataclass(frozen=True)
class ClientContext:
    client_id: Optional[str] = None
    client_version: Optional[str] = None

@dataclass(frozen=True)
class DeviceContext:
    user_agent: str
    device_id: Optional[str] = None
    fingerprint: Optional[str] = None

@dataclass(frozen=True)
class NetworkContext:
    ip_address: str
    forwarded_for: Optional[str] = None

@dataclass(frozen=True)
class LocationContext:
    country: Optional[str] = None
    city: Optional[str] = None
    timezone: Optional[str] = None

@dataclass(frozen=True)
class TenantContext:
    tenant_id: Optional[str] = None
    organization_id: Optional[str] = None

@dataclass(frozen=True)
class ExecutionContext:
    correlation_id: str
    trace_id: str
    request_id: str
    language: str

@dataclass(frozen=True)
class RequestContext:
    method: str
    path: str
    headers: Dict[str, str] = field(default_factory=dict)

@dataclass(frozen=True)
class AuthenticationContext:
    """
    Purpose: Immutable context passed down the authentication pipeline.
    Architecture Notes: Frozen dataclass ensures state cannot be modified directly during pipeline execution.
    """
    request: RequestContext
    execution: ExecutionContext
    network: NetworkContext
    device: DeviceContext
    client: Optional[ClientContext] = None
    location: Optional[LocationContext] = None
    tenant: Optional[TenantContext] = None
    custom_attributes: Dict[str, Any] = field(default_factory=dict)
