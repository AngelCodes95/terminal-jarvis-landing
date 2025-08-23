import { useTheme } from '../hooks/useTheme';

interface TJarvisRetroLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function TJarvisRetroLogo({
  className = '',
  width = 800,
  height: _height = 220,
}: TJarvisRetroLogoProps) {
  const { theme } = useTheme();
  const isLightMode = theme === 'light';

  const getLogoFilter = (isHover = false) => {
    if (isLightMode) {
      // Light mode: exaggerated dark navy glow matching logo background
      return isHover
        ? 'drop-shadow(0 0 40px rgba(30, 58, 138, 0.8)) drop-shadow(0 0 80px rgba(30, 58, 138, 0.4))'
        : 'drop-shadow(0 0 25px rgba(30, 58, 138, 0.7)) drop-shadow(0 0 50px rgba(30, 58, 138, 0.3))';
    } else {
      // Dark mode: exaggerated cyan glow with multiple layers
      return isHover
        ? 'drop-shadow(0 0 35px var(--jarvis-cyan-glow-strong)) drop-shadow(0 0 70px var(--jarvis-cyan-glow))'
        : 'drop-shadow(0 0 25px var(--jarvis-cyan-glow)) drop-shadow(0 0 50px rgba(79, 209, 199, 0.3))';
    }
  };

  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      <a
        href="https://github.com/BA-CalderonMorales/terminal-jarvis"
        target="_blank"
        rel="noopener noreferrer"
        className="transition-all duration-300 hover:scale-105 cursor-pointer"
        style={{
          filter: getLogoFilter(false),
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.filter = getLogoFilter(true);
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.filter = getLogoFilter(false);
        }}
      >
        <img
          src="/updated-main-logo.jpg"
          alt="T.JARVIS AI Coding Assistant Command Center - Click to visit repository"
          className="tjarvis-retro-logo"
          style={{
            width: `${width}px`,
            height: 'auto',
            maxWidth: '100%',
            objectFit: 'contain',
          }}
        />
      </a>
    </div>
  );
}
