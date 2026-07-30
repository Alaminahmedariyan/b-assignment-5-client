import Link from 'next/link';

import {
  ArrowRight,
  CalendarDays,
  Search,
  ShoppingBag,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

const STEPS = [
  {
    number: '01',
    title: 'Browse gear',
    description:
      'Explore cameras, electronics, outdoor equipment, and other gear available from trusted providers.',
    icon: Search,
  },
  {
    number: '02',
    title: 'Choose your dates',
    description:
      'Select the dates you need the gear and check availability before placing your rental request.',
    icon: CalendarDays,
  },
  {
    number: '03',
    title: 'Rent & pickup',
    description:
      'Complete your payment and collect your rented gear from the provider at the scheduled time.',
    icon: ShoppingBag,
  },
  {
    number: '04',
    title: 'Return safely',
    description:
      'Use the gear during your rental period and return it on time in the same condition.',
    icon: ArrowRight,
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden border-t py-20 sm:py-24"
    >
      {/* ============================================================ */}
      {/* Background                                                    */}
      {/* ============================================================ */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        {/* Main Glow */}

        <div
          className="
            absolute
            left-1/2
            top-0

            size-[500px]

            -translate-x-1/2

            rounded-full

            bg-primary/5

            blur-3xl

            dark:bg-primary/10
          "
        />

        {/* Left Glow */}

        <div
          className="
            absolute
            -left-40
            top-1/2

            size-80

            -translate-y-1/2

            rounded-full

            bg-blue-500/[0.03]

            blur-[100px]

            dark:bg-blue-500/[0.06]
          "
        />

        {/* Right Glow */}

        <div
          className="
            absolute
            -right-40
            top-1/2

            size-80

            -translate-y-1/2

            rounded-full

            bg-cyan-400/[0.03]

            blur-[100px]

            dark:bg-cyan-400/[0.05]
          "
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ============================================================ */}
        {/* Section Header                                                */}
        {/* ============================================================ */}

        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            How GearUp works
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Rent the gear you need, simply.
          </h2>

          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Find the right equipment, choose your dates, and
            rent from trusted providers without the hassle of
            buying everything yourself.
          </p>
        </div>

        {/* ============================================================ */}
        {/* Steps                                                         */}
        {/* ============================================================ */}

        <div className="relative mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {/* ======================================================== */}
          {/* Connecting Line                                          */}
          {/* ======================================================== */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none

              absolute

              left-[12.5%]
              right-[12.5%]
              top-12

              hidden

              h-px

              bg-gradient-to-r
              from-transparent
              via-border
              to-transparent

              lg:block
            "
          />

          {/* ======================================================== */}
          {/* Step Cards                                                */}
          {/* ======================================================== */}

          {STEPS.map((step) => {
            const Icon = step.icon;

            return (
              <article
                key={step.number}
                className="
                  group/card

                  relative

                  h-full

                  overflow-hidden

                  rounded-3xl

                  border
                  border-border/60

                  bg-background/75

                  p-6

                  shadow-sm

                  backdrop-blur-2xl

                  transition-all
                  duration-500
                  ease-out

                  hover:-translate-y-2

                  hover:border-blue-500/30

                  hover:bg-background/90

                  hover:shadow-[0_25px_70px_rgba(37,99,235,0.12)]

                  dark:border-white/[0.06]

                  dark:bg-[#0B1220]/70

                  dark:hover:border-blue-500/30

                  dark:hover:bg-[#0E1628]

                  dark:hover:shadow-[0_20px_60px_rgba(37,99,235,0.18)]
                "
              >
                {/* ================================================== */}
                {/* Background Glow                                    */}
                {/* ================================================== */}

                <div
                  aria-hidden="true"
                  className="
                    pointer-events-none

                    absolute

                    -right-20
                    -top-20

                    size-56

                    rounded-full

                    bg-blue-500/10

                    blur-[100px]

                    opacity-0

                    transition-opacity
                    duration-500

                    group-hover/card:opacity-100
                  "
                />

                <div
                  aria-hidden="true"
                  className="
                    pointer-events-none

                    absolute

                    -bottom-20
                    -left-20

                    size-48

                    rounded-full

                    bg-cyan-400/10

                    blur-[90px]

                    opacity-0

                    transition-opacity
                    duration-500

                    group-hover/card:opacity-100
                  "
                />

                {/* ================================================== */}
                {/* Top Content                                        */}
                {/* ================================================== */}

                <div className="relative z-10 flex items-center justify-between">
                  {/* ================================================= */}
                  {/* Icon                                               */}
                  {/* ================================================= */}

                  <div
                    className="
                      relative

                      flex
                      size-12
                      items-center
                      justify-center

                      rounded-2xl

                      border
                      border-border/60

                      bg-background

                      text-primary

                      shadow-sm

                      transition-all
                      duration-500
                      ease-out

                      group-hover/card:scale-110

                      group-hover/card:border-blue-400/40

                      group-hover/card:bg-primary

                      group-hover/card:text-primary-foreground

                      group-hover/card:shadow-[0_10px_30px_rgba(37,99,235,0.25)]

                      dark:border-white/[0.08]

                      dark:bg-[#111827]

                      dark:group-hover/card:border-blue-400/30
                    "
                  >
                    <Icon
                      className="
                        size-5

                        transition-transform
                        duration-500

                        group-hover/card:scale-110
                      "
                    />
                  </div>

                  {/* ================================================= */}
                  {/* Number                                             */}
                  {/* ================================================= */}

                  <span
                    className="
                      text-sm
                      font-bold
                      tracking-wider

                      text-muted-foreground/30

                      transition-colors
                      duration-300

                      group-hover/card:text-primary/50
                    "
                  >
                    {step.number}
                  </span>
                </div>

                {/* ================================================== */}
                {/* Content                                             */}
                {/* ================================================== */}

                <div className="relative z-10">
                  <h3
                    className="
                      mt-7

                      text-lg
                      font-semibold
                      tracking-tight

                      transition-colors
                      duration-300

                      group-hover/card:text-primary

                      sm:text-xl
                    "
                  >
                    {step.title}
                  </h3>

                  <p
                    className="
                      mt-3

                      text-sm
                      leading-6

                      text-muted-foreground

                      transition-colors
                      duration-300

                      group-hover/card:text-foreground/70
                    "
                  >
                    {step.description}
                  </p>
                </div>

                {/* ================================================== */}
                {/* Bottom Accent                                      */}
                {/* ================================================== */}

                <div
                  aria-hidden="true"
                  className="
                    pointer-events-none

                    absolute

                    bottom-0
                    left-6
                    right-6

                    h-px

                    origin-left

                    scale-x-0

                    bg-gradient-to-r
                    from-primary
                    via-blue-400
                    to-transparent

                    transition-transform
                    duration-500

                    group-hover/card:scale-x-100
                  "
                />
              </article>
            );
          })}
        </div>

        {/* ============================================================ */}
        {/* CTA                                                           */}
        {/* ============================================================ */}

        <div className="mt-12 flex justify-center">
          <Button
            asChild
            className="
              group/button

              cursor-pointer
              rounded-full
              px-6

              shadow-sm

              transition-all
              duration-300

              hover:-translate-y-0.5

              hover:shadow-[0_10px_30px_rgba(37,99,235,0.25)]
            "
          >
            <Link href="/gear">
              Start exploring gear

              <ArrowRight
                className="
                  ml-2
                  size-4

                  transition-transform
                  duration-300

                  group-hover/button:translate-x-1
                "
              />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}