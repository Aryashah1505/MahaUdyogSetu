import React, { useEffect, useState } from 'react';

interface AnimatedCounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  formatNumber?: boolean;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  end,
  suffix = '',
  prefix = '',
  duration = 1400,
  formatNumber = false
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out quad: f(t) = t * (2 - t)
      const easeProgress = progress * (2 - progress);
      const current = Math.floor(easeProgress * end);
      setCount(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrameId);
  }, [end, duration]);

  const displayValue = formatNumber ? count.toLocaleString('en-IN') : count;

  return (
    <span>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
};

export const HomeStatsBar: React.FC = () => {
  const stats = [
    {
      value: 140,
      suffix: '+',
      formatNumber: false,
      label: 'Services Online'
    },
    {
      value: 7,
      suffix: ' Days',
      formatNumber: false,
      label: 'Average RTS SLA'
    },
    {
      value: 45000,
      suffix: '+',
      formatNumber: true,
      label: 'Units Cleared'
    },
    {
      value: 100,
      suffix: '%',
      formatNumber: false,
      label: 'Digital QR Authenticated'
    }
  ];

  return (
    <div className="w-full max-w-[1280px] mx-auto px-3 sm:px-6 py-4 sm:py-6 z-20">
      {/* One Single Glass Bar with 4 Evenly Spaced Stats Separated by Thin Dividers */}
      <div className="w-full rounded-2xl bg-white/[0.08] backdrop-blur-[12px] border border-white/[0.15] shadow-[0_8px_32px_rgba(0,0,0,0.2)] p-3 sm:p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/15">
          {stats.map((stat, idx) => (
            <div 
              key={idx}
              className={`flex flex-col items-center justify-center text-center py-2.5 sm:py-3 md:py-1 px-2 sm:px-3 ${
                idx % 2 === 1 ? 'border-l border-white/10 md:border-l-0' : ''
              }`}
            >
              {/* Numbers */}
              <div className="text-xl sm:text-2xl lg:text-[28px] font-bold text-white tracking-tight leading-tight">
                <AnimatedCounter 
                  end={stat.value} 
                  suffix={stat.suffix} 
                  formatNumber={stat.formatNumber} 
                />
              </div>
              {/* Labels */}
              <div className="text-[11px] sm:text-xs lg:text-[13px] text-[#CBD5E1] font-medium mt-0.5 sm:mt-1 leading-snug">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
