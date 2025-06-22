import React, { useState, useEffect } from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";
import "./TextSizeController.css";

interface TextSizeControllerProps {
  className?: string;
}

const TextSizeController: React.FC<TextSizeControllerProps> = ({
  className = "",
}) => {
  const [fontSize, setFontSize] = useState(100);

  useEffect(() => {
    const savedSize = localStorage.getItem("app-font-size");
    if (savedSize) {
      const size = parseInt(savedSize, 10);
      setFontSize(size);
      applyFontSize(size);
    }
  }, []);

  const applyFontSize = (size: number) => {
    document.documentElement.style.fontSize = `${size}%`;
  };

  const increaseFontSize = () => {
    if (fontSize < 200) {
      const newSize = fontSize + 10;
      setFontSize(newSize);
      applyFontSize(newSize);
      localStorage.setItem("app-font-size", newSize.toString());
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > 80) {
      const newSize = fontSize - 10;
      setFontSize(newSize);
      applyFontSize(newSize);
      localStorage.setItem("app-font-size", newSize.toString());
    }
  };

  const resetFontSize = () => {
    const defaultSize = 100;
    setFontSize(defaultSize);
    applyFontSize(defaultSize);
    localStorage.setItem("app-font-size", defaultSize.toString());
  };

  const getSizeLabel = () => {
    if (fontSize <= 90) return "Klein";
    if (fontSize <= 110) return "Normaal";
    if (fontSize <= 130) return "Groot";
    return "Extra groot";
  };

  return (
    <div className={`text-size-controller ${className}`}>
      <div className="text-size-label">
        <span className="label-text">Tekstgrootte:</span>
        <span className="size-indicator">{getSizeLabel()}</span>
      </div>

      <div className="text-size-controls">
        <button
          onClick={decreaseFontSize}
          disabled={fontSize <= 80}
          className="size-button decrease"
          title="Tekst verkleinen"
          aria-label="Tekst verkleinen"
        >
          <Minus size={16} />
          <span className="button-text">A</span>
        </button>

        <button
          onClick={resetFontSize}
          className="size-button reset"
          title="Standaard grootte"
          aria-label="Tekstgrootte resetten naar standaard"
        >
          <RotateCcw size={14} />
        </button>

        <button
          onClick={increaseFontSize}
          disabled={fontSize >= 200}
          className="size-button increase"
          title="Tekst vergroten"
          aria-label="Tekst vergroten"
        >
          <span className="button-text">A</span>
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
};

export default TextSizeController;
