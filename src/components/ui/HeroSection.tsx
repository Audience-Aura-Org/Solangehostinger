'use client';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  children?: React.ReactNode;
}

export default function HeroSection({
  title,
  subtitle,
  backgroundImage,
  children,
}: HeroSectionProps) {
  return (
    <section
      className={`relative min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center ${
        backgroundImage ? '' : 'bg-gradient-to-br from-primary via-secondary to-accent/20'
      }`}
      style={
        backgroundImage
          ? {
              backgroundImage: `linear-gradient(135deg, rgba(45, 38, 32, 0.5) 0%, rgba(232, 213, 196, 0.3) 100%), url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : undefined
      }
    >
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 glass rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 glass rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 text-center px-4 sm:px-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-dark mb-4 sm:mb-6 animate-slide-in-down">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg sm:text-xl text-gray-600 mb-8 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
            {subtitle}
          </p>
        )}
        {children && <div className="animate-slide-in-up" style={{ animationDelay: '0.2s' }}>{children}</div>}
      </div>
    </section>
  );
}
