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

## Database integration

The fictional assistant persists conversation history and user profiles in MongoDB.
It connects using a MongoDB client driver and the MongoDB wire protocol.
The assistant owns the CHAT_STORE_URI environment variable, documented in
config/assistant.env.example. Only the setting name and relative documentation
location are retained here; no configured value is included.

## Authentication integration

The assistant authenticates users through an identity service. OIDC uses the
OpenID Connect protocol; SAML uses SAML 2.0. Configuration locations have not been
researched and must remain unknown, not absent.
