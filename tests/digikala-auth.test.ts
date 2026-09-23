import test from "node:test";
import assert from "node:assert/strict";
import { constants, generateKeyPairSync, publicEncrypt } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import {
  base64DecodeValidationCode,
  decryptValidationCode,
  getDigikalaPrivateKeyPem,
} from "../lib/digikala/auth";

test("base64 decode validation code returns original bytes", () => {
  const payload = Buffer.from("hello-digikala", "utf8").toString("base64");
  assert.equal(base64DecodeValidationCode(payload).toString("utf8"), "hello-digikala");
});

test("decryptValidationCode can decrypt an OAEP payload generated with a test RSA key", () => {
  const { publicKey, privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });

  const plaintext = "validation-value-123";
  const encrypted = Buffer.from(
    publicEncrypt(
      {
        key: publicKey,
        padding: constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      Buffer.from(plaintext, "utf8"),
    ),
  ).toString("base64");

  assert.equal(decryptValidationCode(encrypted, privateKey), plaintext);
});

test("getDigikalaPrivateKeyPem reads the key from the configured secure file path", () => {
  const tempDir = path.join(tmpdir(), `digikala-${Date.now()}`);
  mkdirSync(tempDir, { recursive: true, mode: 0o700 });
  const privateKeyPath = path.join(tempDir, "digikala-private.pem");
  const { privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });

  writeFileSync(privateKeyPath, privateKey, { mode: 0o600 });
  process.env.DIGIKALA_PRIVATE_KEY_PATH = privateKeyPath;

  try {
    assert.equal(getDigikalaPrivateKeyPem().includes("BEGIN PRIVATE KEY"), true);
  } finally {
    delete process.env.DIGIKALA_PRIVATE_KEY_PATH;
  }
});
