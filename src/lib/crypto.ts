import {
  createCipheriv,
  createDecipheriv,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "crypto";

/**
 * AES-256-GCM at-rest encryption for sensitive values (e.g. refresh tokens we
 * manage ourselves). Key comes from TOKEN_ENCRYPTION_KEY (32-byte base64).
 */
function key(): Buffer {
  const raw = process.env.TOKEN_ENCRYPTION_KEY;
  if (!raw) throw new Error("TOKEN_ENCRYPTION_KEY is not set");
  const buf = Buffer.from(raw, "base64");
  if (buf.length !== 32) {
    throw new Error("TOKEN_ENCRYPTION_KEY must decode to 32 bytes (base64)");
  }
  return buf;
}

export function encrypt(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv, tag, enc].map((b) => b.toString("base64")).join(".");
}

export function decrypt(payload: string): string {
  const [ivB64, tagB64, dataB64] = payload.split(".");
  const decipher = createDecipheriv(
    "aes-256-gcm",
    key(),
    Buffer.from(ivB64, "base64"),
  );
  decipher.setAuthTag(Buffer.from(tagB64, "base64"));
  return Buffer.concat([
    decipher.update(Buffer.from(dataB64, "base64")),
    decipher.final(),
  ]).toString("utf8");
}

/**
 * Constant-time check used to authenticate the Apps Script -> app ingest
 * webhook (X-Ingest-Secret header).
 */
export function verifyIngestSecret(provided: string | null): boolean {
  const expected = process.env.INGEST_SECRET ?? "";
  if (!provided || !expected) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** HMAC tag for tamper-proofing tracking links, if we want signed pixels. */
export function sign(value: string): string {
  const secret = process.env.INGEST_SECRET ?? "";
  return createHmac("sha256", secret).update(value).digest("hex").slice(0, 16);
}
