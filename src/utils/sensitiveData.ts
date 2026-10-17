// Sensitive Data Detection
// Detects and rejects bank accounts, card numbers, Aadhaar, PAN, GST, etc.

export interface SensitiveDataCheck {
  isSensitive: boolean;
  type?: string;
  message: string;
}

// Patterns for sensitive data
const SENSITIVE_PATTERNS = {
  // Bank account numbers (10-18 digits)
  bankAccount: /\b\d{10,18}\b/,
  
  // Card numbers (16 digits, sometimes with spaces)
  cardNumber: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/,
  
  // Aadhaar (12 digits)
  aadhaar: /\b\d{12}\b/,
  
  // PAN (5 letters, 4 digits, 1 letter)
  pan: /\b[A-Z]{5}\d{4}[A-Z]\b/,
  
  // GST number (15 characters: 2 state code + 10 PAN + 1 entity + 1 check + 1 default)
  gst: /\b\d{2}[A-Z]{5}\d{4}[A-Z][A-Z0-9][Z][A-Z0-9]\b/,
  
  // UPI ID (contains @)
  upiId: /\b[\w.-]+@[\w]+\b/,
  
  // IFSC code (11 characters: 4 letters + 0 + 6 alphanumeric)
  ifsc: /\b[A-Z]{4}0[A-Z0-9]{6}\b/,
  
  // Phone numbers (10 digits, sometimes with +91)
  phone: /(?:\+?91[\s-]?)?\b\d{10}\b/,
  
  // Passwords (common patterns)
  password: /\b(password|passwd|pwd)[\s:]*[\w@#$%^&*]+/i,
  
  // OTP (4-6 digits)
  otp: /\b(otp|code)[\s:]*(\d{4,6})\b/i,
};

// Check if input contains sensitive data
export function detectSensitiveData(input: string): SensitiveDataCheck {
  if (!input || input.trim().length === 0) {
    return { isSensitive: false, message: '' };
  }
  
  const normalized = input.trim();
  
  // Check for long digit strings (potential account/card numbers)
  const digitMatches = normalized.match(/\d+/g);
  if (digitMatches) {
    for (const match of digitMatches) {
      if (match.length >= 10) {
        return {
          isSensitive: true,
          type: 'bank-or-personal',
          message: 'Please do not enter bank or personal details. This app does not need them.',
        };
      }
    }
  }
  
  // Check specific patterns
  if (SENSITIVE_PATTERNS.cardNumber.test(normalized)) {
    return {
      isSensitive: true,
      type: 'card',
      message: 'Please do not enter card numbers. This app does not need them.',
    };
  }
  
  if (SENSITIVE_PATTERNS.aadhaar.test(normalized)) {
    return {
      isSensitive: true,
      type: 'aadhaar',
      message: 'Please do not enter Aadhaar numbers. This app does not need them.',
    };
  }
  
  if (SENSITIVE_PATTERNS.pan.test(normalized)) {
    return {
      isSensitive: true,
      type: 'pan',
      message: 'Please do not enter PAN numbers. This app does not need them.',
    };
  }
  
  if (SENSITIVE_PATTERNS.gst.test(normalized)) {
    return {
      isSensitive: true,
      type: 'gst',
      message: 'Please do not enter GST numbers. This app does not need them.',
    };
  }
  
  if (SENSITIVE_PATTERNS.upiId.test(normalized)) {
    return {
      isSensitive: true,
      type: 'upi',
      message: 'Please do not enter UPI IDs. This app does not need them.',
    };
  }
  
  if (SENSITIVE_PATTERNS.ifsc.test(normalized)) {
    return {
      isSensitive: true,
      type: 'ifsc',
      message: 'Please do not enter IFSC codes. This app does not need them.',
    };
  }
  
  if (SENSITIVE_PATTERNS.password.test(normalized)) {
    return {
      isSensitive: true,
      type: 'password',
      message: 'Please do not enter passwords. This app does not need them.',
    };
  }
  
  if (SENSITIVE_PATTERNS.otp.test(normalized)) {
    return {
      isSensitive: true,
      type: 'otp',
      message: 'Please do not enter OTPs. This app does not need them.',
    };
  }
  
  // Check for keywords
  const sensitiveKeywords = [
    'account number', 'account no', 'acc no',
    'card number', 'card no',
    'aadhaar', 'aadhar',
    'pan number', 'pan no',
    'gst number', 'gst no',
    'upi id', 'upi pin',
    'ifsc', 'bank',
    'password', 'passwd',
    'otp', 'verification code',
  ];
  
  const lowerInput = normalized.toLowerCase();
  for (const keyword of sensitiveKeywords) {
    if (lowerInput.includes(keyword)) {
      return {
        isSensitive: true,
        type: 'personal',
        message: 'Please do not enter bank or personal details. This app does not need them.',
      };
    }
  }
  
  return { isSensitive: false, message: '' };
}

// Validate and sanitize input
export function validateInput(input: string): {
  isValid: boolean;
  sanitized: string;
  error?: string;
} {
  const check = detectSensitiveData(input);
  
  if (check.isSensitive) {
    return {
      isValid: false,
      sanitized: '',
      error: check.message,
    };
  }
  
  return {
    isValid: true,
    sanitized: input.trim(),
  };
}
