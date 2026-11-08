# Synthetic Bound Surface with integration details

Bound Surface · r1

Synthetic role/product identities only; runtime unverified.

- **Assistant → MongoDB** (role endpoints; configured)
  Target: MongoDB Atlas. Purpose: known: Persist conversation history and user profiles.. Integration: known: MongoDB client driver using the MongoDB wire protocol..
- **Assistant → OIDC** (role endpoints; conflicting)
  Target: OIDC service, SAML service. Purpose: known: Authenticate users through an identity service.. Integration: known: OpenID Connect.
- **Assistant → Inference service** (role endpoints; unknown)
  Target: unknown. Purpose: unknown: Not researched; no absence assertion.. Integration: unknown: Not researched; no absence assertion..

## Evidence and decisions

See research.html for exact sources, findings, competing claims and human decisions; surface.json retains property-level evidence and configuration references. Configured does not establish runtime use.

## Gaps

- Authentication conflict; inference unknown; runtime unverified

## Recommended next steps

Review the evidence and confirm the next question before expanding coverage.
