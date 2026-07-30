import { cn } from '@/lib/utils';
import * as React from 'react';

function Card({
  className,
  size = 'default',
  children,
  ...props
}: React.ComponentProps<'div'> & {
  size?: 'default' | 'sm';
}) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        `
        group/card
        relative
        isolate

        flex
        flex-col
        gap-(--card-spacing)

        overflow-hidden

        rounded-3xl

        border
        border-slate-200/80

        bg-white/80

        py-(--card-spacing)

        text-sm
        text-slate-900

        shadow-[0_8px_30px_rgba(15,23,42,0.06)]

        ring-1
        ring-slate-900/[0.04]

        backdrop-blur-xl

        transition-[transform,box-shadow,border-color,background-color]
        duration-500
        ease-out

        [--card-spacing:--spacing(8)]

        data-[size=sm]:[--card-spacing:--spacing(5)]

        /* ========================================
           LIGHT MODE HOVER
        ======================================== */

        hover:-translate-y-1.5

        hover:border-blue-300/80

        hover:bg-white/95

        hover:shadow-[0_24px_70px_rgba(37,99,235,0.13)]

        hover:ring-blue-500/[0.08]

        /* ========================================
           DARK MODE
        ======================================== */

        dark:border-white/[0.07]

        dark:bg-[#0B1220]/85

        dark:text-white

        dark:shadow-[0_8px_30px_rgba(0,0,0,0.20)]

        dark:ring-white/[0.04]

        dark:hover:border-blue-400/30

        dark:hover:bg-[#0D1728]/95

        dark:hover:shadow-[0_24px_70px_rgba(37,99,235,0.18)]

        dark:hover:ring-blue-400/[0.08]

        /* ========================================
           IMAGE HANDLING
        ======================================== */

        has-[>img:first-child]:pt-0

        *:[img:first-child]:rounded-none
        *:[img:last-child]:rounded-none
        `,
        className,
      )}
      {...props}
    >
      {/* ========================================
          AMBIENT BACKGROUND GLOW
      ======================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          z-0

          opacity-0

          transition-opacity
          duration-500
          ease-out

          group-hover/card:opacity-100
        "
      >
        {/* Top Right Glow */}

        <div
          className="
            absolute
            -right-24
            -top-24

            size-72

            rounded-full

            bg-blue-500/[0.08]

            blur-[100px]

            transition-transform
            duration-700
            ease-out

            group-hover/card:scale-125

            dark:bg-blue-500/[0.12]
          "
        />

        {/* Bottom Left Glow */}

        <div
          className="
            absolute
            -bottom-24
            -left-24

            size-64

            rounded-full

            bg-cyan-400/[0.07]

            blur-[100px]

            transition-transform
            duration-700
            ease-out

            group-hover/card:scale-125

            dark:bg-cyan-400/[0.08]
          "
        />
      </div>

      {/* ========================================
          PREMIUM INNER BORDER
      ======================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none

          absolute
          inset-0
          z-0

          rounded-3xl

          border
          border-transparent

          opacity-0

          transition-opacity
          duration-500

          group-hover/card:opacity-100

          group-hover/card:border-blue-400/20

          dark:group-hover/card:border-blue-400/15
        "
      />

      {/* ========================================
          SUBTLE GRADIENT OVERLAY
      ======================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none

          absolute
          inset-0
          z-0

          bg-gradient-to-br
          from-blue-500/[0.03]
          via-transparent
          to-cyan-400/[0.03]

          opacity-0

          transition-opacity
          duration-500

          group-hover/card:opacity-100

          dark:from-blue-500/[0.04]
          dark:to-cyan-400/[0.04]
        "
      />

      {/* ========================================
          SHINE EFFECT
      ======================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none

          absolute
          -left-[120%]
          top-0

          z-20

          h-full
          w-1/2

          rotate-12

          bg-gradient-to-r
          from-transparent
          via-white/[0.18]
          to-transparent

          opacity-0

          transition-all
          duration-1000
          ease-out

          group-hover/card:left-[130%]
          group-hover/card:opacity-100

          dark:via-white/[0.05]
        "
      />

      {/* ========================================
          CARD CONTENT
      ======================================== */}

      <div className="relative z-10 flex flex-1 flex-col">
        {children}
      </div>
    </div>
  );
}

function CardHeader({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        `
        group/card-header

        @container/card-header

        grid

        auto-rows-min

        items-start

        gap-1.5

        rounded-none

        px-(--card-spacing)

        has-data-[slot=card-action]:grid-cols-[1fr_auto]

        has-data-[slot=card-description]:grid-rows-[auto_auto]

        [.border-b]:pb-(--card-spacing)
        `,
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        `
        font-heading

        text-lg
        font-semibold

        tracking-tight

        text-slate-900

        transition-colors
        duration-300

        group-hover/card:text-blue-600

        dark:text-white

        dark:group-hover/card:text-blue-400
        `,
        className,
      )}
      {...props}
    />
  );
}

function CardDescription({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        `
        text-sm
        leading-relaxed

        text-slate-600

        transition-colors
        duration-300

        group-hover/card:text-slate-700

        dark:text-slate-400

        dark:group-hover/card:text-slate-300
        `,
        className,
      )}
      {...props}
    />
  );
}

function CardAction({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        `
        col-start-2

        row-span-2

        row-start-1

        self-start

        justify-self-end
        `,
        className,
      )}
      {...props}
    />
  );
}

function CardContent({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        `
        px-(--card-spacing)
        `,
        className,
      )}
      {...props}
    />
  );
}

function CardFooter({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        `
        flex
        items-center

        px-(--card-spacing)

        [.border-t]:pt-(--card-spacing)
        `,
        className,
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};