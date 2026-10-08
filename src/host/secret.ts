/**
 * Secret: lock a small secret (for example a CDN API token) before it goes into the store.
 *
 * - AES-256-GCM. The key is the SHA-256 of `WEBAGENT_SECRET_KEY`.
 * - A locked value is `v1:<base64 of iv, tag, cipher text>`.
 * - Without the key, the service cannot lock or unlock. It never falls back to plain text.
 */
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

export const SECRET_ENV = "WEBAGENT_SECRET_KEY";
/** Shortest key text that the service accepts. */
export const SECRET_MIN = 32;

const PREFIX = "v1:";
const IV_BYTES = 12;
const TAG_BYTES = 16;

/** The key from the env, or undefined when it is missing or too short. */
export function getSecretKey(env: Record<string, string | undefined> = process.env): Buffer | undefined {
  const text = env[SECRET_ENV];
  if (!text || text.length < SECRET_MIN) return undefined;
  return createHash("sha256").update(text).digest();
}

export function lockSecret(text: string, key: Buffer): string {
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const body = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  return PREFIX + Buffer.concat([iv, cipher.getAuthTag(), body]).toString("base64");
}

/** The plain text, or undefined when the value is not ours or the key is wrong. */
export function unlockSecret(locked: string, key: Buffer): string | undefined {
  if (!locked.startsWith(PREFIX)) return undefined;
  const raw = Buffer.from(locked.slice(PREFIX.length), "base64");
  if (raw.length <= IV_BYTES + TAG_BYTES) return undefined;
  try {
    const decipher = createDecipheriv("aes-256-gcm", key, raw.subarray(0, IV_BYTES));
    decipher.setAuthTag(raw.subarray(IV_BYTES, IV_BYTES + TAG_BYTES));
    return Buffer.concat([decipher.update(raw.subarray(IV_BYTES + TAG_BYTES)), decipher.final()]).toString("utf8");
  } catch {
    return undefined;
  }
}
