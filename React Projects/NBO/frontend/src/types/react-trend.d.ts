declare module "react-trend" {
  import React from "react";

  interface TrendProps {
    data: number[] | { value: number }[];
    smooth?: boolean;
    autoDraw?: boolean;
    autoDrawDuration?: number;
    autoDrawEasing?: string;
    gradient?: string[];
    radius?: number;
    strokeWidth?: number;
    strokeLinecap?: string;
    height?: number | string;
    width?: number | string;
    className?: string;
  }

  const Trend: React.FC<TrendProps>;
  export default Trend;
}
