import { useState, useEffect } from "react";

export const useThemeColor = (variableName: string): string => {
  const [color, setColor] = useState("");

  useEffect(() => {
    const computedColor = getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim();

    setColor(computedColor);

    const observer = new MutationObserver(() => {
      const updatedColor = getComputedStyle(document.documentElement)
        .getPropertyValue(variableName)
        .trim();
      setColor(updatedColor);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [variableName]);

  return color;
};
