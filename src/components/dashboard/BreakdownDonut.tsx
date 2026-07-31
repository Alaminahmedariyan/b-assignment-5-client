'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface BreakdownSlice {
  label: string;
  value: number;
  /** A CSS color value, e.g. "var(--color-primary)" or "var(--color-tag)" */
  color: string;
}

interface BreakdownDonutProps {
  title: string;
  data: BreakdownSlice[];
  /** Big number shown in the center of the donut */
  centerLabel: string;
  centerValue: string | number;
}

export function BreakdownDonut({
  title,
  data,
  centerLabel,
  centerValue,
}: BreakdownDonutProps) {
  const total = data.reduce((sum, slice) => sum + slice.value, 0);

  return (
    <div className="card-elevate rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
      <h3 className="font-display text-sm font-semibold text-muted-foreground">
        {title}
      </h3>

      {total === 0 ? (
        <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
          No data yet
        </div>
      ) : (
        <div className="relative mt-2 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                innerRadius="65%"
                outerRadius="90%"
                paddingAngle={3}
                strokeWidth={0}
              >
                {data.map((slice) => (
                  <Cell key={slice.label} fill={slice.color} />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  background: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '0.75rem',
                  fontSize: '0.8rem',
                  color: 'var(--color-card-foreground)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center label overlay */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-2xl font-bold tracking-tight">
              {centerValue}
            </span>
            <span className="text-xs text-muted-foreground">
              {centerLabel}
            </span>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
        {data.map((slice) => (
          <div
            key={slice.label}
            className="flex items-center gap-1.5 text-xs text-muted-foreground"
          >
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: slice.color }}
            />
            {slice.label} ({slice.value})
          </div>
        ))}
      </div>
    </div>
  );
}