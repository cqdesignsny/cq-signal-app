import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Protect the app shell and API routes. The marketing landing at "/" and the
// sign-in / sign-up pages stay public.
const isProtectedRoute = createRouteMatcher([
  "/app(.*)",
  "/api/businesses(.*)",
  "/api/chat(.*)",
  "/api/test(.*)",
  "/api/reports(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
