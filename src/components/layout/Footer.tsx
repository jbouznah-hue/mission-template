import Link from 'next/link';
import { siteConfig } from '@/config/site';

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-white/50 backdrop-blur-sm mt-16">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[var(--color-text-secondary)]">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-[var(--color-primary)] flex items-center justify-center text-white text-xs font-bold">O</div>
          <span>{siteConfig.entity.brand} — {siteConfig.entity.name}</span>
        </div>
        <div>{siteConfig.entity.address}</div>
        <div className="flex items-center gap-4">
          <span>N° {siteConfig.entity.siret}</span>
          <Link href="/admin/login" className="text-xs text-[var(--color-text-light)] hover:text-[var(--color-primary)] transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
