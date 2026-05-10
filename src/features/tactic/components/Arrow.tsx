"use client";

import { Arrow as KArrow } from "react-konva";
import type { NormPoint } from "../lib/types";

type Props = {
  from: NormPoint;
  to: NormPoint;
  stageW: number;
  stageH: number;
  color?: string;
  dashed?: boolean;
};

export function Arrow({ from, to, stageW, stageH, color = "#facc15", dashed }: Props) {
  return (
    <KArrow
      points={[from.x * stageW, from.y * stageH, to.x * stageW, to.y * stageH]}
      stroke={color}
      fill={color}
      strokeWidth={3}
      pointerLength={10}
      pointerWidth={10}
      dash={dashed ? [10, 6] : undefined}
      listening={false}
    />
  );
}
