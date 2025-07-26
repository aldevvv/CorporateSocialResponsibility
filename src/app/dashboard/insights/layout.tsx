// app/dashboard/insights/layout.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const tabs = [
  { name: 'Laporan Template', href: '/dashboard/insights' },
  { name: 'AI Insight', href: '/dashboard/insights/ai' },
];

export default function InsightsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Insights & Laporan</h1>
      <div className="border-b">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium',
                pathname === tab.href
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:border-gray-300 hover:text-foreground'
              )}
            >
              {tab.name}
            </Link>
          ))}
        </nav>
      </div>
      <div>{children}</div>
    </div>
  );
}