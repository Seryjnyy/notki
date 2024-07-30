import React, { useState } from "react";
import { Button } from "./ui/button";
import { HslColor, HslColorPicker } from "react-colorful";

export default function ThemeEditor() {
  const [color, setColor] = useState<HslColor>({ h: 100, s: 100, l: 100 });
  const setRootVars = (obj: Record<string, string>) => {
    // const root = document.querySelector(":root");
  };

  return <div className="bg-red-200">asdff</div>;
}
