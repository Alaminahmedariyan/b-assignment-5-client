import Link from 'next/link';

import {
  ArrowRight,
  Building2,
  Package,
  Sparkles,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function HomeCTASection() {
  return (
    <section className="relative overflow-hidden border-t py-20 sm:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-1/2 size-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl dark:bg-primary/15" />
        <div className="absolute -left-40 top-0 size-80 rounded-full bg-blue-500/[0.04] blur-[100px] dark:bg-blue-500/[0.08]" />
        <div className="absolute -right-40 bottom-0 size-80 rounded-full bg-cyan-400/[0.04] blur-[100px] dark:bg-cyan-400/[0.06]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="
            relative overflow-hidden rounded-[2rem] border border-border/60
            bg-muted/30 px-6 py-14 shadow-sm backdrop-blur-xl sm:px-12 sm:py-20
            transition-all duration-500
            hover:border-primary/20 hover:shadow-[0_25px_80px_rgba(37,99,235,0.08)]
            dark:hover:border-primary/20 dark:hover:shadow-[0_25px_80px_rgba(37,99,235,0.12)]
          "
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-24 -top-24 size-64 rounded-full bg-primary/10 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -right-24 size-64 rounded-full bg-primary/10 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-70"
          />

          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <div
              className="
                inline-flex items-center gap-2 rounded-full border border-border/60
                bg-background/70 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur
                transition-all duration-300 hover:border-primary/30 hover:bg-primary/5
              "
            >
              <Sparkles className="size-4 text-primary" />
              <span>Gear up for your next project</span>
            </div>

            <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              The gear you need is closer than you think.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Whether you need equipment for a day, a week,
              or a special project, GearUp helps you find
              what you need without the cost of buying it.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="
                  w-full cursor-pointer rounded-full px-7 shadow-sm
                  transition-all duration-300 hover:-translate-y-0.5
                  hover:shadow-[0_10px_30px_rgba(37,99,235,0.25)] sm:w-auto
                "
              >
                {/* Was /explore — that route never existed; the real
                    listing page is /gear. */}
                <Link href="/gear">
                  Browse gear
                  <ArrowRight className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="
                  w-full cursor-pointer rounded-full px-7 transition-all duration-300
                  hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/5 sm:w-auto
                "
              >
                {/* Was /provider/register — no such page exists; providers
                    sign up through the normal register flow with the
                    "List my gear" role toggle preselected. */}
                <Link href="/register?as=provider">Become a provider</Link>
              </Button>
            </div>
          </div>

          <div className="relative z-10 mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-2">
            <Link href="/gear" className="group/card block h-full">
              <Card
                className="
                  h-full rounded-2xl p-5 border-border/60 bg-background/70
                  backdrop-blur-xl transition-all duration-500 ease-out
                  hover:-translate-y-2 hover:border-blue-500/30 hover:bg-background/90
                  hover:shadow-[0_20px_60px_rgba(37,99,235,0.12)]
                  dark:border-white/[0.06] dark:bg-[#0B1220]/70
                  dark:hover:border-blue-500/30 dark:hover:bg-[#0E1628]
                  dark:hover:shadow-[0_20px_60px_rgba(37,99,235,0.18)] sm:p-6
                "
              >
                <div className="relative z-10 flex h-full items-center gap-5">
                  <div
                    className="
                      flex size-12 shrink-0 items-center justify-center rounded-xl
                      border border-primary/10 bg-primary/10 text-primary
                      transition-all duration-300 group-hover/card:scale-110
                      group-hover/card:border-blue-400/30 group-hover/card:bg-primary
                      group-hover/card:text-primary-foreground
                      group-hover/card:shadow-[0_8px_25px_rgba(37,99,235,0.25)]
                    "
                  >
                    <Package className="size-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold tracking-tight transition-colors duration-300 group-hover/card:text-primary">
                      Need gear?
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Find and rent the equipment you need
                      for your next project.
                    </p>
                  </div>

                  <ArrowRight className="size-5 shrink-0 text-muted-foreground transition-all duration-300 group-hover/card:translate-x-1 group-hover/card:text-primary" />
                </div>

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-blue-500/10 blur-[70px] opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
                />
              </Card>
            </Link>

            <Link href="/register?as=provider" className="group/card block h-full">
              <Card
                className="
                  h-full rounded-2xl p-5 border-border/60 bg-background/70
                  backdrop-blur-xl transition-all duration-500 ease-out
                  hover:-translate-y-2 hover:border-blue-500/30 hover:bg-background/90
                  hover:shadow-[0_20px_60px_rgba(37,99,235,0.12)]
                  dark:border-white/[0.06] dark:bg-[#0B1220]/70
                  dark:hover:border-blue-500/30 dark:hover:bg-[#0E1628]
                  dark:hover:shadow-[0_20px_60px_rgba(37,99,235,0.18)] sm:p-6
                "
              >
                <div className="relative z-10 flex h-full items-center gap-5">
                  <div
                    className="
                      flex size-12 shrink-0 items-center justify-center rounded-xl
                      border border-primary/10 bg-primary/10 text-primary
                      transition-all duration-300 group-hover/card:scale-110
                      group-hover/card:border-blue-400/30 group-hover/card:bg-primary
                      group-hover/card:text-primary-foreground
                      group-hover/card:shadow-[0_8px_25px_rgba(37,99,235,0.25)]
                    "
                  >
                    <Building2 className="size-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold tracking-tight transition-colors duration-300 group-hover/card:text-primary">
                      Have gear to rent?
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      List your equipment and start reaching
                      customers who need it.
                    </p>
                  </div>

                  <ArrowRight className="size-5 shrink-0 text-muted-foreground transition-all duration-300 group-hover/card:translate-x-1 group-hover/card:text-primary" />
                </div>

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-blue-500/10 blur-[70px] opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
                />
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}