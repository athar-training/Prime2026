interface WordmarkProps {
  size?: number;
  className?: string;
}

// Inline "Google" wordmark rendered in white.
export function GoogleWordmark({ size = 100, className = "" }: WordmarkProps) {
  const height = (size * 30) / 115;
  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 115 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Google"
    >
      <text
        x="0"
        y="23"
        fill="#ffffff"
        fontFamily="Manrope, Arial, sans-serif"
        fontSize="26"
        fontWeight="600"
        letterSpacing="-1"
      >
        Google
      </text>
    </svg>
  );
}

// Inline "GitHub" wordmark rendered in white.
export function GithubWordmark({ size = 100, className = "" }: WordmarkProps) {
  const height = (size * 30) / 110;
  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 110 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="GitHub"
    >
      <text
        x="0"
        y="23"
        fill="#ffffff"
        fontFamily="Manrope, Arial, sans-serif"
        fontSize="26"
        fontWeight="700"
        letterSpacing="-1"
      >
        GitHub
      </text>
    </svg>
  );
}
