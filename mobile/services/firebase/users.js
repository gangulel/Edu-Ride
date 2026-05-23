// Firestore "users" collection — one document per Firebase Auth user, keyed
// by uid. Holds the small, frequently-read profile fields the UI needs
// without a server round-trip. Mongo remains the canonical store for the
// richer relational data (bookings, subscriptions, payments, etc.).
//
// Document shape:
//   {
//     uid: string,
//     email: string,
//     fullName: string,
//     phone: string | null,
//     role: 'parent' | 'driver' | 'admin',
//     photoURL: string | null,
//     provider: 'password' | 'google.com' | 'apple.com',
//     createdAt: serverTimestamp,
//     updatedAt: serverTimestamp,
//   }
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';

import { db } from '../../app/config/firebase';

const COLLECTION = 'users';

export async function getUserProfile(uid) {
  if (!uid) return null;
  const ref = doc(db, COLLECTION, uid);
  const snap = await getDoc(ref);
  return snap.exists() ? { uid, ...snap.data() } : null;
}

// Insert or update — used right after signUp / first social sign-in.
export async function upsertUserProfile(uid, fields) {
  const ref = doc(db, COLLECTION, uid);
  const existing = await getDoc(ref);

  const base = {
    uid,
    ...fields,
    updatedAt: serverTimestamp(),
  };

  if (existing.exists()) {
    await updateDoc(ref, base);
  } else {
    await setDoc(ref, { ...base, createdAt: serverTimestamp() });
  }
}

export async function updateUserProfile(uid, fields) {
  const ref = doc(db, COLLECTION, uid);
  await updateDoc(ref, { ...fields, updatedAt: serverTimestamp() });
}
