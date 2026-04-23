import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Bot,
  Building2,
  MessageSquareText,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "CQ Signal — Marketing intelligence for the AI era",
  description:
    "Connect every platform your business runs on, centralize the data into clean dashboards, and ship it to your AI stack in a format Claude, Gemini, and ChatGPT can actually use.",
};

const howItWorks = [
  {
    icon: Building2,
    title: "Add your businesses",
    body: "Drop in the name, vertical, and logo. Signal white-labels every generated report with the brand.",
  },
  {
    icon: Zap,
    title: "Connect your platforms",
    body: "GA4, Meta Ads, Facebook, Instagram, LinkedIn, TikTok, Omnisend, Klaviyo, Typeform, Shopify, booking, CRM. OAuth where it exists, API keys where it does not.",
  },
  {
    icon: MessageSquareText,
    title: "See and talk to your data",
    body: "Clean dashboards. Drill-in details on every metric. A chat analyst on every page who tells you what to do, not just what happened.",
  },
  {
    icon: Bot,
    title: "Ship to your own AI",
    body: "Every business exports as a Markdown brief with prompts included, or connect Claude Code and other agents directly via MCP.",
  },
];

const differentiators = [
  {
    title: "Designed around AI, not bolted onto it",
    body: "Every other tool started as a dashboard and later added an Ask AI feature. Signal was architected with AI as the primary consumption layer from commit one.",
  },
  {
    title: "Your data stays yours",
    body: "Markdown exports, REST API, MCP server, JSON. Feed Signal data into Claude, Gemini, ChatGPT, or your own agent. Nothing locked behind a platform wall.",
  },
  {
    title: "Prescriptive, not just descriptive",
    body: '"Sessions dropped 12%" is descriptive. Signal tells you which channel, what to do, and what you should expect to move if you do it.',
  },
  {
    title: "Built for business owners, not just agencies",
    body: "Works for one business or a hundred, a solo owner or a full agency. The product says business everywhere and treats single and multi-business use identically.",
  },
  {
    title: "White-label included",
    body: "Every generated report carries the business's logo, colors, and brand. Not gated behind a top tier. This should have been table stakes a long time ago.",
  },
  {
    title: "Honest about what it does not know",
    body: "Signal flags stale integrations, missing data, and questions outside what the numbers can answer. That honesty is what makes its recommendations trustworthy.",
  },
  {
    title: "A modern product, not a 2015 dashboard",
    body: "Fast, responsive, mobile-friendly, dark-mode native, built with typography and motion that feels intentional. Open it on any device and it looks like this decade, because it is.",
  },
];

export default function MarketingPage() {
  return (
    <div>
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/50 glass">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center" aria-label="CQ Signal">
            <Image
              src="/cq-signal-logo.png"
              alt="CQ Signal"
              width={200}
              height={170}
              className="block h-9 w-auto dark:hidden"
              priority
            />
            <Image
              src="/cq-signal-logo-dark.png"
              alt="CQ Signal"
              width={200}
              height={170}
              className="hidden h-9 w-auto dark:block"
              priority
            />
          </Link>
          <nav className="hidden items-center gap-8 text-sm md:flex">
            <a
              href="#how-it-works"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              How it works
            </a>
            <a
              href="#why-different"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Why different
            </a>
            <a
              href="#mission"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Mission
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="gap-1.5 bg-foreground text-background hover:bg-foreground/90"
            >
              <Link href="/sign-up">
                Get started
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative px-6 pt-20 pb-28 md:pt-28 md:pb-40">
        <div className="mx-auto max-w-5xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground backdrop-blur">
            <Sparkles className="size-3 text-brand" />
            <span>Marketing intelligence for the AI era</span>
          </div>
          <h1 className="mt-8 font-display text-5xl leading-[1.05] tracking-tight md:text-8xl">
            Your business data,
            <br />
            <span className="italic">finally</span> ready for AI.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            CQ Signal connects every platform your business runs on, centralizes the data into clean dashboards, and ships it to your AI stack in a format Claude, Gemini, and ChatGPT can actually use.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="gap-2 bg-foreground text-background hover:bg-foreground/90"
            >
              <Link href="/sign-up">
                Get started
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#how-it-works">See how it works</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="border-t border-border/50 px-6 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            The problem
          </p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl leading-[1.1] tracking-tight md:text-6xl">
            Every reporting tool stops at the dashboard.
          </h2>
          <div className="mt-12 grid gap-10 text-lg leading-relaxed text-muted-foreground md:grid-cols-2 md:gap-14 md:text-xl">
            <p>
              You look at the numbers. You close the tab. You move on. The tools that exist were designed before AI was part of anyone's workflow.
            </p>
            <p>
              Business owners already talk to Claude, Gemini, and ChatGPT about their businesses. To do that, they screenshot dashboards or type numbers into chats by hand. The insight layer and the AI layer live in separate worlds. That ends here.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="scroll-mt-20 border-t border-border/50 px-6 py-24 md:py-32"
      >
        <div className="mx-auto max-w-5xl">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            How it works
          </p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl leading-[1.1] tracking-tight md:text-6xl">
            Connect, analyze, ship to your AI.
          </h2>
          <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((step, i) => {
              const Icon = step.icon;
              return (
                <Card
                  key={step.title}
                  className="card-lift h-full hover:ring-2 hover:ring-brand/45"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Icon className="size-5 text-brand" />
                      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <CardTitle className="mt-2 font-display text-lg leading-tight">
                      {step.title}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {step.body}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why different */}
      <section
        id="why-different"
        className="scroll-mt-20 border-t border-border/50 px-6 py-24 md:py-32"
      >
        <div className="mx-auto max-w-5xl">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Why different
          </p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl leading-[1.1] tracking-tight md:text-6xl">
            Seven things you won't find anywhere else.
          </h2>
          <div className="mt-16 grid gap-4 md:grid-cols-2">
            {differentiators.map((d, i) => (
              <Card
                key={d.title}
                className="card-lift h-full hover:ring-2 hover:ring-brand/45"
              >
                <CardHeader>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <CardTitle className="font-display text-xl leading-tight">
                    {d.title}
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {d.body}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section
        id="mission"
        className="scroll-mt-20 relative overflow-hidden border-t border-border/50 px-6 py-24 md:py-32"
      >
        <div className="absolute inset-0 bg-mesh-brand opacity-80" aria-hidden />
        <div className="relative mx-auto max-w-4xl">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Our mission
          </p>
          <h2 className="mt-4 font-display text-4xl leading-[1.1] tracking-tight md:text-6xl">
            Built by an agency owner, for the rest of us.
          </h2>
          <div className="mt-10 space-y-6 text-lg leading-relaxed md:text-xl">
            <p>I built CQ Signal because I was frustrated.</p>
            <p>
              I run{" "}
              <a
                href="https://creativequalitymarketing.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline underline-offset-4 decoration-brand hover:decoration-2"
              >
                Creative Quality Marketing
              </a>
              . We manage marketing for real businesses: furniture dealers, electricians, med spas, auto body shops, aesthetic brands. Every week my team and I try to make sense of data spread across GA4, Meta, Omnisend, Typeform, Shopify, and a dozen other places.
            </p>
            <p>
              The tools that exist for this are fine at putting numbers on a page. None of them actually help you think. And none of them play nicely with the AI tools that have fundamentally changed how we work.
            </p>
            <p>So I built what I wanted.</p>
            <p className="mt-10 font-display text-2xl md:text-3xl">
              — Cesar Augustus
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-border/50 px-6 py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-4xl leading-[1.1] tracking-tight md:text-6xl">
            Ready to see your data the way you should have all along?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground md:text-xl">
            Sign up in under a minute. Connect your first business. See what Signal finds.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="gap-2 bg-foreground text-background hover:bg-foreground/90"
            >
              <Link href="/sign-up">
                Get started
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/sign-in">I have an account</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 px-6 py-12">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
          <div>
            CQ Signal · built by{" "}
            <a
              href="https://creativequalitymarketing.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Creative Quality Marketing
            </a>
          </div>
          <div className="flex flex-wrap gap-6">
            <a href="#how-it-works" className="transition-colors hover:text-foreground">
              How it works
            </a>
            <a href="#why-different" className="transition-colors hover:text-foreground">
              Why different
            </a>
            <a href="#mission" className="transition-colors hover:text-foreground">
              Mission
            </a>
            <Link href="/sign-in" className="transition-colors hover:text-foreground">
              Sign in
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
