'use client';

import { ArrowRight } from 'lucide-react';

export interface TradeCtaBannerProps {
  heading: string;
  description?: string;
  buttonLabel: string;
  targetId: string;
}

export function TradeCtaBanner({
  heading,
  description,
  buttonLabel,
  targetId,
}: TradeCtaBannerProps) {
  const scrollToTarget = () => {
    document
      .getElementById(targetId)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="bg-[#0C0C0C] py-16">
      <div className="page-wrap flex flex-col items-center gap-6 text-center">
        <h2 className="max-w-2xl text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
          {heading}
        </h2>
        {description && (
          <p className="max-w-xl text-sm text-white/60 sm:text-base">
            {description}
          </p>
        )}
        <button
          type="button"
          onClick={scrollToTarget}
          className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-medium text-black transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C0C0C]"
        >
          {buttonLabel}
          <ArrowRight
            className="size-4 motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </button>
      </div>
    </section>
  );
}
