import { cookies } from "next/headers";
import crypto from "crypto";

const SESSION_COOKIE_NAME = "daffa_studio_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// In-memory active session tokens store with expiration
interface SessionData {
  token: string;
  createdAt: number;
  expiresAt: number;
}

const activeSessions = new Map<string, SessionData>();

function getAdminPassword(): string {
  return process.env.STUDIO_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || "daffa2026!";
}

function getSessionSecret(): string {
  return process.env.STUDIO_SESSION_SECRET || "daffa-studio-secure-secret-key-2026";
}

function signToken(token: string): string {
  const hmac = crypto.createHmac("sha256", getSessionSecret());
  hmac.update(token);
  const signature = hmac.digest("hex");
  return `${token}.${signature}`;
}

function verifySignedToken(signedToken: string): string | null {
  const parts = signedToken.split(".");
  if (parts.length !== 2) return null;
  const [token, signature] = parts;
  const expectedHmac = crypto.createHmac("sha256", getSessionSecret());
  expectedHmac.update(token);
  const expectedSignature = expectedHmac.digest("hex");

  try {
    const sigBuf = Buffer.from(signature, "hex");
    const expBuf = Buffer.from(expectedSignature, "hex");
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }
  } catch {
    return null;
  }

  return token;
}

export const auth = {
  validatePassword(password: string): boolean {
    const adminPassword = getAdminPassword();
    if (!password) return false;
    const a = Buffer.from(password);
    const b = Buffer.from(adminPassword);
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  },

  async createSession(): Promise<string> {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const now = Date.now();
    const expiresAt = now + SESSION_MAX_AGE * 1000;

    activeSessions.set(rawToken, {
      token: rawToken,
      createdAt: now,
      expiresAt
    });

    const signedToken = signToken(rawToken);
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, signedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE,
      path: "/"
    });

    return signedToken;
  },

  async destroySession(): Promise<void> {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(SESSION_COOKIE_NAME);
    if (cookie?.value) {
      const rawToken = verifySignedToken(cookie.value);
      if (rawToken) {
        activeSessions.delete(rawToken);
      }
    }
    cookieStore.delete(SESSION_COOKIE_NAME);
  },

  async isAuthenticated(): Promise<boolean> {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(SESSION_COOKIE_NAME);
    if (!cookie?.value) return false;

    const rawToken = verifySignedToken(cookie.value);
    if (!rawToken) return false;

    // Check memory session or valid signed token with valid secret
    const session = activeSessions.get(rawToken);
    if (session) {
      if (Date.now() > session.expiresAt) {
        activeSessions.delete(rawToken);
        return false;
      }
      return true;
    }

    // Even if memory wiped (e.g. server restart), signed cryptographically valid token is honored
    return true;
  },

  async requireAdmin(): Promise<{ authorized: boolean; error?: string }> {
    const isAuth = await this.isAuthenticated();
    if (!isAuth) {
      return { authorized: false, error: "Unauthorized: Admin session required." };
    }
    return { authorized: true };
  }
};
