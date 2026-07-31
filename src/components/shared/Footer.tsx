import Link from 'next/link';
import {
  CreditCard,
  Mail,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Truck,
} from 'lucide-react';

const TRUST_BADGES = [
  {
    icon: ShieldCheck,
    title: 'Verified providers',
    description: 'Every listing comes from a real, checked provider',
  },
  {
    icon: CreditCard,
    title: 'Secure payments',
    description: 'Processed safely through Stripe',
  },
  {
    icon: Truck,
    title: 'Flexible pickup',
    description: 'Coordinate pickup directly with your provider',
  },
  {
    icon: MessageCircle,
    title: '7-day support',
    description: "We're here if anything goes wrong",
  },
];

const QUICK_LINKS = [
  { label: 'Browse gear', href: '/gear' },
  { label: 'Categories', href: '/#categories' },
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'Become a provider', href: '/register?as=provider' },
];

const ACCOUNT_LINKS = [
  { label: 'Sign in', href: '/login' },
  { label: 'Create account', href: '/register' },
  { label: 'My profile', href: '/profile' },
  { label: 'My rentals', href: '/dashboard/rentals' },
];

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card/40">
      {/* ================================================================ */}
      {/* Trust badges strip                                                */}
      {/* ================================================================ */}

      <div className="border-b border-border/60">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 md:grid-cols-4 lg:px-8">
          {TRUST_BADGES.map((badge) => {
            const Icon = badge.icon;

            return (
              <div key={badge.title} className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-tight">
                    {badge.title}
                  </p>
                  <p className="mt-0.5 hidden text-xs leading-snug text-muted-foreground sm:block">
                    {badge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================================================================ */}
      {/* Main footer content                                               */}
      {/* ================================================================ */}

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                G
              </div>
              <span className="text-base font-bold tracking-tight">
                GearUp
              </span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">
              A peer-to-peer rental marketplace for cameras, tools,
              camping gear, and tech — rent what you need, skip the
              cost of buying it.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <a
                href="mailto:hello@gearup.example"
                aria-label="Email"
                className="flex size-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                <Mail className="size-4" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold">Explore</h3>
            <ul className="mt-4 space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account links */}
          <div>
            <h3 className="text-sm font-semibold">Account</h3>
            <ul className="mt-4 space-y-2.5">
              {ACCOUNT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold">Get in touch</h3>

            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                <span>Dhaka, Bangladesh</span>
              </li>

              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 size-4 shrink-0" />
                <a
                  href="mailto:hello@gearup.example"
                  className="transition-colors hover:text-foreground"
                >
                  hello@gearup.example
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ============================================================== */}
        {/* Bottom bar                                                      */}
        {/* ============================================================== */}

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} GearUp. All rights reserved.
          </p>

          <p className="text-xs text-muted-foreground">
            Built as a portfolio project — payments processed by Stripe.
          </p>
        </div>
      </div>
    </footer>
  );
}