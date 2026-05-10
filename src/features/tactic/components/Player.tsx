"use client";

import { useState } from "react";
import { Group, Circle, Text } from "react-konva";
import type Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";
import type { NormPoint, PlayerPlacement } from "../lib/types";

const PLAYER_COLORS: Record<string, string> = {
  team1: "#3b82f6",
  team2: "#ef4444",
};

type Props = {
  player: PlayerPlacement;
  stageW: number;
  stageH: number;
  draggable?: boolean;
  highlight?: boolean;
  dim?: boolean;
  ghost?: boolean;
  /** Callback ref pour récupérer le node Konva (utilisé pour le playback direct). */
  nodeRef?: (node: Konva.Group | null) => void;
  onTap?: () => void;
  onDragEnd?: (point: NormPoint) => void;
};

export function Player({
  player,
  stageW,
  stageH,
  draggable,
  highlight,
  dim,
  ghost,
  nodeRef,
  onTap,
  onDragEnd,
}: Props) {
  const radius = Math.max(14, Math.min(stageW, stageH) * 0.035);
  const x = player.x * stageW;
  const y = player.y * stageH;

  const [dragging, setDragging] = useState(false);

  const color = PLAYER_COLORS[player.team];

  const handleDragStart = () => setDragging(true);

  const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
    const node = e.target;
    const nx = Math.max(0, Math.min(stageW, node.x())) / stageW;
    const ny = Math.max(0, Math.min(stageH, node.y())) / stageH;
    setDragging(false);
    onDragEnd?.({ x: nx, y: ny });
  };

  const handleClick = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    e.cancelBubble = true;
    onTap?.();
  };

  return (
    <Group
      ref={nodeRef ?? undefined}
      x={x}
      y={y}
      draggable={draggable}
      onClick={handleClick}
      onTap={handleClick}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      opacity={ghost ? 0.3 : dim ? 0.45 : 1}
    >
      {highlight && (
        <Circle
          radius={radius + 6}
          fill="#f97316"
          opacity={0.35}
          listening={false}
          perfectDrawEnabled={false}
        />
      )}
      <Circle
        radius={radius}
        fill={color}
        stroke={highlight ? "#f97316" : "#09090b"}
        strokeWidth={highlight ? 3 : 2}
        shadowColor="black"
        shadowBlur={dragging ? 12 : 4}
        shadowOpacity={dragging ? 0.7 : 0.4}
        shadowForStrokeEnabled={false}
        perfectDrawEnabled={false}
      />
      <Text
        text={String(player.num)}
        fontSize={radius * 1.1}
        fontStyle="bold"
        fill="white"
        offsetX={radius * 0.3}
        offsetY={radius * 0.55}
        listening={false}
        perfectDrawEnabled={false}
      />
    </Group>
  );
}
