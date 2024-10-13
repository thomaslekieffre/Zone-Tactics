import React, { useState } from "react";
import { ArrowLeft, ArrowRight, RotateCw, Play, Pause } from "react-feather";
import { TfiBasketball } from "react-icons/tfi";
import { CgBorderStyleDotted } from "react-icons/cg";
import { useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import dynamic from "next/dynamic";
import { UserButton, useUser } from "@clerk/nextjs";
import { GrReturn } from "react-icons/gr";

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

const Court = ({
  players,
  setPlayers,
  onPlayerClick,
  ballPosition,
  selectingPlayerForBall,
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
    >
      <div
        className="absolute inset-0 bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: "url('/img/basket_court.png')" }}
      >
        {players.map((player: any) => (
          <div
            key={player.id}
            style={{
              position: "absolute",
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
              isSelectable={selectingPlayerForBall}
              onClick={() => selectingPlayerForBall && onPlayerClick(player)}
            />
          </div>
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
      </div>
    </div>
  );
};

const DndProviderWithNoSSR = dynamic(
  () => import("react-dnd").then((mod) => mod.DndProvider),
  { ssr: false }
);

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

  const handlePlayerDrop = (num: number, team: string) => {
    if (team === "team1") {
      setTeam1Players((prevPlayers) => prevPlayers.filter((p) => p !== num));
    } else {
      setTeam2Players((prevPlayers) => prevPlayers.filter((p) => p !== num));
    }
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
    }
  };

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
                <button className="bg-blue-600 p-2 rounded-lg flex items-center justify-center w-full hover:bg-blue-500 transition-colors">
                  <ArrowRight size={28} />
                </button>
                <button className="bg-blue-600 p-2 rounded-lg flex items-center justify-center w-full hover:bg-blue-500 transition-colors">
                  <CgBorderStyleDotted size={28} />
                </button>
                <button className="bg-blue-600 p-2 rounded-lg flex items-center justify-center w-full hover:bg-blue-500 transition-colors">
                  <RotateCw size={28} />
                </button>
                {!ballPosition && (
                  <button
                    className={`bg-blue-600 p-2 rounded-lg flex items-center justify-center w-full hover:bg-blue-500 transition-colors ${
                      selectingPlayerForBall ? "bg-yellow-500" : ""
                    }`}
                    onClick={handleBasketballClick}
                  >
                    <TfiBasketball size={28} />
                  </button>
                )}
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
          </div>

          <div className="flex-1 bg-gray-100 p-2 h-full">
            <Court
              players={playersOnCourt}
              setPlayers={setPlayersOnCourt}
              onPlayerClick={handlePlayerClickForBall}
              ballPosition={ballPosition}
              selectingPlayerForBall={selectingPlayerForBall}
            />
          </div>
        </main>
      </div>
    </DndProviderWithNoSSR>
  );
};

export default CreateSystem;
