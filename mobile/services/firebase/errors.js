// Maps the most common Firebase Auth error codes to human-readable messages.
// Anything not in the table falls back to the raw message — never raw codes.

const MAP = {
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/user-not-found': 'No account found with this email.',
  'auth/wrong-password': 'Incorrect email or password.',
  'auth/invalid-credential': 'Incorrect email or password.',
  'auth/invalid-login-credentials': 'Incorrect email or password.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/weak-password': 'Password must be at least 8 characters.',
  'auth/missing-password': 'Please enter your password.',
  'auth/user-disabled': 'This account has been disabled. Contact support.',
  'auth/too-many-requests': 'Too many attempts. Try again in a few minutes.',
  'auth/network-request-failed': 'Network error. Check your connection and try again.',
  'auth/operation-not-allowed': 'This sign-in method is not enabled.',
  'auth/requires-recent-login': 'Please sign in again to continue.',
  'auth/popup-closed-by-user': 'Sign-in cancelled.',
  'auth/account-exists-with-different-credential':
    'An account already exists with the same email but different sign-in method.',
};

export function mapFirebaseError(code) {
  if (!code) return null;
  return MAP[code] || null;
}
