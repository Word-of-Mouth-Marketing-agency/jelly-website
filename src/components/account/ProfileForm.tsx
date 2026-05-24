"use client";

import { useState, useTransition } from "react";

type Profile = {
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  postalCode: string | null;
};

type Props = {
  profile: Profile;
};

export default function ProfileForm({ profile }: Props) {
  const [form, setForm] = useState({
    firstName: profile.firstName ?? "",
    lastName: profile.lastName ?? "",
    phone: profile.phone ?? "",
    address: profile.address ?? "",
    city: profile.city ?? "",
    postalCode: profile.postalCode ?? "",
  });
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    startTransition(async () => {
      const response = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setMessage(response.ok ? "Profile saved." : "Please check your details.");
    });
  }

  return (
    <form onSubmit={submit} className="bg-white rounded-2xl sticker-border p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          ["firstName", "First name"],
          ["lastName", "Last name"],
          ["phone", "Phone"],
          ["city", "City"],
          ["postalCode", "Postal code"],
        ].map(([key, label]) => (
          <label key={key}>
            <span className="block text-sm font-semibold text-on-surface-variant mb-2">
              {label}
            </span>
            <input
              value={form[key as keyof typeof form]}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  [key]: event.target.value,
                }))
              }
              className="w-full rounded-lg border-2 border-outline-variant px-4 py-2.5 focus:border-primary focus:outline-none"
            />
          </label>
        ))}
        <label className="md:col-span-2">
          <span className="block text-sm font-semibold text-on-surface-variant mb-2">
            Address
          </span>
          <textarea
            value={form.address}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                address: event.target.value,
              }))
            }
            className="min-h-28 w-full rounded-lg border-2 border-outline-variant px-4 py-2.5 focus:border-primary focus:outline-none"
          />
        </label>
      </div>
      <button
        disabled={isPending}
        className="mt-6 bg-primary-container text-on-primary-container px-8 py-3 rounded-full font-label-lg text-label-lg sticker-border disabled:opacity-60"
      >
        {isPending ? "Saving..." : "Save profile"}
      </button>
      {message && <p className="mt-4 text-sm text-on-surface-variant">{message}</p>}
    </form>
  );
}
