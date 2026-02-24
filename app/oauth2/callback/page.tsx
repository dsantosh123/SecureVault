"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get("id");
    const email = searchParams.get("email");
    const fullName = searchParams.get("fullName");
    const picture = searchParams.get("picture");

    // Only proceed if we have at least the user ID or email
    if (id || email) {
      const user = {
        id,
        email,
        fullName,
        picture,
      };

      // Save user data for the rest of the app to use
      localStorage.setItem("user", JSON.stringify(user));

      // Send the user to the dashboard
      router.replace("/dashboard");
    }
  }, [searchParams, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-xl font-semibold">Completing login...</h2>
      <p className="text-gray-500">Please wait while we redirect you.</p>
    </div>
  );
}

export default function OAuth2Callback() {
  return (
    // Next.js requires Suspense when using useSearchParams in the App Router
    <Suspense fallback={<div>Loading...</div>}>
      <CallbackContent />
    </Suspense>
  );
}