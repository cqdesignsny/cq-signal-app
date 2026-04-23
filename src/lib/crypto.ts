import "server-only";
import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

// AES-256-GCM authenticated encryption for OAuth tokens and API keys at rest.
// Key is a 32-byte value stored as base64 in env var CQ_SIGNAL_SECRET.
// Payload layout: base64( iv[12] | authTag[16] | ciphertext[n] ).

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const KEY_LENGTH = 32;

function getKey(): Buffer {
  const secret = process.env.CQ_SIGNAL_SECRET;
  if (!secret) {
    throw new Error(
      "CQ_SIGNAL_SECRET is not set. Generate one with `openssl rand -base64 32` and add it to Vercel env and .env.local.",
    );
  }
  const key = Buffer.from(secret, "base64");
  if (key.length !== KEY_LENGTH) {
    throw new Error(
      `CQ_SIGNAL_SECRET must decode to ${KEY_LENGTH} bytes. Got ${key.length}. Regenerate with \`openssl rand -base64 32\`.`,
    );
  }
  return key;
}

export function encrypt(plaintext: string): string {
  const key = getKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, ciphertext]).toString("base64");
}

export function decrypt(payload: string): string {
  const key = getKey();
  const buf = Buffer.from(payload, "base64");
  if (buf.length < IV_LENGTH + AUTH_TAG_LENGTH) {
    throw new Error("Encrypted payload is too short to be valid.");
  }
  const iv = buf.subarray(0, IV_LENGTH);
  const authTag = buf.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const ciphertext = buf.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return plaintext.toString("utf8");
}

export function encryptJson(obj: unknown): string {
  return encrypt(JSON.stringify(obj));
}

export function decryptJson<T = unknown>(payload: string): T {
  return JSON.parse(decrypt(payload)) as T;
}

// Quick self-check for local development. Throws if encrypt/decrypt
// roundtrip fails, surfacing key misconfig fast.
export function assertCryptoHealthy(): void {
  const sample = "cq-signal-health-check";
  const roundtrip = decrypt(encrypt(sample));
  if (roundtrip !== sample) {
    throw new Error("Crypto self-check failed: roundtrip mismatch.");
  }
}
