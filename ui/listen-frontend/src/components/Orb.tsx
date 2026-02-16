import { useEffect, useRef } from "react";

const Orb: React.FC = () => {
  const orbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let start: number | null = null;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const angle = (elapsed / 40000) * 360;
      if (orbRef.current) {
        orbRef.current.style.setProperty("--angle", `${angle}deg`);
      }
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, []);

  const orbStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateAreas: '"stack"',
    inlineSize: "min(80vmin, 100%)",
    aspectRatio: "1",
    overflow: "hidden",
    borderRadius: "50%",
    "--bg": "oklch(12.9% 0.042 264.695)",
    "--c1": "oklch(44.4% 0.177 26.899)",
    "--c2": "oklch(85.2% 0.199 91.936)",
    "--c3": "oklch(58.8% 0.158 241.966)",
    position: "fixed",
    left: "-45%",
    top: "25%",
    zIndex: "-10",
    width: "200vh", 
    height: "200vh",
  } as any;

  const beforeStyle: React.CSSProperties = {
    gridArea: "stack",
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    transform: "translateZ(0)",
    background: `
      conic-gradient(from calc(var(--angle) * 2) at 25% 70%, var(--c3), transparent 20% 80%, var(--c3)),
      conic-gradient(from calc(var(--angle) * 2) at 45% 75%, var(--c2), transparent 30% 60%, var(--c2)),
      conic-gradient(from calc(var(--angle) * -3) at 80% 20%, var(--c1), transparent 40% 60%, var(--c1)),
      conic-gradient(from calc(var(--angle) * 2) at 15% 5%, var(--c2), transparent 10% 90%, var(--c2)),
      conic-gradient(from calc(var(--angle) * 1) at 20% 80%, var(--c1), transparent 10% 90%, var(--c1)),
      conic-gradient(from calc(var(--angle) * -2) at 85% 10%, var(--c3), transparent 20% 80%, var(--c3))
    `,
    boxShadow: "inset var(--bg) 0 0 5vmin 1vmin",
    filter: "blur(3vmin) contrast(5)",
    position: "absolute",
    top: 0,
    left: 0,
  };

  const afterStyle: React.CSSProperties = {
    gridArea: "stack",
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    backgroundImage: "radial-gradient(circle at center, var(--bg) var(--dot), transparent var(--dot))",
    backgroundSize: "calc(var(--dot) * 2) calc(var(--dot) * 2)",
    maskImage: "radial-gradient(black 25%, transparent 75%)",
    backdropFilter: "blur(8vmin) contrast(10)",
    mixBlendMode: "overlay",
    position: "absolute",
    top: 0,
    left: 0,
  };

  return (
    <div ref={orbRef} style={orbStyle}>
      <div style={beforeStyle} />
      <div style={afterStyle} />
    </div>
  );
};

export default Orb;
