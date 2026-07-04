import { NextRequest } from "next/server";
import { promises as dns } from "dns";
import { successResponse, errorResponse } from "@/lib/api-helpers";
import { rateLimit } from "@/lib/rate-limit";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * POST /api/validate-email
 * Server-side DNS MX record check — verifies the domain can actually receive email.
 * More reliable than third-party APIs that often return UNKNOWN for fake domains.
 */
export async function POST(request: NextRequest) {
  try {
    // Basic IP-based rate limiting (5 requests per minute per IP)
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    const { allowed, remaining, resetIn } = rateLimit(ip, 5, 60 * 1000);

    if (!allowed) {
      return successResponse({
        valid: false,
        reason: `Too many attempts. Please try again in ${Math.ceil(resetIn / 1000)} seconds.`,
      });
    }

    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return errorResponse("Missing email field");
    }

    const trimmed = email.trim().slice(0, 254);

    // Step 1: format check
    if (!EMAIL_REGEX.test(trimmed)) {
      return successResponse({ valid: false, reason: "Invalid email format." });
    }

    // Step 2: DNS MX lookup — does this domain have a real mail server?
    const domain = trimmed.split("@")[1];
    try {
      const records = await dns.resolveMx(domain);
      if (records && records.length > 0) {
        return successResponse({ valid: true });
      }
      return successResponse({
        valid: false,
        reason: "This email domain cannot receive emails. Please use a real email address.",
      });
    } catch {
      // DNS lookup failed = domain doesn't exist or has no mail server
      return successResponse({
        valid: false,
        reason: "This email address doesn't appear to exist. Please use a real email.",
      });
    }
  } catch {
    return errorResponse("Invalid request");
  }
}
