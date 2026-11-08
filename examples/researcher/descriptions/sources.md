# Fictional assistant source pack

## Product guide

The assistant supports MongoDB storage, OIDC authentication, and SAML authentication.
OIDC and SAML are mutually exclusive for this example instance. Inference support
has not been researched.

## Sanitized instance configuration summary, revision 1

The database relationship is configured for MongoDB Atlas. No endpoint, username,
password or key is included. The two permitted summaries disagree about identity:
one identifies the OIDC service, the other the SAML service. Neither establishes
runtime use. Inference binding evidence is missing.

## Human decision

A synthetic reviewer prefers OIDC. This decision does not resolve the contradictory
configuration summaries.

## Sanitized instance configuration summary, revision 2

The database relationship is now configured for a self-hosted MongoDB service.
The other evidence remains unchanged. No actual setting values are supplied.
