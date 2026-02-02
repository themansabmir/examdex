/**
 * Phone number validation utility
 */
export class PhoneValidator {
  /**
   * Validate and format phone number to E.164 format
   * E.164: +[country code][subscriber number]
   * Example: +919876543210
   */
  static validateAndFormat(
    phoneNumber: string,
    defaultCountryCode: string = "+91"
  ): {
    isValid: boolean;
    formatted?: string;
    error?: string;
  } {
    // Remove all non-digit characters except +
    let cleaned = phoneNumber.replace(/[^\d+]/g, "");

    // Check if already has country code
    if (!cleaned.startsWith("+")) {
      // Add default country code
      cleaned = defaultCountryCode + cleaned;
    }

    // Validate format
    const e164Regex = /^\+[1-9]\d{1,14}$/;

    if (!e164Regex.test(cleaned)) {
      return {
        isValid: false,
        error: "Invalid phone number format. Expected: +[country code][number]",
      };
    }

    // Additional validation: Check length
    const numberWithoutPlus = cleaned.substring(1);
    if (numberWithoutPlus.length < 10 || numberWithoutPlus.length > 15) {
      return {
        isValid: false,
        error: "Phone number must be between 10 and 15 digits",
      };
    }

    return {
      isValid: true,
      formatted: cleaned,
    };
  }

  /**
   * Validate Indian phone number specifically
   */
  static validateIndianNumber(phoneNumber: string): {
    isValid: boolean;
    formatted?: string;
    error?: string;
  } {
    const result = this.validateAndFormat(phoneNumber, "+91");

    if (!result.isValid) {
      return result;
    }

    // Indian numbers should be +91 followed by 10 digits
    if (!result.formatted?.match(/^\+91\d{10}$/)) {
      return {
        isValid: false,
        error: "Invalid Indian phone number. Expected: +91 followed by 10 digits",
      };
    }

    return result;
  }

  /**
   * Check if phone number is mobile (not landline)
   * This is a basic check for Indian numbers
   */
  static isMobile(phoneNumber: string): boolean {
    const cleaned = phoneNumber.replace(/[^\d]/g, "");

    // Indian mobile numbers start with 6, 7, 8, or 9
    if (cleaned.startsWith("91")) {
      const firstDigit = cleaned.charAt(2);
      return ["6", "7", "8", "9"].includes(firstDigit);
    }

    // For other countries, assume it's mobile
    return true;
  }
}
