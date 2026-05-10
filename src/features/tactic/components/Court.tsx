"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Stage, Layer, Image as KImage, Rect, Group, Line, Text } from "react-konva";
import type Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";
import { useTacticStore, currentPositions, type Tool, type AnnotateMode } from "../hooks/useTacticStore";
import type { NormPoint, PlayerPlacement } from "../lib/types";
import { COURT_ASPECT_RATIO, BASKET_NORM } from "../lib/types";
import { useCourtImage } from "./useCourtImage";
import { Player } from "./Player";
import { Arrow } from "./Arrow";
import { Ball } from "./Ball";

type Frame = { players: PlayerPlacement[]; ball?: NormPoint };

export type CourtHandle = {
  setPlaybackFrame: (frame: Frame | null) => void;
  getStage: () => Konva.Stage | null;
};

type Props = {
  readOnly?: boolean;
  onReady?: (handle: CourtHandle) => void;
};

export function Court({ readOnly = false, onReady }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const courtLayerRef = useRef<Konva.Layer>(null);
  const playersLayerRef = useRef<Konva.Layer>(null);
  const playerNodesRef = useRef<Map<string, Konva.Group>>(new Map());
  const ballNodeRef = useRef<Konva.Group | null>(null);
  const sizeRef = useRef({ w: 0, h: 0 });
  const [size, setSize] = useState({ w: 0, h: 0 });

  const courtImage = useCourtImage();

  const data = useTacticStore((s) => s.data);
  const tool = useTacticStore((s) => s.tool);
  const arrowFromPlayerId = useTacticStore((s) => s.arrowFromPlayerId);
  const draftMovements = useTacticStore((s) => s.draftMovements);
  const draftPass = useTacticStore((s) => s.draftPass);
  const shootPlayerId = useTacticStore((s) => s.shootPlayerId);
  const isPlaying = useTacticStore((s) => s.isPlaying);
  const annotateMode = useTacticStore((s) => s.annotateMode);
  const addAnnotationStroke = useTacticStore((s) => s.addAnnotationStroke);
  const addAnnotationLabel = useTacticStore((s) => s.addAnnotationLabel);

  const skipStageClickRef = useRef(false);
  const drawingStrokeRef = useRef(false);
  const strokePointsRef = useRef<number[] | null>(null);
  const [previewStroke, setPreviewStroke] = useState<number[] | null>(null);

  const movePlayerInitial = useTacticStore((s) => s.movePlayerInitial);
  const setMovementTarget = useTacticStore((s) => s.setMovementTarget);
  const setPassTarget = useTacticStore((s) => s.setPassTarget);
  const pickArrowFrom = useTacticStore((s) => s.pickArrowFrom);
  const giveBallToPlayer = useTacticStore((s) => s.giveBallToPlayer);

  // Resize observer
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const w = rect.width;
      const h = Math.min(rect.height, w / COURT_ASPECT_RATIO);
      const finalW = h * COURT_ASPECT_RATIO > rect.width ? rect.width : h * COURT_ASPECT_RATIO;
      const finalH = finalW / COURT_ASPECT_RATIO;
      sizeRef.current = { w: finalW, h: finalH };
      setSize({ w: finalW, h: finalH });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const positions = useMemo(() => currentPositions(data), [data]);

  /**
   * Playback haute-perf : on ne passe PAS par React state.
   * On mute directement les positions des nodes Konva et on appelle
   * `batchDraw` une seule fois par frame. C'est ~10× plus rapide que
   * de re-render React 60fps avec ~10 joueurs + flèches.
   *
   * Optims supplémentaires :
   *  - .x()/.y() au lieu de .position({}) pour éviter une allocation/frame
   *  - listening: false sur la layer pendant le playback (pas de hit graph)
   */
  const applyPlaybackFrame = useCallback((frame: Frame | null) => {
    const { w, h } = sizeRef.current;
    if (w === 0 || h === 0) return;
    const layer = playersLayerRef.current;

    if (!frame) {
      // Fin de playback : on remet la layer en mode interactif
      layer?.listening(true);
      // Restauration : repart de l'état "réel" (cumul des séquences)
      const cur = currentPositions(data);
      cur.players.forEach((p) => {
        const node = playerNodesRef.current.get(p.id);
        if (node) {
          node.x(p.x * w);
          node.y(p.y * h);
        }
      });
      if (cur.ball && ballNodeRef.current) {
        ballNodeRef.current.x(cur.ball.x * w);
        ballNodeRef.current.y(cur.ball.y * h);
      }
      layer?.batchDraw();
      return;
    }

    // Pendant la playback : pas besoin de hit graph (aucun click possible)
    if (layer && layer.listening()) layer.listening(false);

    const players = frame.players;
    const map = playerNodesRef.current;
    for (let i = 0; i < players.length; i++) {
      const p = players[i];
      const node = map.get(p.id);
      if (node) {
        node.x(p.x * w);
        node.y(p.y * h);
      }
    }
    if (frame.ball && ballNodeRef.current) {
      ballNodeRef.current.x(frame.ball.x * w);
      ballNodeRef.current.y(frame.ball.y * h);
    }
    layer?.batchDraw();
  }, [data]);

  useEffect(() => {
    onReady?.({
      setPlaybackFrame: applyPlaybackFrame,
      getStage: () => stageRef.current,
    });
  }, [onReady, applyPlaybackFrame]);

  // Cache la layer du terrain (statique) en bitmap : aucune
  // image n'est redessinée pendant le playback ou lors de hover.
  useEffect(() => {
    const layer = courtLayerRef.current;
    if (!layer || size.w === 0 || size.h === 0) return;
    if (!courtImage || courtImage.naturalWidth === 0) return;
    // Cache asynchrone après le 1er paint pour éviter un flash
    const id = requestAnimationFrame(() => {
      layer.cache();
      layer.batchDraw();
    });
    return () => {
      cancelAnimationFrame(id);
      layer.clearCache();
    };
  }, [courtImage, size.w, size.h]);

  const setupLocked = data.sequences.length > 0;

  const handlePlayerTap = (player: PlayerPlacement) => {
    if (readOnly || isPlaying) return;
    if (tool === "annotate") return;

    if (tool === "arrow") {
      if (!arrowFromPlayerId) {
        pickArrowFrom(player.id);
      } else if (arrowFromPlayerId === player.id) {
        // ignore self click
      } else {
        // arrow target is at the picked player's current position
        const target = positions.players.find((p) => p.id === player.id);
        if (target)
          setMovementTarget(arrowFromPlayerId, { x: target.x, y: target.y });
      }
      return;
    }

    if (tool === "pass") {
      // Le porteur a déjà été présélectionné par la Toolbar.
      // Ici on attend juste le clic sur le receveur.
      if (
        draftPass &&
        draftPass.fromPlayerId !== player.id &&
        player.team === "team1"
      ) {
        setPassTarget(player.id);
      }
      return;
    }

    if (tool === "shoot") {
      // Le tireur est déjà sélectionné par la Toolbar — rien à faire ici.
      return;
    }

    // idle: assign ball to a team1 player
    if (player.team === "team1" && !setupLocked) {
      giveBallToPlayer(player.id);
    }
  };

  const handlePlayerMove = (player: PlayerPlacement, point: NormPoint) => {
    if (readOnly || isPlaying) return;
    if (tool === "annotate") return;
    // En mode "Course" : drag = trace une course, le joueur reste à sa place.
    // Sinon, si setup pas encore verrouillé : drag = repositionne le joueur initial.
    // Sinon (séquence(s) existent) : drag = course pour la prochaine séquence.
    if (tool === "arrow") {
      setMovementTarget(player.id, point);
    } else if (setupLocked) {
      setMovementTarget(player.id, point);
    } else {
      movePlayerInitial(player.id, point);
    }
  };

  const handleStageActivate = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (readOnly || isPlaying) return;
    if (skipStageClickRef.current) return;
    if (tool === "annotate" && annotateMode === "label") {
      if (e.target !== e.target.getStage()) return;
      const stage = e.target.getStage();
      if (!stage || size.w === 0) return;
      const pointer = stage.getPointerPosition();
      if (!pointer) return;
      const raw = window.prompt("Texte sur le terrain");
      if (raw?.trim()) {
        addAnnotationLabel(pointer.x / size.w, pointer.y / size.h, raw);
      }
      return;
    }
    if (e.target !== e.target.getStage()) return;
    if (tool === "arrow" && arrowFromPlayerId) {
      const stage = e.target.getStage();
      if (!stage || size.w === 0) return;
      const pointer = stage.getPointerPosition();
      if (!pointer) return;
      setMovementTarget(arrowFromPlayerId, {
        x: pointer.x / size.w,
        y: pointer.y / size.h,
      });
    }
  };

  const appendStrokeNormPair = (): [number, number] | null => {
    const stage = stageRef.current;
    if (!stage || size.w === 0) return null;
    const pointer = stage.getPointerPosition();
    if (!pointer) return null;
    return [pointer.x / size.w, pointer.y / size.h];
  };

  const handleStrokeStart = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (readOnly || isPlaying || tool !== "annotate" || annotateMode !== "pen")
      return;
    if (e.target !== e.target.getStage()) return;
    const pair = appendStrokeNormPair();
    if (!pair) return;
    drawingStrokeRef.current = true;
    const initial = [pair[0], pair[1]];
    strokePointsRef.current = initial;
    setPreviewStroke(initial);
  };

  const handleStrokeMove = () => {
    if (!drawingStrokeRef.current) return;
    const pair = appendStrokeNormPair();
    if (!pair) return;
    const cur = strokePointsRef.current;
    if (!cur) return;
    const next = [...cur, pair[0], pair[1]];
    strokePointsRef.current = next;
    setPreviewStroke(next);
  };

  const handleStrokeEnd = () => {
    if (!drawingStrokeRef.current) return;
    drawingStrokeRef.current = false;
    const pts = strokePointsRef.current;
    strokePointsRef.current = null;
    setPreviewStroke(null);
    if (pts && pts.length >= 4) {
      skipStageClickRef.current = true;
      queueMicrotask(() => {
        skipStageClickRef.current = false;
      });
      addAnnotationStroke(pts);
    }
  };

  const renderArrows = () => {
    const arrows: React.ReactNode[] = [];
    // movement arrows (drafted)
    for (const [pid, target] of Object.entries(draftMovements)) {
      const start = positions.players.find((p) => p.id === pid);
      if (!start) continue;
      arrows.push(
        <Arrow
          key={`m-${pid}`}
          from={{ x: start.x, y: start.y }}
          to={target}
          stageW={size.w}
          stageH={size.h}
          color="#facc15"
        />,
      );
    }
    // ongoing pass
    if (draftPass?.fromPlayerId && draftPass.toPlayerId) {
      const f = positions.players.find((p) => p.id === draftPass.fromPlayerId);
      const t = positions.players.find((p) => p.id === draftPass.toPlayerId);
      if (f && t) {
        arrows.push(
          <Arrow
            key="pass"
            from={{ x: f.x, y: f.y }}
            to={{ x: t.x, y: t.y }}
            stageW={size.w}
            stageH={size.h}
            color="#facc15"
            dashed
          />,
        );
      }
    }
    // shoot indicator
    if (shootPlayerId) {
      const f = positions.players.find((p) => p.id === shootPlayerId);
      if (f) {
        arrows.push(
          <Arrow
            key="shoot"
            from={{ x: f.x, y: f.y }}
            to={BASKET_NORM}
            stageW={size.w}
            stageH={size.h}
            color="#fb923c"
            dashed
          />,
        );
      }
    }
    return arrows;
  };

  const isSelectableForArrow = (_p: PlayerPlacement) =>
    !readOnly && !isPlaying && tool === "arrow" && !arrowFromPlayerId;

  const isSelectableForPass = (p: PlayerPlacement) =>
    !readOnly &&
    !isPlaying &&
    tool === "pass" &&
    p.team === "team1" &&
    !!draftPass &&
    draftPass.fromPlayerId !== p.id;

  const isSelectableForShoot = (_p: PlayerPlacement) =>
    !readOnly && !isPlaying && tool === "shoot";

  const ready = size.w > 0 && size.h > 0;

  return (
    <div ref={containerRef} className="relative w-full h-full grid place-items-center">
      {!readOnly && (
        <CourtHint
          tool={tool}
          annotateMode={annotateMode}
          arrowFromPlayerId={arrowFromPlayerId}
          draftPass={draftPass}
          setupLocked={setupLocked}
        />
      )}
      {ready && (
        <Stage
          ref={stageRef}
          width={size.w}
          height={size.h}
          onMouseDown={handleStrokeStart}
          onMouseMove={handleStrokeMove}
          onMouseUp={handleStrokeEnd}
          onMouseLeave={handleStrokeEnd}
          onClick={handleStageActivate}
          onTap={handleStageActivate}
        >
          <Layer ref={courtLayerRef} listening={false}>
            {courtImage &&
            courtImage.naturalWidth > 0 &&
            courtImage.naturalHeight > 0 ? (
              <KImage
                image={courtImage}
                width={size.w}
                height={size.h}
                perfectDrawEnabled={false}
              />
            ) : (
              <Rect
                width={size.w}
                height={size.h}
                fill="#ffedd5"
                perfectDrawEnabled={false}
              />
            )}
          </Layer>

          <Layer listening={false}>
            {/* Basket target highlight when shoot tool active */}
            {tool === "shoot" && (
              <Group
                x={BASKET_NORM.x * size.w}
                y={BASKET_NORM.y * size.h}
              >
                <Rect
                  x={-16}
                  y={-16}
                  width={32}
                  height={32}
                  cornerRadius={16}
                  fill="#fb923c"
                  opacity={0.25}
                  perfectDrawEnabled={false}
                />
              </Group>
            )}
            {renderArrows()}
          </Layer>

        <Layer ref={playersLayerRef}>
          {positions.players.map((p) => {
            const drafted = draftMovements[p.id];
            const displayP = drafted ? { ...p, x: drafted.x, y: drafted.y } : p;

            return (
              <Group key={p.id}>
                {/* Ghost at original position if moved */}
                {drafted && (
                  <Player
                    player={p}
                    stageW={size.w}
                    stageH={size.h}
                    ghost
                  />
                )}
                <Player
                  player={displayP}
                  stageW={size.w}
                  stageH={size.h}
                  nodeRef={(node) => {
                    if (node) playerNodesRef.current.set(p.id, node);
                    else playerNodesRef.current.delete(p.id);
                  }}
                  draggable={
                    !readOnly &&
                    !isPlaying &&
                    tool !== "pass" &&
                    tool !== "shoot" &&
                    tool !== "annotate"
                  }
                  onTap={() => handlePlayerTap(p)}
                  onDragEnd={(pt) => handlePlayerMove(p, pt)}
                  highlight={
                    isSelectableForArrow(p) ||
                    isSelectableForPass(p) ||
                    isSelectableForShoot(p) ||
                    arrowFromPlayerId === p.id
                  }
                  dim={
                    tool !== "idle" &&
                    tool !== "annotate" &&
                    !isSelectableForArrow(p) &&
                    !isSelectableForPass(p) &&
                    !isSelectableForShoot(p) &&
                    arrowFromPlayerId !== p.id
                  }
                />
              </Group>
            );
          })}

            {positions.ball && (
              <Ball
                point={positions.ball}
                stageW={size.w}
                stageH={size.h}
                nodeRef={(node) => {
                  ballNodeRef.current = node;
                }}
              />
            )}
          </Layer>

          <Layer listening={false}>
            {data.annotations?.strokes.map((st) => {
              const pts: number[] = [];
              for (let i = 0; i < st.points.length; i += 2) {
                pts.push(
                  st.points[i] * size.w,
                  st.points[i + 1] * size.h,
                );
              }
              return (
                <Line
                  key={st.id}
                  points={pts}
                  stroke="#f8fafc"
                  strokeWidth={3}
                  lineCap="round"
                  lineJoin="round"
                  opacity={0.95}
                  shadowColor="black"
                  shadowBlur={3}
                  tension={0.35}
                />
              );
            })}
            {previewStroke && previewStroke.length >= 2 &&
              (() => {
                const pts: number[] = [];
                for (let i = 0; i < previewStroke.length; i += 2) {
                  pts.push(
                    previewStroke[i] * size.w,
                    previewStroke[i + 1] * size.h,
                  );
                }
                return (
                  <Line
                    points={pts}
                    stroke="#fde047"
                    strokeWidth={3}
                    lineCap="round"
                    lineJoin="round"
                    dash={[6, 6]}
                  />
                );
              })()}
            {data.annotations?.labels.map((lb) => (
              <Text
                key={lb.id}
                x={lb.x * size.w}
                y={lb.y * size.h}
                text={lb.text}
                fontSize={14}
                fontStyle="bold"
                fill="#f8fafc"
                shadowColor="black"
                shadowBlur={4}
                shadowOffset={{ x: 0, y: 1 }}
              />
            ))}
          </Layer>
        </Stage>
      )}
    </div>
  );
}

function CourtHint({
  tool,
  annotateMode,
  arrowFromPlayerId,
  draftPass,
  setupLocked,
}: {
  tool: Tool;
  annotateMode: AnnotateMode;
  arrowFromPlayerId: string | null;
  draftPass: { fromPlayerId: string; toPlayerId: string | null } | null;
  setupLocked: boolean;
}) {
  const text = (() => {
    if (tool === "annotate") {
      return annotateMode === "pen"
        ? "Trace sur le parquet (craie)."
        : "Clique sur le terrain vide pour ajouter un libellé.";
    }
    if (tool === "idle") {
      if (setupLocked) {
        return "Déplacez un joueur pour tracer une course, ou utilisez les outils en bas.";
      } else {
        return "Placez vos joueurs. Cliquez sur un attaquant (Bleu) pour lui donner le ballon.";
      }
    }
    if (tool === "arrow") {
      return arrowFromPlayerId
        ? "Cliquez sur la destination de la course (terrain ou autre joueur)."
        : "Drag&drop d'un joueur pour tracer sa course, ou cliquez-le puis cliquez sa destination.";
    }
    if (tool === "pass") {
      if (!draftPass?.toPlayerId)
        return "Cliquez sur le receveur de la passe.";
      return null;
    }
    if (tool === "shoot") {
      return "Tir prêt — cliquez sur Valider.";
    }
    return null;
  })();
  if (!text) return null;
  return (
    <div className="pointer-events-none absolute top-2 left-1/2 -translate-x-1/2 z-10 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-medium shadow-lg whitespace-nowrap max-w-[90%] truncate">
      {text}
    </div>
  );
}
