<!-- Part of the Cryptography AbsolutelySkilled skill. Load this file when the user needs to choose between cryptographic algorithms, compare cipher modes, or understand when to use symmetric vs asymmetric approaches. -->

# Algorithm Selection Guide

Opinionated guidance on which cryptographic algorithm to pick for each use case.
When in doubt, choose the recommended algorithm and move on. Do not bikeshed crypto.

---

## 1. Password Hashing

| Algorithm | Verdict | When to use |
|---|---|---|
| **Argon2id** | Recommended | New systems. Winner of Password Hashing Competition. Memory-hard + side-channel resistant |
| **bcrypt** | Acceptable | Established systems with existing bcrypt hashes. Cost factor >= 12 |
| **scrypt** | Acceptable | When Argon2 is unavailable. N=2^15, r=8, p=1 minimum |
| **PBKDF2-SHA256** | Legacy only | Only for FIPS-required environments. Use iterations >= 600,000 (NIST 2023) |
| SHA-256 / SHA-512 | Never | Fast hashes - billions of attempts per second with a GPU |
| MD5 | Never | Broken, fast, no salt by default |

**Argon2id parameters for production:**

```
memoryCost:  65536  (64 MB - higher is better, balance against your server RAM)
timeCost:    3      (iterations)
parallelism: 1      (match to CPU cores if you want to use them)
hashLength:  32     (output bytes)
```

Increase `memoryCost` as hardware becomes cheaper. The goal is to keep hashing time
around 100-500ms on your server. Benchmark on your target hardware before deploying.

---

## 2. Symmetric Encryption

| Algorithm | Verdict | Notes |
|---|---|---|
| **AES-256-GCM** | Recommended | Authenticated encryption. Single operation for confidentiality + integrity |
| **ChaCha20-Poly1305** | Recommended | Preferred on hardware without AES-NI (mobile, IoT). Same security level |
| AES-128-GCM | Acceptable | 128-bit key has a smaller security margin but is still secure today |
| AES-256-CBC | Avoid | Unauthenticated. Requires separate HMAC. Padding oracle attacks if misimplemented |
| AES-256-ECB | Never | No IV, identical blocks produce identical ciphertext |
| DES / 3DES | Never | Deprecated. 3DES officially disallowed by NIST as of 2024 |

**AES-GCM vs ChaCha20-Poly1305:**

- Use **AES-GCM** when running on x86/x64 with AES-NI hardware acceleration (cloud
  servers, modern laptops). Fastest option by far.
- Use **ChaCha20-Poly1305** on ARM/embedded or any hardware without AES-NI. Equal
  security, avoids timing side-channels from software AES.
- Both provide authenticated encryption (AEAD). Both are in TLS 1.3.

**IV/nonce rules:**

| Algorithm | Nonce size | Uniqueness requirement |
|---|---|---|
| AES-GCM | 96 bits (12 bytes) | Must be unique per key. Reuse catastrophically breaks security |
| ChaCha20-Poly1305 | 96 bits (12 bytes) | Must be unique per key. Random is safe |
| AES-CBC | 128 bits (16 bytes) | Must be unpredictable (random). Reuse leaks XOR of plaintexts |

Always generate nonces with a cryptographically secure RNG (`crypto.randomBytes`).
Do not use a counter unless you have strict control over the key lifetime.

---

## 3. Asymmetric Encryption and Key Exchange

| Algorithm | Verdict | Use case |
|---|---|---|
| **ECDH (P-256 / X25519)** | Recommended | Key exchange, ephemeral session keys |
| **RSA-OAEP (2048-bit+)** | Acceptable | Encrypting small keys/secrets when ECDH is not available |
| RSA-PKCS1v1.5 | Never | Padding oracle (PKCS#1 v1.5 is broken for encryption) |
| Raw RSA (textbook) | Never | No padding - trivially broken |

**ECDH vs RSA for key exchange:**

- ECDH with P-256 or X25519 provides the same security as RSA-3072 at a fraction of
  the key size and computation cost.
- Prefer **X25519** when you control both ends - it was designed to avoid
  implementation mistakes (no cofactor issues, constant-time by construction).
- Use **P-256 (prime256v1)** for broad compatibility (FIPS environments, TLS, JWT).

**When to use asymmetric encryption:**

Asymmetric encryption is for small payloads only (a key, a token, a hash). For bulk
data, use hybrid encryption: generate an ephemeral symmetric key, encrypt it with the
recipient's public key, encrypt the data with the symmetric key, discard the symmetric
key.

```
Sender:
  1. Generate random DEK (AES-256 key)
  2. Encrypt plaintext with DEK (AES-256-GCM)
  3. Encrypt DEK with recipient's public key (RSA-OAEP or ECIES)
  4. Send: encrypted DEK + IV + ciphertext + auth tag

Recipient:
  1. Decrypt DEK with private key
  2. Decrypt ciphertext with DEK
  3. Zero DEK from memory
```

---

## 4. Digital Signatures

| Algorithm | Verdict | Notes |
|---|---|---|
| **Ed25519** | Recommended | Fast, small signatures (64 bytes), safe by design. Use for new systems |
| **ES256 (ECDSA P-256)** | Recommended | Widely supported in JWT, TLS, browser Web Crypto API |
| **RS256 (RSA-PSS SHA-256)** | Acceptable | Use RSA-PSS, not PKCS1v1.5. Required for some compliance environments |
| RS256 with PKCS1v1.5 | Avoid | Deterministic, not IND-CCA2 secure for signatures |
| ECDSA without deterministic K | Never | If random K is weak/reused, private key is recoverable |

**JWT algorithm selection:**

```
ES256  - P-256 curve, SHA-256. Good balance. Supported everywhere.
ES384  - P-384 curve, SHA-384. Higher security margin, slightly slower.
EdDSA  - Ed25519. Best choice for new systems where library support exists.
RS256  - RSA 2048+, SHA-256. Choose only for FIPS compliance or legacy clients.

Never use:
  HS256  (symmetric HMAC) for multi-party JWTs - any party can forge tokens
  none   (no signature) - allows trivial forgery
  RS256 with 1024-bit keys - broken key size
```

**Signature size comparison (for bandwidth/storage consideration):**

| Algorithm | Signature size |
|---|---|
| Ed25519 | 64 bytes |
| ES256 | ~72 bytes (variable DER encoding) |
| RS256 (2048-bit) | 256 bytes |
| RS256 (4096-bit) | 512 bytes |

---

## 5. Hashing (Non-Password)

| Algorithm | Verdict | Use case |
|---|---|---|
| **SHA-256** | Recommended | Integrity checks, checksums, HMAC, key derivation input |
| **SHA-384 / SHA-512** | Recommended | Higher security margin, use where output size is acceptable |
| **SHA-3 (Keccak)** | Recommended | When SHA-2 is specifically excluded (some FIPS contexts) |
| **BLAKE3** | Recommended | Fastest modern hash. Use for non-FIPS high-throughput scenarios |
| SHA-1 | Never | Collision attacks demonstrated (SHAttered, 2017) |
| MD5 | Never | Collision attacks since 2004 |

**When to use which hash function:**

- **Content integrity / checksums** - SHA-256. Standard, universally supported.
- **HMAC signatures** - HMAC-SHA256. Industry standard for API signing, webhooks.
- **Key derivation from another key** - HKDF-SHA256. Extract entropy, then expand.
- **Password hashing** - Do NOT use any hash here. Use Argon2id (see section 1).
- **High-throughput content addressing** - BLAKE3. 3-4x faster than SHA-256 in software.

---

## 6. Key Derivation

| Function | Verdict | Use case |
|---|---|---|
| **HKDF** | Recommended | Derive multiple keys from one master key or shared secret |
| **Argon2id** | Recommended | Derive key from a password (slow by design) |
| **PBKDF2** | Legacy | FIPS-required environments only |
| `crypto.scrypt` | Acceptable | Alternative to Argon2 when Argon2 library unavailable |
| Raw SHA-256(password) | Never | No key stretching - fast and vulnerable to brute force |

**HKDF usage pattern (Node.js):**

```typescript
import { hkdfSync } from 'crypto';

// Derive a 256-bit encryption key and a 256-bit MAC key from one master secret
const masterSecret = Buffer.from(process.env.MASTER_SECRET!, 'base64');
const salt = randomBytes(32); // optional but recommended; store alongside derived output
const info = Buffer.from('app-v1-encryption-key', 'utf8');

const encryptionKey = Buffer.from(
  hkdfSync('sha256', masterSecret, salt, info, 32)
);
```

---

## 7. TLS Configuration

**Protocol versions:**

| Version | Status | Action |
|---|---|---|
| TLS 1.3 | Current standard | Enable, prefer |
| TLS 1.2 | Acceptable fallback | Allow only if legacy clients require it |
| TLS 1.1 | Deprecated (RFC 8996) | Disable |
| TLS 1.0 | Deprecated (RFC 8996) | Disable |
| SSL 3.0 | Broken (POODLE) | Disable |

**Recommended cipher suites for TLS 1.2 fallback:**

```
TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384
TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256
TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256

Disable:
  Any cipher with RC4, DES, 3DES, NULL, EXPORT, or anon
  ECDHE-RSA-AES*-CBC* (unauthenticated CBC modes)
  Any DHE with DH params < 2048 bits (Logjam attack)
```

TLS 1.3 cipher suites are non-negotiable and always safe - they are the only ones
the protocol supports.

**Certificate key sizes:**

| Key type | Minimum | Recommended |
|---|---|---|
| RSA | 2048 bits | 4096 bits for new CAs; 2048 acceptable for leaf certs |
| ECDSA | P-256 | P-256 (equivalent to RSA-3072) |
| Ed25519 | - | Preferred where supported |

Use ECDSA P-256 leaf certificates for new deployments - smaller, faster TLS handshakes,
same or better security than RSA-2048.

---

## Quick Decision Tree

```
What are you protecting?

PASSWORDS
  -> Argon2id (preferred) or bcrypt (cost 12+)
  -> NEVER SHA-*, MD5, or custom hashing

DATA AT REST
  -> AES-256-GCM (or ChaCha20-Poly1305 on non-AES-NI hardware)
  -> Fresh random IV per encryption
  -> Store IV + auth tag + ciphertext together

DATA IN TRANSIT
  -> TLS 1.3 minimum
  -> ECDSA P-256 cert

SIGNING A TOKEN (JWT)
  -> ES256 (ECDSA P-256) for new systems
  -> RS256 (RSA-PSS 2048+) only for FIPS compliance
  -> Always specify algorithm allowlist on verification

SIGNING AN API REQUEST / WEBHOOK
  -> HMAC-SHA256
  -> Include timestamp to prevent replay
  -> Compare with timingSafeEqual

KEY EXCHANGE
  -> X25519 (ECDH) or P-256 ECDH
  -> Hybrid: ECDH for key exchange, AES-GCM for data

INTEGRITY CHECK (not passwords)
  -> SHA-256 for files, checksums, content addressing
  -> HMAC-SHA256 if authenticity matters too

RANDOM TOKEN / SESSION ID
  -> crypto.randomBytes(32) minimum
  -> base64url encode for URL-safe output
```
