"use client";

import { Group, Circle, Line } from "react-konva";
import type Konva from "konva";
import type { NormPoint } from "../lib/types";

export function Ball({
  point,
  stageW,
  stageH,
  nodeRef,
}: {
  point: NormPoint;
  stageW: number;
  stageH: number;
  nodeRef?: (node: Konva.Group | null) => void;
}) {
  const r = Math.max(8, Math.min(stageW, stageH) * 0.022);
  return (
    <Group
      ref={nodeRef ?? undefined}
      x={point.x * stageW}
      y={point.y * stageH}
      listening={false}
    >
      <Circle
        radius={r}
        fill="#fb923c"
        stroke="#0a1726"
        strokeWidth={1.5}
        perfectDrawEnabled={false}
        shadowForStrokeEnabled={false}
      />
      <Line points={[-r, 0, r, 0]} stroke="#0a1726" strokeWidth={1} perfectDrawEnabled={false} />
      <Line points={[0, -r, 0, r]} stroke="#0a1726" strokeWidth={1} perfectDrawEnabled={false} />
      <Line
        points={[-r * 0.7, -r * 0.7, r * 0.7, r * 0.7]}
        stroke="#0a1726"
        strokeWidth={0.8}
        perfectDrawEnabled={false}
      />
      <Line
        points={[-r * 0.7, r * 0.7, r * 0.7, -r * 0.7]}
        stroke="#0a1726"
        strokeWidth={0.8}
        perfectDrawEnabled={false}
      />
    </Group>
  );
}
