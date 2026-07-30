import Link from 'next/link';

import {
  ArrowRight,
  BadgeCheck,
  CreditCard,
  ShieldCheck,
  Star,
  Users,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

const TRUST_FEATURES = [
  {
    icon: ShieldCheck,
    title: 'Safe & secure rentals',
    description:
      'Rent with confidence through a structured rental process designed to protect both customers and providers.',
  },
  {
    icon: Users,
    title: 'Trusted providers',
    description:
      'Discover gear from providers who are part of the GearUp rental ecosystem.',
  },
  {
    icon: CreditCard,
    title: 'Secure payments',
    description:
      'Complete your rental payments through trusted payment gateways with a clear and reliable checkout experience.',
  },
  {
    icon: Star,
    title: 'Real customer reviews',
    description:
      'See genuine ratings and reviews from customers who have actually rented and used the gear.',
  },
];

export function WhyGearUpSection() {
  return (
    <section className="relative overflow-hidden border-t py-20 sm:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -left-40 top-20 size-96 rounded-full bg-blue-500/[0.04] blur-3xl dark:bg-blue-500/[0.08]" />
        <div className="absolute -right-40 bottom-0 size-96 rounded-full bg-cyan-400/[0.04] blur-3xl dark:bg-cyan-400/[0.06]" />
        <div className="absolute left-1/2 top-1/2 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.02] blur-[120px] dark:bg-primary/[0.04]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Why GearUp
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Rent with confidence.
              <span className="mt-1 block text-primary">
                Use what you need.
              </span>
            </h2>

            <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
              GearUp makes it easier to access the equipment
              you need without the cost and commitment of
              buying everything yourself.
            </p>

            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Whether you are creating content, organizing an
              event, working on a project, or planning an
              adventure, find the right gear from providers
              through one simple platform.
            </p>

            <div className="mt-8">
              <Button
                asChild
                variant="outline"
                className="
                  group/cta cursor-pointer rounded-full px-6 transition-all duration-300
                  hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_10px_30px_rgba(37,99,235,0.12)]
                "
              >
                {/* Was /explore */}
                <Link href="/gear">
                  Explore trusted gear
                  <ArrowRight className="ml-2 size-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {TRUST_FEATURES.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="
                    group/card relative h-full overflow-hidden rounded-3xl
                    border border-border/60 bg-background/75 p-6 shadow-sm
                    backdrop-blur-2xl transition-all duration-500 ease-out
                    hover:-translate-y-2 hover:border-blue-500/30 hover:bg-background/90
                    hover:shadow-[0_25px_70px_rgba(37,99,235,0.12)]
                    dark:border-white/[0.06] dark:bg-[#0B1220]/70
                    dark:hover:border-blue-500/30 dark:hover:bg-[#0E1628]
                    dark:hover:shadow-[0_20px_60px_rgba(37,99,235,0.18)]
                  "
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-blue-500/10 blur-[100px] opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-20 -left-20 size-48 rounded-full bg-cyan-400/10 blur-[90px] opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
                  />

                  <div
                    className="
                      relative z-10 flex size-12 items-center justify-center rounded-2xl
                      border border-border/60 bg-primary/10 text-primary shadow-sm
                      transition-all duration-500 ease-out group-hover/card:scale-110
                      group-hover/card:border-primary/40 group-hover/card:bg-primary
                      group-hover/card:text-primary-foreground
                      group-hover/card:shadow-[0_10px_30px_rgba(37,99,235,0.25)]
                      dark:border-white/[0.08] dark:bg-blue-500/10
                      dark:group-hover/card:border-blue-400/30
                    "
                  >
                    <Icon className="size-5 transition-transform duration-500 group-hover/card:scale-110" />
                  </div>

                  <div className="relative z-10">
                    <h3 className="mt-5 text-lg font-semibold tracking-tight transition-colors duration-300 group-hover/card:text-primary">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground transition-colors duration-300 group-hover/card:text-foreground/70">
                      {feature.description}
                    </p>
                  </div>

                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-0 left-6 right-6 h-px origin-left scale-x-0 bg-gradient-to-r from-primary via-blue-400 to-transparent transition-transform duration-500 group-hover/card:scale-x-100"
                  />
                </article>
              );
            })}
          </div>
        </div>

        <div
          className="
            group/banner relative mt-14 overflow-hidden rounded-3xl border
            border-border/60 bg-muted/30 p-6 shadow-sm backdrop-blur-xl
            transition-all duration-500 hover:border-primary/20
            hover:shadow-[0_20px_60px_rgba(37,99,235,0.08)]
            dark:border-white/[0.06] dark:bg-[#0B1220]/50
            dark:hover:border-blue-500/20 dark:hover:shadow-[0_20px_60px_rgba(37,99,235,0.12)]
            sm:p-8
          "
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-primary/5 blur-3xl opacity-0 transition-opacity duration-500 group-hover/banner:opacity-100"
          />

          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div
                className="
                  flex size-11 shrink-0 items-center justify-center rounded-xl
                  border border-primary/10 bg-primary/10 text-primary
                  transition-all duration-300 group-hover/banner:scale-105
                  group-hover/banner:border-primary/20
                "
              >
                <BadgeCheck className="size-5" />
              </div>

              <div>
                <h3 className="font-semibold tracking-tight">
                  Find gear that fits your needs.
                </h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Compare options, check availability, and
                  choose the right equipment for your rental
                  period.
                </p>
              </div>
            </div>

            <Button
              asChild
              className="
                group/banner-button w-full cursor-pointer rounded-full
                transition-all duration-300 hover:-translate-y-0.5
                hover:shadow-[0_10px_30px_rgba(37,99,235,0.22)] md:w-auto
              "
            >
              {/* Was /explore */}
              <Link href="/gear">
                Browse available gear
                <ArrowRight className="ml-2 size-4 transition-transform duration-300 group-hover/banner-button:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}