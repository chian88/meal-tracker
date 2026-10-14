import { SignIn } from "@clerk/nextjs";
import { Suspense } from "react";

export default function SignInPage() {
  return (
    <div className="flex flex-1 items-center justify-center py-16">
      {/* <SignIn> reads the URL via usePathname(), so it must render inside <Suspense> (cacheComponents). */}
      <Suspense>
        <SignIn />
      </Suspense>
    </div>
  );
}
