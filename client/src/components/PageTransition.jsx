import { useEffect, useState } from "react";

/**
 * Lightweight page transition wrapper.
 * Re-triggers the enter animation whenever `viewKey` changes so switching
 * between the form and profile views always animates in smoothly.
 */
export default function PageTransition({ viewKey, children }) {
  const [activeKey, setActiveKey] = useState(viewKey);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (viewKey === activeKey) return;

    // Fade out current view
    setVisible(false);

    const outTimer = setTimeout(() => {
      setActiveKey(viewKey);
      // Fade in next view
      requestAnimationFrame(() => setVisible(true));
    }, 180);

    return () => clearTimeout(outTimer);
  }, [viewKey, activeKey]);

  return (
    <div
      key={activeKey}
      className={visible ? "animate-fadeInUp" : "opacity-0 translate-y-2"}
      style={{ transition: "opacity 0.18s ease-out, transform 0.18s ease-out" }}
    >
      {children}
    </div>
  );
}

