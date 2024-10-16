import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Play,
  Pause,
  MousePointer,
  Check,
  Video,
  StopCircle,
  Maximize,
  Minimize,
} from "react-feather";
import { TfiBasketball } from "react-icons/tfi";
import { CgBorderStyleDotted } from "react-icons/cg";
import { useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import dynamic from "next/dynamic";
import { UserButton, useUser } from "@clerk/nextjs";
import { GrReturn } from "react-icons/gr";
import { useRouter } from "next/router";

type LocalAnimationSequence = {
  id: string;
  players: Array<{
    id: string;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  }>;
  ball?: {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  };
  comment: string;
};

const PlayerButton = ({
  num,
  team,
  onDrop,
  isOnCourt,
  onClick,
  isSelectable,
}: {
  num: number;
  team: string;
  onDrop?: () => void;
  isOnCourt?: boolean;
  onClick?: () => void;
  isSelectable?: boolean;
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "player",
    item: { num, team },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: (item, monitor) => {
      if (monitor.didDrop() && onDrop && !isOnCourt) {
        onDrop();
      }
    },
  }));

  return (
    <div
      ref={drag as unknown as React.LegacyRef<HTMLDivElement>}
      className="relative"
      style={{ width: "3rem", height: "3rem" }}
      onClick={onClick}
    >
      <button
        className={`${
          team === "team1" ? "bg-blue-500" : "bg-red-500"
        } text-white rounded-full h-12 w-12 flex items-center justify-center ${
          isDragging ? "opacity-50" : ""
        } ${isSelectable ? "border-4 border-yellow-400" : ""}`}
        disabled={isOnCourt}
      >
        {num}
      </button>

      {isSelectable && (
        <div
          className="absolute top-0 left-0 w-full h-full bg-transparent"
          style={{
            width: "6rem",
            height: "6rem",
            top: "-1.5rem",
            left: "-1.5rem",
          }}
        />
      )}
    </div>
  );
};

const Arrow = ({
  start,
  end,
  playerRadius = 24,
  isDotted = false,
}: {
  start: { x: number; y: number };
  end: { x: number; y: number };
  playerRadius?: number;
  isDotted?: boolean;
}) => {
  const angle = Math.atan2(end.y - start.y, end.x - start.x);
  const length = Math.sqrt(
    Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
  );

  const offsetX = Math.cos(angle) * playerRadius;
  const offsetY = Math.sin(angle) * playerRadius;

  return (
    <div
      style={{
        position: "absolute",
        top: start.y + offsetY,
        left: start.x + offsetX,
        width: length - playerRadius,
        height: 0,
        transform: `rotate(${angle}rad)`,
        transformOrigin: "0 0",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "2px",
          borderTop: isDotted ? "2px dotted yellow" : "2px solid yellow",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: "-5px",
          top: "-4px",
          width: 0,
          height: 0,
          borderTop: "5px solid transparent",
          borderBottom: "5px solid transparent",
          borderLeft: "10px solid yellow",
        }}
      />
    </div>
  );
};

const Court = ({
  players,
  setPlayers,
  onPlayerClick,
  ballPosition,
  selectingPlayerForBall,
  selectingPlayerForArrow,
  onCourtClick,
  arrowStart,
  arrows,
  selectingDottedArrow,
  dottedArrows,
  isAnimating,
  animatingPlayer,
  isPlayingTimeline,
}: any) => {
  const [, drop] = useDrop({
    accept: "player",
    drop: (item: { num: number; team: string }, monitor) => {
      const isPlayerAlreadyOnCourt = players.some(
        (player: any) => player.num === item.num && player.team === item.team
      );

      if (!isPlayerAlreadyOnCourt) {
        const offset = monitor.getClientOffset();
        if (offset) {
          const courtRect = document
            .querySelector(".court-container")
            ?.getBoundingClientRect();
          if (courtRect) {
            const x = offset.x - courtRect.left;
            const y = offset.y - courtRect.top;
            const id = `${item.team}-${item.num}-${Date.now()}`;
            setPlayers([...players, { id, ...item, x, y }]);
          }
        }
      }
    },
  });

  return (
    <div
      ref={drop as unknown as React.LegacyRef<HTMLDivElement>}
      className="w-full h-full bg-orange-500 rounded-lg relative court-container"
      onClick={(e) => {
        const courtRect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - courtRect.left;
        const y = e.clientY - courtRect.top;
        onCourtClick({ x, y });
      }}
    >
      <div
        className="absolute inset-0 bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: "url('/img/basket_court.png')" }}
      >
        {players.map((player: any) => (
          <div
            key={player.id}
            className={`absolute transition-all duration-1000 ease-in-out ${
              selectingDottedArrow && player.team === "team1"
                ? "animate-pulse"
                : ""
            }`}
            style={{
              left: `${player.x}px`,
              top: `${player.y}px`,
              transform: "translate(-50%, -50%)",
            }}
            onClick={() => onPlayerClick(player)}
          >
            <PlayerButton
              num={player.num}
              team={player.team}
              isOnCourt
              isSelectable={
                selectingPlayerForBall ||
                selectingPlayerForArrow ||
                selectingDottedArrow
              }
              onClick={() =>
                (selectingPlayerForBall ||
                  selectingPlayerForArrow ||
                  selectingDottedArrow) &&
                onPlayerClick(player)
              }
            />
          </div>
        ))}

        {arrows.map((arrow: any, index: number) => (
          <Arrow key={index} start={arrow.start} end={arrow.end} />
        ))}

        {dottedArrows.map((arrow: any, index: number) => (
          <Arrow
            key={`dotted-${index}`}
            start={arrow.start}
            end={arrow.end}
            isDotted={true}
          />
        ))}

        {ballPosition && (
          <div
            className="absolute transition-all duration-500 ease-in-out"
            style={{
              left: `${ballPosition.x}px`,
              top: `${ballPosition.y}px`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <TfiBasketball size={28} color="orange" />
          </div>
        )}

        {arrowStart && (
          <div
            className="absolute z-10 animate-pulse"
            style={{
              left: `${arrowStart.x}px`,
              top: `${arrowStart.y}px`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <MousePointer size={24} color="yellow" />
          </div>
        )}
      </div>
    </div>
  );
};

const DndProviderWithNoSSR = dynamic(
  () => import("react-dnd").then((mod) => mod.DndProvider),
  { ssr: false }
);

const ActionButton = ({
  onClick,
  disabled,
  icon,
  title,
  description,
  isActive,
}: {
  onClick: () => void;
  disabled?: boolean;
  icon: React.ReactNode;
  title: string;
  description: string;
  isActive?: boolean;
}) => {
  return (
    <div className="relative group">
      <button
        className={`p-2 rounded-lg flex items-center justify-center w-full transition-all duration-300 ${
          disabled
            ? "bg-blue-600 opacity-50 cursor-not-allowed"
            : isActive
            ? "bg-yellow-500 hover:bg-yellow-400 hover:shadow-md border-yellow-300"
            : "bg-blue-600 hover:bg-blue-500 hover:shadow-md hover:scale-105"
        }`}
        onClick={onClick}
        disabled={disabled}
        title={title}
      >
        {icon}
      </button>
      <div className="absolute z-10 w-48 p-2 mt-2 text-sm text-white bg-gray-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        {description}
      </div>
    </div>
  );
};

const CreateSystem: React.FC = () => {
  const { user } = useUser();
  const router = useRouter();

  const [playersOnCourt, setPlayersOnCourt] = useState<
    Array<{ id: string; num: number; team: string; x: number; y: number }>
  >([]);

  const [team1Players, setTeam1Players] = useState([1, 2, 3, 4, 5]);
  const [team2Players, setTeam2Players] = useState([1, 2, 3, 4, 5]);

  const [selectingPlayerForBall, setSelectingPlayerForBall] = useState(false);
  const [ballPosition, setBallPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const [selectingPlayerForArrow, setSelectingPlayerForArrow] = useState(false);
  const [arrowStart, setArrowStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [arrows, setArrows] = useState<
    Array<{ start: { x: number; y: number }; end: { x: number; y: number } }>
  >([]);

  const [selectingDottedArrow, setSelectingDottedArrow] = useState(false);
  const [dottedArrows, setDottedArrows] = useState<
    Array<{ start: { x: number; y: number }; end: { x: number; y: number } }>
  >([]);

  const [actionHistory, setActionHistory] = useState<string[]>([]);

  const [isAnimating, setIsAnimating] = useState(false);
  const [animatingPlayer, setAnimatingPlayer] = useState<any>(null);

  const [timeline, setTimeline] = useState<LocalAnimationSequence[]>([]);
  const [isPlayingTimeline, setIsPlayingTimeline] = useState(false);

  const courtRef = useRef<HTMLDivElement>(null);

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [isPresentationMode, setIsPresentationMode] = useState(false);

  const togglePresentationMode = () => {
    setIsPresentationMode(!isPresentationMode);
  };

  const startRecording = async () => {
    if (!isPresentationMode) {
      alert(
        "Veuillez d'abord passer en mode présentation pour enregistrer uniquement le terrain."
      );
      return;
    }

    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style.display = "none";
      a.href = url;
      a.download = "basketball-system.webm";
      a.click();
      window.URL.revokeObjectURL(url);
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const addToHistory = (action: string) => {
    setActionHistory((prev) => [...prev, action]);
  };

  const isCourtEmpty = actionHistory.length === 0;

  const handlePlayerDrop = (num: number, team: string) => {
    if (team === "team1") {
      setTeam1Players((prevPlayers) => prevPlayers.filter((p) => p !== num));
    } else {
      setTeam2Players((prevPlayers) => prevPlayers.filter((p) => p !== num));
    }
    addToHistory("player");
  };

  const handleBasketballClick = () => {
    if (ballPosition) {
      setBallPosition(null);
    } else {
      setSelectingPlayerForBall(true);
    }
  };

  const handlePlayerClick = (player: any) => {
    if (selectingPlayerForBall) {
      if (player.team === "team1") {
        const ballX = player.x + 22; // Ajustez cette valeur si nécessaire
        const ballY = player.y;
        setBallPosition({ x: ballX, y: ballY });
        setSelectingPlayerForBall(false);
        addToHistory("ball");
      } else {
        alert(
          "Vous ne pouvez donner le ballon qu'à un joueur de votre équipe (bleu)."
        );
      }
    } else if (selectingPlayerForArrow) {
      if (!arrowStart) {
        setArrowStart({ x: player.x, y: player.y });
      } else {
        setArrows([
          ...arrows,
          { start: arrowStart, end: { x: player.x, y: player.y } },
        ]);
        setArrowStart(null);
        setSelectingPlayerForArrow(false);
        addToHistory("arrow");
      }
    }
  };

  const handleCourtClick = (position: { x: number; y: number }) => {
    if (selectingPlayerForArrow && arrowStart) {
      setArrows([...arrows, { start: arrowStart, end: position }]);
      setArrowStart(null);
      setSelectingPlayerForArrow(false);
      addToHistory("arrow");
    } else if (selectingDottedArrow && ballPosition) {
      const nearestPlayer = playersOnCourt.reduce<{
        player: (typeof playersOnCourt)[0] | null;
        distance: number;
      }>(
        (nearest, player) => {
          if (player.team !== "team1") return nearest; // Ignorer les joueurs qui ne sont pas de l'équipe 1 (bleus)
          const distance = Math.sqrt(
            Math.pow(player.x - position.x, 2) +
              Math.pow(player.y - position.y, 2)
          );
          return distance < nearest.distance ? { player, distance } : nearest;
        },
        { player: null, distance: Infinity }
      );

      if (nearestPlayer.player) {
        setDottedArrows([
          ...dottedArrows,
          {
            start: ballPosition,
            end: { x: nearestPlayer.player.x, y: nearestPlayer.player.y },
          },
        ]);
        setSelectingDottedArrow(false);
        addToHistory("dottedArrow");
      } else {
        alert(
          "Vous devez sélectionner un joueur de votre équipe (bleu) pour faire une passe."
        );
      }
    }
  };

  const handleDottedArrowClick = () => {
    if (ballPosition) {
      const playerWithBall = playersOnCourt.find(
        (player) =>
          Math.abs(player.x - ballPosition.x + 22) < 5 &&
          Math.abs(player.y - ballPosition.y) < 5
      );

      if (playerWithBall && playerWithBall.team === "team1") {
        setSelectingDottedArrow(true);
        setSelectingPlayerForArrow(false);
        setSelectingPlayerForBall(false);
      } else {
        alert(
          "Vous ne pouvez faire une passe qu'à partir d'un joueur de votre équipe (bleu)."
        );
      }
    }
  };

  const handleUndo = () => {
    if (isCourtEmpty) return;

    const lastAction = actionHistory[actionHistory.length - 1];
    setActionHistory((prev) => prev.slice(0, -1));

    switch (lastAction) {
      case "player":
        if (playersOnCourt.length > 0) {
          const lastPlayer = playersOnCourt[playersOnCourt.length - 1];
          setPlayersOnCourt((prev) => prev.slice(0, -1));
          if (lastPlayer.team === "team1") {
            setTeam1Players((prev) => [...prev, lastPlayer.num]);
          } else {
            setTeam2Players((prev) => [...prev, lastPlayer.num]);
          }
        }
        break;
      case "ball":
        setBallPosition(null);
        break;
      case "arrow":
        setArrows((prev) => prev.slice(0, -1));
        break;
      case "dottedArrow":
        setDottedArrows((prev) => prev.slice(0, -1));
        break;
    }
  };

  const handleValidateMovement = () => {
    const playersToAnimate: any[] = [];
    let ballToAnimate: {
      x: number;
      y: number;
      targetX: number;
      targetY: number;
    } | null = null;

    // Trouver le joueur qui a le ballon
    const playerWithBall = ballPosition
      ? playersOnCourt.find(
          (player) =>
            Math.abs(player.x - ballPosition.x + 22) < 5 &&
            Math.abs(player.y - ballPosition.y) < 5
        )
      : null;

    arrows.forEach((arrow) => {
      const playerToMove = playersOnCourt.find(
        (player) =>
          Math.abs(player.x - arrow.start.x) < 5 &&
          Math.abs(player.y - arrow.start.y) < 5
      );
      if (playerToMove) {
        playersToAnimate.push({
          ...playerToMove,
          targetX: arrow.end.x,
          targetY: arrow.end.y,
        });

        // Si ce joueur a le ballon, préparer l'animation du ballon
        if (playerWithBall && playerWithBall.id === playerToMove.id) {
          ballToAnimate = {
            ...ballPosition!,
            targetX: arrow.end.x + 22,
            targetY: arrow.end.y,
          };
        }
      }
    });

    // Gérer les passes (flèches en pointillés)
    if (dottedArrows.length > 0 && ballPosition) {
      const lastDottedArrow = dottedArrows[dottedArrows.length - 1];
      const ballReceiver = playersOnCourt.find(
        (player) =>
          Math.abs(player.x - lastDottedArrow.end.x) < 5 &&
          Math.abs(player.y - lastDottedArrow.end.y) < 5
      );
      if (ballReceiver) {
        const receiverAnimation = playersToAnimate.find(
          (p) => p.id === ballReceiver.id
        );
        ballToAnimate = {
          ...ballPosition,
          targetX:
            (receiverAnimation ? receiverAnimation.targetX : ballReceiver.x) +
            22,
          targetY: receiverAnimation
            ? receiverAnimation.targetY
            : ballReceiver.y,
        };
      }
    }

    if (playersToAnimate.length > 0 || ballToAnimate) {
      const newSequence: LocalAnimationSequence = {
        id: Date.now().toString(),
        players: playersToAnimate.map((player) => ({
          id: player.id,
          startX: player.x,
          startY: player.y,
          endX: player.targetX,
          endY: player.targetY,
        })),
        ball: ballToAnimate
          ? {
              startX: ballPosition!.x,
              startY: ballPosition!.y,
              endX: ballToAnimate.targetX,
              endY: ballToAnimate.targetY,
            }
          : undefined,
        comment: "", // Initialisez le commentaire comme une chaîne vide
      };

      setTimeline((prevTimeline) => [...prevTimeline, newSequence]);

      setAnimatingPlayer(playersToAnimate);
      setIsAnimating(true);

      // Animer les joueurs
      setTimeout(() => {
        setPlayersOnCourt((players) =>
          players.map((player) => {
            const animatingPlayer = playersToAnimate.find(
              (p) => p.id === player.id
            );
            return animatingPlayer
              ? {
                  ...player,
                  x: animatingPlayer.targetX,
                  y: animatingPlayer.targetY,
                }
              : player;
          })
        );

        // Animer le ballon à la fin
        if (ballToAnimate) {
          setBallPosition({
            x: ballToAnimate.targetX,
            y: ballToAnimate.targetY,
          });
        }

        setAnimatingPlayer([]);
        setIsAnimating(false);
        setArrows([]);
        setDottedArrows([]);
      }, 1000);
    }
  };

  const playTimeline = async () => {
    setIsPlayingTimeline(true);
    for (const sequence of timeline) {
      await new Promise<void>((resolve) => {
        // Appliquer les changements de position initiale
        setPlayersOnCourt((prevPlayers) =>
          prevPlayers.map((player) => {
            const animatingPlayer = sequence.players.find(
              (p) => p.id === player.id
            );
            return animatingPlayer
              ? {
                  ...player,
                  x: animatingPlayer.startX,
                  y: animatingPlayer.startY,
                }
              : player;
          })
        );
        if (sequence.ball) {
          setBallPosition({ x: sequence.ball.startX, y: sequence.ball.startY });
        }

        setTimeout(() => {
          // Appliquer les changements de position finale
          setPlayersOnCourt((prevPlayers) =>
            prevPlayers.map((player) => {
              const animatingPlayer = sequence.players.find(
                (p) => p.id === player.id
              );
              return animatingPlayer
                ? {
                    ...player,
                    x: animatingPlayer.endX,
                    y: animatingPlayer.endY,
                  }
                : player;
            })
          );
          if (sequence.ball) {
            setBallPosition({ x: sequence.ball.endX, y: sequence.ball.endY });
          }
          resolve();
        }, 1000);
      });
    }
    setIsPlayingTimeline(false);
  };

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setArrows((arrows) => arrows.slice(0, -1)); // Supprime la dernière flèche
      }, 1000); // Durée de l'animation

      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  return (
    <DndProviderWithNoSSR backend={HTML5Backend}>
      <div
        className={`h-screen bg-gray-900 overflow-hidden ${
          isPresentationMode ? "flex items-center justify-center" : ""
        }`}
      >
        {!isPresentationMode && (
          <nav className="bg-blue-800 text-white flex justify-between p-4">
            <div className="flex items-center space-x-4">
              <button
                className="back-button p-2"
                onClick={() => router.push("/")}
              >
                <ArrowLeft size={20} />
              </button>
              <input
                type="text"
                placeholder="Nom du système"
                className="bg-blue-700 rounded-md px-4 py-2 focus:outline-none"
              />
            </div>
            <div className="hidden md:flex items-center space-x-4 px-2 mr-8 capitalize">
              {user?.username}
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "ml-4 w-10 h-10",
                    userButtonAvatarBox: "w-10 h-10",
                  },
                }}
              />
            </div>
          </nav>
        )}
        <main
          className={`${
            isPresentationMode
              ? "w-full h-full relative"
              : "flex h-[calc(100vh-4rem)] overflow-hidden"
          }`}
        >
          {!isPresentationMode && (
            <div className="bg-blue-800 p-4 text-white w-1/4 overflow-y-auto overflow-x-hidden">
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Actions :</h3>
                  <div className="space-y-2">
                    <ActionButton
                      onClick={() => setSelectingPlayerForArrow(true)}
                      disabled={isCourtEmpty}
                      icon={<ArrowRight size={28} />}
                      title="Ajouter une flèche"
                      description="Cliquez pour ajouter une flèche à partir d'un joueur sur le terrain (= un déplacement)"
                      isActive={selectingPlayerForArrow}
                    />
                    <ActionButton
                      onClick={handleDottedArrowClick}
                      disabled={!ballPosition}
                      icon={<CgBorderStyleDotted size={28} />}
                      title="Ajouter une flèche en pointillés"
                      description="Cliquez pour ajouter une flèche en pointillés à partir du ballon (= une passe)"
                      isActive={selectingDottedArrow}
                    />
                    {!ballPosition && (
                      <ActionButton
                        onClick={handleBasketballClick}
                        disabled={isCourtEmpty}
                        icon={<TfiBasketball size={28} />}
                        title="Placer le ballon"
                        description="Cliquez pour placer le ballon sur un joueur"
                        isActive={selectingPlayerForBall}
                      />
                    )}
                    <ActionButton
                      onClick={handleUndo}
                      disabled={isCourtEmpty}
                      icon={<GrReturn size={28} />}
                      title="Annuler la dernière action"
                      description="Cliquez pour annuler la dernière action effectuée"
                    />
                    <ActionButton
                      onClick={handleValidateMovement}
                      disabled={
                        arrows.length === 0 && dottedArrows.length === 0
                      }
                      icon={<Check size={28} />}
                      title="Valider le mouvement"
                      description="Cliquez pour ajouter la séquence à la timeline"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Timeline :</h3>
                  <div className="space-y-2">
                    {timeline.map((sequence, index) => (
                      <div key={index} className="bg-blue-700 p-2 rounded">
                        <div>Séquence {index + 1}</div>
                        <input
                          type="text"
                          value={sequence.comment}
                          onChange={(e) => {
                            const newTimeline = [...timeline];
                            newTimeline[index].comment = e.target.value;
                            setTimeline(newTimeline);
                          }}
                          className="mt-1 w-full bg-blue-600 text-white rounded px-2 py-1"
                          placeholder="Ajouter un commentaire pour cette séquence..."
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Équipe 1 :</h3>
                  <div className="flex flex-wrap gap-2">
                    {team1Players.map((num) => (
                      <PlayerButton
                        key={num}
                        num={num}
                        team="team1"
                        onDrop={() => handlePlayerDrop(num, "team1")}
                        isOnCourt={playersOnCourt.some(
                          (player) =>
                            player.num === num && player.team === "team1"
                        )}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Équipe 2 :</h3>
                  <div className="flex flex-wrap gap-2">
                    {team2Players.map((num) => (
                      <PlayerButton
                        key={num}
                        num={num}
                        team="team2"
                        onDrop={() => handlePlayerDrop(num, "team2")}
                        isOnCourt={playersOnCourt.some(
                          (player) =>
                            player.num === num && player.team === "team2"
                        )}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Animation :</h3>
                  <div className="space-y-2">
                    <ActionButton
                      onClick={playTimeline}
                      disabled={timeline.length === 0 || isPlayingTimeline}
                      icon={<Play size={28} />}
                      title="Jouer la timeline"
                      description="Cliquez pour jouer toutes les séquences d'animation"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    Plein écran et enregistrement :
                  </h3>
                  <div className="space-y-2">
                    <ActionButton
                      onClick={togglePresentationMode}
                      icon={<Maximize size={28} />}
                      title="Mode présentation"
                      description="Passer en mode présentation pour l'enregistrement"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Instructions :</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Les joueurs bleus sont votre équipe.</li>
                    <li>Les joueurs rouges sont l'équipe adverse.</li>
                    <li>
                      Vous ne pouvez faire des passes qu'entre les joueurs
                      bleus.
                    </li>
                    <li>Utilisez les flèches pleines pour les déplacements.</li>
                    <li>Utilisez les flèches en pointillés pour les passes.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          <div
            className={`${
              isPresentationMode ? "w-full h-full" : "flex-1 bg-gray-100 p-2"
            }`}
            ref={courtRef}
          >
            <Court
              players={playersOnCourt}
              setPlayers={setPlayersOnCourt}
              onPlayerClick={handlePlayerClick}
              ballPosition={ballPosition}
              selectingPlayerForBall={selectingPlayerForBall}
              selectingPlayerForArrow={selectingPlayerForArrow}
              onCourtClick={handleCourtClick}
              arrowStart={arrowStart}
              arrows={arrows}
              selectingDottedArrow={selectingDottedArrow}
              dottedArrows={dottedArrows}
              isAnimating={isAnimating}
              animatingPlayer={animatingPlayer}
              isPlayingTimeline={isPlayingTimeline}
            />
          </div>
          {isPresentationMode && (
            <div className="absolute top-4 left-4 flex space-x-4">
              {!isRecording ? (
                <ActionButton
                  onClick={startRecording}
                  icon={<Video size={28} />}
                  title="Démarrer l'enregistrement"
                  description="Cliquez pour commencer à enregistrer votre système en vidéo"
                />
              ) : (
                <ActionButton
                  onClick={stopRecording}
                  icon={<StopCircle size={28} />}
                  title="Arrêter l'enregistrement"
                  description="Cliquez pour arrêter l'enregistrement et télécharger la vidéo"
                  isActive={true}
                />
              )}
              <ActionButton
                onClick={playTimeline}
                disabled={timeline.length === 0 || isPlayingTimeline}
                icon={<Play size={28} />}
                title="Jouer la timeline"
                description="Cliquez pour jouer toutes les séquences d'animation"
              />
            </div>
          )}
        </main>
        {isPresentationMode && (
          <button
            className="absolute top-4 right-4 bg-blue-500 text-white p-2 rounded"
            onClick={togglePresentationMode}
          >
            <Minimize size={20} />
          </button>
        )}
      </div>
    </DndProviderWithNoSSR>
  );
};

export default CreateSystem;
