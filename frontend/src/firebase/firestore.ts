import {
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import { db } from "./config";

import type { AppUser } from "../types/firestore";

const requireDb = () => {
  if (!db) {
    throw new Error(
      "Firestore is not initialized. Check Firebase config."
    );
  }

  return db;
};

const usersCollection = "users";
const organizationsCollection = "organizations";

export interface Organization {
  id: string;
  name: string;
  ownerId: string;
  plan: "free" | "basic" | "premium";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getUserProfile = async (
  uid: string
): Promise<AppUser | null> => {
  const firestore = requireDb();

  const userRef = doc(firestore, usersCollection, uid);

  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    return null;
  }
   return {
    uid: snapshot.id,
    ...(snapshot.data() as Omit<AppUser, "uid">),
  };
};

export const subscribeToUserProfile = (
  uid: string,
  callback: (profile: AppUser | null) => void
) => {
  const firestore = requireDb();

  const userRef = doc(firestore, usersCollection, uid);

  return onSnapshot(userRef, (snapshot) => {
    callback(
      snapshot.exists()
        ? {
            uid: snapshot.id,
            ...(snapshot.data() as Omit<AppUser, "uid">),
          }
        : null
    );
  });
};
export const createOrUpdateUserProfile = async (
  profile: AppUser
): Promise<void> => {
  const firestore = requireDb();

  const userRef = doc(firestore, usersCollection, profile.uid);

  await setDoc(userRef, profile, {
    merge: true,
  });
};

export const createOrganization = async (
  orgData: Omit<Organization, "id" | "createdAt" | "updatedAt">
): Promise<string> => {
  const firestore = requireDb();

  const orgRef = doc(
    collection(firestore, organizationsCollection)
  );
   const now = new Date().toISOString();

  const organization: Organization = {
    ...orgData,
    id: orgRef.id,
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(orgRef, organization);

  return orgRef.id;
};

export const getOrganization = async (
  orgId: string
): Promise<Organization | null> => {
  const firestore = requireDb();

  const orgRef = doc(
    firestore,
    organizationsCollection,
    orgId
  );
   const snapshot = await getDoc(orgRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...(snapshot.data() as Omit<Organization, "id">),
  };
};

export const getUsersByOrganization = async (
  organizationId: string
): Promise<AppUser[]> => {
  const firestore = requireDb();

  const q = query(
    collection(firestore, usersCollection),
    where("organizationId", "==", organizationId)
  );
   const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    uid: doc.id,
    ...(doc.data() as Omit<AppUser, "uid">),
  }));
};

export const getAllOrganizations = async (): Promise<Organization[]> => {
  const firestore = requireDb();

  const snapshot = await getDocs(
    collection(firestore, organizationsCollection)
  );

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Organization, "id">),
  }));
};