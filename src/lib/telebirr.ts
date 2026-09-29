import "server-only";

// Telebirr SMS parser (used by the sms-gateway repo) so the admin panel can
// ingest the same SMS messages that are forwarded from the admin's phone.

export type ParsedTelebirr = {
  txid: string;
  amount: number;
  type: string;
  senderName?: string;
  senderPhone?: string;
  date: string;
  balance?: number;
  rawText: string;
  isValidTelebirr: boolean;
  confidence: "high" | "medium" | "low";
};

export function parseTelebirrSMS(rawText: string): ParsedTelebirr {
  const text = rawText.trim();
  const normalized = text.replace(/\s+/g, " ");

  // 1. Transaction ID
  let txid = "";
  const txnPatterns = [
    /(?:transaction\s*(?:number|id|no\.?|code)\s*(?:is|:)?\s*|txn\s*(?:id|no\.?)?:?\s*)([A-Z0-9]{7,16})/i,
    /(?:የግብይት\s*(?:መለያ\s*)?ቁጥር(?:ዎ)?\s*(?:ነው|:)?\s*)([A-Z0-9]{7,16})/u,
    /(?:Trans\.?\s*ID:?\s*)([A-Z0-9]{7,16})/i,
    /\b([A-Z]{2,4}[0-9A-Z]{6,12})\b/,
  ];
  for (const pattern of txnPatterns) {
    const match = normalized.match(pattern);
    if (match && match[1]) {
      txid = match[1].trim().toUpperCase();
      break;
    }
  }

  // 2. Amount
  let amount = 0;
  const amountPatterns = [
    /(?:ETB|birr)\s*([0-9,]+(?:\.[0-9]{1,2})?)/i,
    /([0-9,]+(?:\.[0-9]{1,2})?)\s*(?:ETB|birr|ብር)/i,
    /(?:deposited|received|ደላላ|አስቀምጠዋል|ደርሶዎታል።?)\s*(?:ETB\s*)?([0-9,]+(?:\.[0-9]{1,2})?)/i,
    /(?:ብር\s*)([0-9,]+(?:\.[0-9]{1,2})?)/u,
  ];
  for (const pattern of amountPatterns) {
    const match = normalized.match(pattern);
    if (match && match[1]) {
      const parsed = parseFloat(match[1].replace(/,/g, ""));
      if (!isNaN(parsed) && parsed > 0) {
        amount = parsed;
        break;
      }
    }
  }

  // 3. Balance
  let balance: number | undefined;
  const balancePatterns = [
    /(?:current\s*balance\s*(?:is|:)?\s*(?:ETB\s*)?|balance\s*is\s*(?:ETB\s*)?)([0-9,]+(?:\.[0-9]{1,2})?)/i,
    /(?:አጠቃላይ\s*ሂሳብዎ\s*(?:ነው|:)?\s*)([0-9,]+(?:\.[0-9]{1,2})?)/u,
    /(?:balance:\s*)([0-9,]+(?:\.[0-9]{1,2})?)/i,
  ];
  for (const pattern of balancePatterns) {
    const match = normalized.match(pattern);
    if (match && match[1]) {
      const parsed = parseFloat(match[1].replace(/,/g, ""));
      if (!isNaN(parsed)) {
        balance = parsed;
        break;
      }
    }
  }

  // 4. Date
  let date = "";
  const datePatterns = [
    /\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\s+\d{1,2}:\d{2}(?::\d{2})?)\b/,
    /\b(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}\s+\d{1,2}:\d{2}(?::\d{2})?)\b/,
    /(?:on|በ|date:?)\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
  ];
  for (const pattern of datePatterns) {
    const match = normalized.match(pattern);
    if (match && match[1]) {
      date = match[1].trim();
      break;
    }
  }
  if (!date) {
    const now = new Date();
    date = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
  }

  // 5. Sender name / phone
  let senderName: string | undefined;
  let senderPhone: string | undefined;
  const senderMatch = normalized.match(/(?:from|ከ)\s+([A-Za-z\s\u1200-\u137F]+?)(?:\s*\(([0-9*+]+)\)|\s+on\s+|\s+በ\s+|\s+account|\s+[0-9])/i);
  if (senderMatch) {
    if (senderMatch[1]) {
      const candidate = senderMatch[1].trim();
      if (!/^(account|your|cbe|bank)$/i.test(candidate) && candidate.length > 1) {
        senderName = candidate;
      }
    }
    if (senderMatch[2]) senderPhone = senderMatch[2].trim();
  }
  if (!senderPhone) {
    const phoneMatch = normalized.match(/\b(\+?2519\d{8}|09\d{8}|2519\*{4,6}\d{2})\b/);
    if (phoneMatch) senderPhone = phoneMatch[1];
  }

  // 6. Type
  let type = "Deposit";
  const lower = normalized.toLowerCase();
  if (/(bank|cbe|awash|dashen|abyssinia|boa)/.test(lower)) type = "Bank Transfer";
  else if (/(merchant|payment received|buyer|payment from)/.test(lower)) type = "Merchant Payment";
  else if (/(received|ደርሶዎታ|transfer from)/.test(lower)) type = "Received Transfer";
  else if (/(cash in|agent)/.test(lower)) type = "Cash In";
  else if (/(deposit|አስቀምጠዋል)/.test(lower)) type = "Deposit";

  // 7. Telebirr check + confidence
  const isTelebirrMentioned =
    /telebirr|ቴሌብር|ethio telecom|ኢትዮ ቴሌኮም|127/i.test(normalized) ||
    /transaction (?:number|id)|የግብይት (?:መለያ )?ቁጥር/i.test(normalized);
  const isValidTelebirr = (txid.length >= 6 && amount > 0) || isTelebirrMentioned;

  let confidence: ParsedTelebirr["confidence"] = "low";
  if (txid && amount > 0 && isTelebirrMentioned) confidence = "high";
  else if (txid && amount > 0) confidence = "medium";

  return {
    txid: txid || "UNKNOWN_TXN",
    amount,
    type,
    senderName,
    senderPhone,
    date,
    balance,
    rawText: text,
    isValidTelebirr,
    confidence,
  };
}