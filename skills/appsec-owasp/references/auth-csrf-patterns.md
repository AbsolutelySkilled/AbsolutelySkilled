<!-- Part of the AppSec OWASP AbsolutelySkilled skill. Load this file when working with CSRF protection or secure authentication implementation. -->

# CSRF Protection and Secure Authentication Patterns

## Implement CSRF protection

Use the Synchronizer Token Pattern or SameSite cookies. For modern SPAs the
`SameSite=Strict` or `SameSite=Lax` cookie attribute is usually sufficient.

```typescript
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

// --- Token pattern (for traditional server-rendered forms) ---

function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

function setCsrfToken(req: Request, res: Response): string {
  const token = generateCsrfToken();
  // Store in httpOnly session, expose to page via non-httpOnly cookie or meta tag
  req.session.csrfToken = token;
  return token;
}

function verifyCsrf(req: Request, res: Response, next: NextFunction): void {
  const sessionToken = req.session?.csrfToken;
  const submittedToken =
    (req.headers['x-csrf-token'] as string) ?? req.body?._csrf;

  if (
    !sessionToken ||
    !submittedToken ||
    !crypto.timingSafeEqual(
      Buffer.from(sessionToken),
      Buffer.from(submittedToken)
    )
  ) {
    res.status(403).json({ error: 'Invalid CSRF token' });
    return;
  }
  next();
}

// --- SameSite cookies (for SPAs with JWT or session cookies) ---
// Set on login response:
res.cookie('session', token, {
  httpOnly: true,
  secure: true,          // HTTPS only
  sameSite: 'strict',    // never sent on cross-site requests
  path: '/',
});
```

## Implement secure authentication (bcrypt, JWT, session)

```typescript
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

const BCRYPT_ROUNDS = 12; // increase as hardware improves
const JWT_SECRET = process.env.JWT_SECRET!; // loaded from secrets manager
const ACCESS_TOKEN_TTL = '15m';
const REFRESH_TOKEN_TTL = '7d';

// --- Password hashing ---
async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

// --- JWT issuance ---
interface TokenPayload {
  sub: string; // user ID
  role: string;
}

function issueAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_TTL });
}

// --- Secure login handler ---
async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);

  // Always run bcrypt even on missing user - prevent timing-based user enumeration
  const hash = user?.passwordHash ?? '$2b$12$invalidhashpadding000000000000000000000000000000000000';
  const valid = await verifyPassword(password, hash);

  if (!user || !valid) {
    res.status(401).json({ error: 'Invalid email or password' }); // generic message
    return;
  }

  const accessToken = issueAccessToken({ sub: user.id, role: user.role });

  // Store access token in httpOnly cookie - not localStorage
  res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000, // 15 minutes in ms
  });

  res.json({ ok: true });
}
```
