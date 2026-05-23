// Lightweight client-side validation helpers. Server-side validation in Zod
// is still authoritative — these just give faster feedback in the form UI.

const EMAIL_RE =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
const PHONE_RE = /^\+?[\d\s-]{7,18}$/;

export function isValidEmail(email) {
  return typeof email === 'string' && EMAIL_RE.test(email.trim());
}

export function isValidPhone(phone) {
  return typeof phone === 'string' && PHONE_RE.test(phone.trim());
}

// Returns { strength: 0-4, label, suggestions[] }.
// 0 = empty, 1 = weak, 2 = fair, 3 = good, 4 = strong.
export function getPasswordStrength(password) {
  if (!password) return { strength: 0, label: 'Empty', suggestions: ['Enter a password'] };

  const checks = {
    length: password.length >= 8,
    longer: password.length >= 12,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    digit: /\d/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };

  let score = 0;
  if (checks.length) score += 1;
  if (checks.upper && checks.lower) score += 1;
  if (checks.digit) score += 1;
  if (checks.symbol || checks.longer) score += 1;

  const labels = ['Empty', 'Weak', 'Fair', 'Good', 'Strong'];
  const suggestions = [];
  if (!checks.length) suggestions.push('Use at least 8 characters');
  if (!checks.upper || !checks.lower) suggestions.push('Mix upper and lower case');
  if (!checks.digit) suggestions.push('Add a number');
  if (!checks.symbol && !checks.longer) suggestions.push('Add a symbol or make it 12+ chars');

  return { strength: score, label: labels[score], suggestions };
}

// Used by login/register screens to short-circuit before we hit Firebase.
export function validateAuthForm({ email, password, fullName, phone, mode = 'login' }) {
  const errors = {};
  if (!email) errors.email = 'Email is required.';
  else if (!isValidEmail(email)) errors.email = 'Please enter a valid email address.';

  if (!password) errors.password = 'Password is required.';
  else if (mode === 'signup' && password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  }

  if (mode === 'signup') {
    if (!fullName || fullName.trim().length < 2) errors.fullName = 'Please enter your full name.';
    if (!phone) errors.phone = 'Phone number is required.';
    else if (!isValidPhone(phone)) errors.phone = 'Please enter a valid phone number.';
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
}
