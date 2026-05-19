import crypto from "crypto";

const characters =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const base62Encode = (num) => {
  let result = "";
  while (num > 0n) {
    const rem = num % 62n;
    result = characters[Number(rem)] + result;
    num = num / 62n;
  }
  return result;
};

export const generateUniqueId = (fileName, minLen = 3, maxLen = 8) => {
  // normalize filename
  fileName = fileName.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

  const currentTime = Math.floor(Date.now() / 1000);
  const randomPart = Math.floor(1000 + Math.random() * 9000);

  const combined = `${fileName}_${currentTime}_${randomPart}`;

  const hashHex = crypto.createHash("sha256").update(combined).digest("hex");
  const hashNum = BigInt("0x" + hashHex);

  let uniqueId = base62Encode(hashNum);

  if (uniqueId.length < minLen) {
    const pad = crypto.randomBytes(minLen - uniqueId.length).toString("base64");
    uniqueId = pad.slice(0, minLen - uniqueId.length) + uniqueId;
  } else if (uniqueId.length > maxLen) {
    uniqueId = uniqueId.slice(0, maxLen);
  }

  return uniqueId;
};
