import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Play,
  Pause,
  MousePointer,
} from "react-feather";
import { TfiBasketball } from "react-icons/tfi";
import { CgBorderStyleDotted } from "react-icons/cg";
import { useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import dynamic from "next/dynamic";
import { UserButton, useUser } from "@clerk/nextjs";
import { GrReturn } from "react-icons/gr";
import { motion } from "framer-motion";

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
          <motion.div
            key={player.id}
            style={{
              position: "absolute",
              left: player.x,
              top: player.y,
              transform: "translate(-50%, -50%)",
            }}
            animate={
              isAnimating && animatingPlayer?.id === player.id
                ? { x: animatingPlayer.targetX, y: animatingPlayer.targetY }
                : {}
            }
            transition={{ duration: 1, ease: "linear" }}
            onClick={() => onPlayerClick(player)}
          >
            <PlayerButton
              num={player.num}
              team={player.team}
              isOnCourt
              isSelectable={selectingPlayerForBall || selectingPlayerForArrow}
              onClick={() =>
                (selectingPlayerForBall || selectingPlayerForArrow) &&
                onPlayerClick(player)
              }
            />
          </motion.div>
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
            className="absolute"
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
        className={`p-2 rounded-lg flex items-center justify-center w-full transition-colors ${
          disabled
            ? "bg-blue-600 opacity-50 cursor-not-allowed"
            : isActive
            ? "bg-yellow-500 hover:bg-yellow-400 border-yellow-300"
            : "bg-blue-600 hover:bg-blue-500"
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

  const handlePlayerClickForBall = (player: any) => {
    if (selectingPlayerForBall) {
      const ballX = player.x + 22;
      const ballY = player.y;
      setBallPosition({ x: ballX, y: ballY });
      setSelectingPlayerForBall(false);
      addToHistory("ball");
    }
  };

  const handleArrowClick = () => {
    setSelectingPlayerForArrow(true);
    setSelectingPlayerForBall(false);
    setArrowStart(null);
  };

  const handlePlayerClick = (player: any) => {
    if (selectingPlayerForBall) {
      handlePlayerClickForBall(player);
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
      setDottedArrows([
        ...dottedArrows,
        { start: ballPosition, end: position },
      ]);
      setSelectingDottedArrow(false);
      addToHistory("dottedArrow");
    }
  };

  const handleDottedArrowClick = () => {
    if (ballPosition) {
      setSelectingDottedArrow(true);
      setSelectingPlayerForArrow(false);
      setSelectingPlayerForBall(false);
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
    if (arrows.length > 0) {
      const lastArrow = arrows[arrows.length - 1];
      const playerToMove = playersOnCourt.find(
        (player) =>
          player.x === lastArrow.start.x && player.y === lastArrow.start.y
      );

      if (playerToMove) {
        setAnimatingPlayer({
          ...playerToMove,
          targetX: lastArrow.end.x - lastArrow.start.x,
          targetY: lastArrow.end.y - lastArrow.start.y,
        });
        setIsAnimating(true);
      }
    }
  };

  useEffect(() => {
    if (isAnimating && animatingPlayer) {
      const timer = setTimeout(() => {
        setPlayersOnCourt((players) =>
          players.map((player) =>
            player.id === animatingPlayer.id
              ? {
                  ...player,
                  x: player.x + animatingPlayer.targetX,
                  y: player.y + animatingPlayer.targetY,
                }
              : player
          )
        );
        setIsAnimating(false);
        setAnimatingPlayer(null);
        setArrows((arrows) => arrows.slice(0, -1)); // Supprime la dernière flèche
      }, 1000); // Durée de l'animation

      return () => clearTimeout(timer);
    }
  }, [isAnimating, animatingPlayer]);

  return (
    <DndProviderWithNoSSR backend={HTML5Backend}>
      <div className="h-screen bg-gray-900 overflow-hidden">
        <nav className="bg-blue-800 text-white flex justify-between p-4">
          <div className="flex items-center space-x-4">
            <button className="back-button p-2">
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
        <main className="flex h-full overflow-hidden">
          <div className="bg-blue-800 p-4 text-white w-1/4 space-y-8 h-full">
            <div>
              <h3 className="text-xl font-semibold mb-4">Actions :</h3>
              <div className="space-y-2">
                <ActionButton
                  onClick={handleArrowClick}
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
                  disabled={arrows.length === 0}
                  icon={<Play size={28} />}
                  title="Valider le mouvement"
                  description="Cliquez pour animer le déplacement du joueur"
                />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Équipe 1 :</h3>
              <div className="flex space-x-2">
                {team1Players.map((num) => (
                  <PlayerButton
                    key={num}
                    num={num}
                    team="team1"
                    onDrop={() => handlePlayerDrop(num, "team1")}
                    isOnCourt={playersOnCourt.some(
                      (player) => player.num === num && player.team === "team1"
                    )}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Équipe 2 :</h3>
              <div className="flex space-x-2">
                {team2Players.map((num) => (
                  <PlayerButton
                    key={num}
                    num={num}
                    team="team2"
                    onDrop={() => handlePlayerDrop(num, "team2")}
                    isOnCourt={playersOnCourt.some(
                      (player) => player.num === num && player.team === "team2"
                    )}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Animation :</h3>
              <div className="space-y-2">
                <button className="bg-blue-600 p-2 rounded-lg flex items-center justify-center w-full hover:bg-blue-500 transition-colors">
                  <Play size={28} />
                </button>
                <button className="bg-blue-600 p-2 rounded-lg flex items-center justify-center w-full hover:bg-blue-500 transition-colors">
                  <Pause size={28} />
                </button>
                <button className="bg-blue-600 p-2 rounded-lg flex items-center justify-center w-full hover:bg-blue-500 transition-colors">
                  <RotateCw size={28} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-gray-100 p-2 h-full">
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
            />
          </div>
        </main>
      </div>
    </DndProviderWithNoSSR>
  );
};

export default CreateSystem;
