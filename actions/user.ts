"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import type { OnboardingData, OnboardingStatus } from "@/lib/types";

// ============================================================
// getUserOnboardingStatus
// Checks if the current user exists in DB and has completed
// onboarding (i.e., has an industry set).
// ============================================================
export async function getUserOnboardingStatus(): Promise<OnboardingStatus> {
  const { userId } = await auth();

  if (!userId) {
    return { isOnboarded: false, user: null };
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      id: true,
      clerkUserId: true,
      email: true,
      name: true,
      imageUrl: true,
      industry: true,
      bio: true,
      experience: true,
      skills: true,
    },
  });

  if (!user) {
    return { isOnboarded: false, user: null };
  }

  const isOnboarded = Boolean(user.industry);
  return { isOnboarded, user };
}

// ============================================================
// updateUser
// Creates or updates the user record in a Prisma transaction.
// Called during onboarding and profile updates.
// ============================================================
export async function updateUser(data: OnboardingData): Promise<void> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized: No user session found.");
  }

  // Get the Clerk user details to sync email/name/image
  const { currentUser } = await import("@clerk/nextjs/server");
  const clerkUser = await currentUser();

  if (!clerkUser) {
    throw new Error("Unable to fetch user details from Clerk.");
  }

  const email =
    clerkUser.emailAddresses[0]?.emailAddress ?? "";
  const name =
    `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim();
  const imageUrl = clerkUser.imageUrl ?? "";

  // Use a Prisma transaction to ensure atomicity
  await db.$transaction(async (tx) => {
    // Upsert user — create if not exists, update if exists
    await tx.user.upsert({
      where: { clerkUserId: userId },
      create: {
        clerkUserId: userId,
        email,
        name,
        imageUrl,
        industry: data.industry,
        bio: data.bio,
        experience: data.experience,
        skills: data.skills,
      },
      update: {
        email,
        name,
        imageUrl,
        industry: data.industry,
        bio: data.bio,
        experience: data.experience,
        skills: data.skills,
      },
    });
  });
}

// ============================================================
// getCurrentUser
// Returns the full user record for the currently signed-in user.
// ============================================================
export async function getCurrentUser() {
  const { userId } = await auth();

  if (!userId) return null;

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  return user;
}

// ============================================================
// checkUser
// Called on app load to ensure user record exists in our DB.
// Creates the user if this is their first visit (after Clerk signup).
// ============================================================
export async function checkUser() {
  const { currentUser } = await import("@clerk/nextjs/server");
  const clerkUser = await currentUser();

  if (!clerkUser) return null;

  // Check if user already exists
  const existingUser = await db.user.findUnique({
    where: { clerkUserId: clerkUser.id },
  });

  if (existingUser) return existingUser;

  // Create a new user record
  const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";
  const name =
    `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim();
  const imageUrl = clerkUser.imageUrl ?? "";

  const newUser = await db.user.create({
    data: {
      clerkUserId: clerkUser.id,
      email,
      name,
      imageUrl,
    },
  });

  return newUser;
}