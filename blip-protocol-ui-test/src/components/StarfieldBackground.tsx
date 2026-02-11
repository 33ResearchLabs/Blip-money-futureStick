import { useEffect, useRef } from "react";

interface StarfieldBackgroundProps {
  starCount?: number;
  showFog?: boolean;
  showMist?: boolean;
  showLighting?: boolean;
}

const StarfieldBackground = ({
  starCount = 180,
  showFog = true,
  showMist = true,
  showLighting = true,
}: StarfieldBackgroundProps) => {
  const starfieldRef = useRef<HTMLDivElement>(null);
  const lightingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const starfield = starfieldRef.current;
    if (!starfield) return;

    // Clear existing stars
    starfield.innerHTML = "";

    // Orange-tinted star colors
    const orangeColors = ["#ffff"];

    // Generate stars
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement("div");
      star.className = "starfield-star";

      const size = Math.random() * 2 + 0.6;
      const color =
        orangeColors[Math.floor(Math.random() * orangeColors.length)];
      const duration = Math.random() * 3 + 2;

      star.style.cssText = `
        position: absolute;
        border-radius: 50%;
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        background: ${color};
        box-shadow: 0 0 ${size * 2}px ${color}, 0 0 ${size * 4}px ${color}11;
        animation: starfield-twinkle ${duration}s infinite ease-in-out;
        animation-delay: ${Math.random() * duration}s;
      `;

      starfield.appendChild(star);
    }

    // Mouse parallax effect for lighting layer
    const handleMouseMove = (e: MouseEvent) => {
      if (!lightingRef.current) return;

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const moveX = (e.clientX - centerX) / centerX;
      const moveY = (e.clientY - centerY) / centerY;

      const x = moveX * 25 * 0.03;
      const y = moveY * 25 * 0.03;

      lightingRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;

      // Subtle starfield movement
      if (starfield) {
        const starX = moveX * 25 * 0.005;
        const starY = moveY * 25 * 0.005;
        starfield.style.transform = `translate3d(${starX}px, ${starY}px, 0)`;
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [starCount]);

  return (
    <>
      {/* Starfield */}
      <div
        ref={starfieldRef}
        className="starfield-container"
        aria-hidden="true"
      />

      {/* Fog Layer */}
      {showFog && <div className="starfield-fog" aria-hidden="true" />}

      {/* Mist Layer */}
      {showMist && <div className="starfield-mist" aria-hidden="true" />}

      {/* Background Lighting Accents */}
      {showLighting && (
        <div
          ref={lightingRef}
          className="starfield-lighting"
          aria-hidden="true"
        >
          <div className="starfield-glow-white" />
          <div className="starfield-glow-orange" />
        </div>
      )}
    </>
  );
};

export default StarfieldBackground;
