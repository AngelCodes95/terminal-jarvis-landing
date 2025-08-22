interface TJarvisRetroLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function TJarvisRetroLogo({ 
  className = '', 
  width = 800, 
  height: _height = 220 
}: TJarvisRetroLogoProps) {
  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      <img 
        src="/MAIN-LOGO.png"
        alt="T.JARVIS AI Coding Assistant Command Center"
        className="tjarvis-retro-logo"
        style={{ 
          width: `${width}px`,
          height: 'auto',
          maxWidth: '100%',
          objectFit: 'contain',
          filter: 'drop-shadow(0 0 15px rgba(79, 209, 199, 0.3))'
        }}
      />
    </div>
  );
}