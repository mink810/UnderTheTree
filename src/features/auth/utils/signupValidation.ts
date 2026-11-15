const EMAIL_RE =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizePhone(input: string): string {
  return input.replace(/\D/g, '');
}

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim());
}

export function isValidPhoneDigits(phone: string): boolean {
  const digits = normalizePhone(phone);
  return /^01[016789]\d{7,8}$/.test(digits);
}

/** 8자 이상, 영문·숫자 포함 */
export function isValidPassword(password: string): boolean {
  if (password.length < 8) {
    return false;
  }
  return /[A-Za-z]/.test(password) && /\d/.test(password);
}

export function passwordPolicyMessage(): string {
  return '비밀번호는 8자 이상, 영문과 숫자를 포함해야 해요.';
}
