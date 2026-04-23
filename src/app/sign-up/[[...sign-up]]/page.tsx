import Image from "next/image";
import { SignUp } from "@clerk/nextjs";

export const metadata = {
  title: "Sign up",
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-10 px-4 py-12">
      <div className="flex flex-col items-center gap-3 text-center">
        <Image
          src="/cq-signal-logo.png"
          alt="CQ Signal"
          width={200}
          height={170}
          className="block h-12 w-auto max-w-[200px] object-contain dark:hidden"
          priority
        />
        <Image
          src="/cq-signal-logo-dark.png"
          alt="CQ Signal"
          width={200}
          height={170}
          className="hidden h-12 w-auto max-w-[200px] object-contain dark:block"
          priority
        />
        <p className="max-w-sm font-display text-lg text-muted-foreground">
          Create an account to start tracking your businesses.
        </p>
      </div>
      <SignUp
        path="/sign-up"
        appearance={{
          elements: {
            rootBox: "w-full max-w-md",
            card: "bg-card shadow-none border border-border",
            headerTitle: "font-display text-2xl",
            formButtonPrimary:
              "bg-foreground text-background hover:bg-foreground/90 text-sm normal-case",
            footerActionLink: "text-brand hover:text-brand/80",
          },
        }}
      />
    </div>
  );
}
