import { auth } from "@/auth";
import ProfileForm from "@/components/account/ProfileForm";
import { getProfile } from "@/lib/account";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return createMetadata({
    title: "My Profile",
    description: "Update your Jelly account profile, address, and contact details.",
    path: "/account/profile",
    locale,
  });
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/${locale}/login?callbackUrl=/${locale}/account/profile`);
  }

  const profile = await getProfile(session.user.id);

  return (
    <div className="min-h-screen">
      <div className="bg-surface-container-high border-b border-outline-variant">
        <div className="max-w-container-max mx-auto px-margin-desktop py-12">
          <Link
            href={`/${locale}/account`}
            className="text-sm font-semibold text-primary hover:underline"
          >
            Back to account
          </Link>
          <h1 className="font-display-lg text-display-lg text-on-surface mt-4 mb-2">
            Profile
          </h1>
          <p className="text-on-surface-variant">
            Keep your delivery details up to date.
          </p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-margin-mobile py-12">
        <ProfileForm profile={profile} />
      </div>
    </div>
  );
}
