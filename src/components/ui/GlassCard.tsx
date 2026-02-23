'use client';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function GlassCard({
  children,
  className = '',
  onClick,
}: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={`glass-card p-8 group transition-all duration-500 hover:shadow-glass-glow hover:-translate-y-2 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div className="relative z-10 h-full flex flex-col">
        {children}
      </div>
    </div>
  );
}
