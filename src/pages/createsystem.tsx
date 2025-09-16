import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Play,
  Pause,
  MousePointer,
  Check,
  Video,
  StopCircle,
  Maximize,
  Minimize,
  Mic,
  MicOff,
  Trash2,
  Share2,
  BookOpen,
  Target,
  User,
  X,
  Menu,
} from "react-feather";
import { TfiBasketball } from "react-icons/tfi";

// Placeholder for calculatePlayerSize function
const calculatePlayerSize = () => {
  return 50; // Default size, adjust as needed
};

// Placeholder variables

// Adjusting playerSize to be an object if width and height are required properties
const playerSize = { width: 50, height: 50 }; // Adjust as necessary
// Default player size, adjust as needed
const BASKET_SIZE = 30; // Default basket size, adjust as needed

import { CgBorderStyleDotted } from "react-icons/cg";
import { useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import dynamic from "next/dynamic";
import { UserButton, useUser } from "@clerk/nextjs";
import { GrReturn } from "react-icons/gr";
import { useRouter } from "next/router";
import { url } from "inspector";
import { useSubscription } from "../hooks/useSubscription";
import { withPremiumAccess } from "@/components/withSubscription";
import { DndProvider } from "react-dnd";
import Link from "next/link";
import { useIsMobile } from "../hooks/useIsMobile";

// Adjusting interfaces to include `isDotted` and `strokeWidth` properties if they are missing
interface CustomTypeWithStroke {
  start: { x: number; y: number };
  end: { x: number; y: number };
  strokeWidth?: number;
  color: string;
  isDotted?: boolean;
}

export type LocalAnimationSequence = {
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
  audioComment?: string;
  shoot?: {
    playerId: string;
    targetX: number;
    targetY: number;
  };
};

interface CreateSystemProps {
  initialData?: any;
  readOnly?: boolean;
  systemName?: string;
  isMobile?: boolean;
}

const BASKET_RELATIVE_X = 0.92;
const BASKET_RELATIVE_Y = 0.5;

const calculateBasketPosition = (courtWidth: number, courtHeight: number) => ({
  x: courtWidth * 0.92,
  y: courtHeight * 0.5,
});

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
const arrowWidth = playerSize.width * 0.1; // L'épaisseur des flèches est proportionnelle

const Arrow = ({
  start,
  end,
  playerRadius = 24,
  isDotted = false,
  strokeWidth,
  color,
}: {
  start: { x: number; y: number };
  end: { x: number; y: number };
  playerRadius?: number;
  isDotted?: boolean;
  strokeWidth?: number;
  color?: string;
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

const Player = ({
  num,
  team,
  position,
  onClick,
  isAnimating,
  playerSize,
}: {
  num: number;
  team: string;
  position: { x: number; y: number };
  onClick: () => void;
  isAnimating?: boolean;
  playerSize: { width: number; height: number; fontSize: number };
}) => {
  return (
    <div
      className={`absolute cursor-pointer transition-all duration-300 ${
        isAnimating ? "transition-transform duration-1000" : ""
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${playerSize.width}px`,
        height: `${playerSize.height}px`,
        transform: "translate(-50%, -50%)",
      }}
      onClick={onClick}
    >
      <div
        className={`rounded-full flex items-center justify-center ${
          team === "team1" ? "bg-blue-500" : "bg-red-500"
        }`}
        style={{
          width: "100%",
          height: "100%",
          fontSize: `${playerSize.fontSize}px`,
        }}
      >
        {num}
      </div>
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
  width,
  height,
  readOnly,
  selectingShoot,
  isMobile,
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
      className="bg-orange-500 rounded-lg relative court-container"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundImage: "url('/img/basket_court.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        pointerEvents: readOnly ? "none" : "auto",
      }}
      onClick={(e) => {
        if (!readOnly) {
          const courtRect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - courtRect.left;
          const y = e.clientY - courtRect.top;
          onCourtClick({ x, y });
        }
      }}
    >
      <div
        className="absolute inset-0 bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: "url('/img/basket_court.png')" }}
      >
        {!isMobile &&
          players.map((player: any) => (
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
            key={index}
            start={arrow.start}
            end={arrow.end}
            strokeWidth={arrowWidth}
            color="yellow"
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
              width: `${playerSize.width * 0.7}px`, // Le ballon est légèrement plus petit que les joueurs
              height: `${playerSize.height * 0.7}px`,
            }}
          >
            <TfiBasketball size="100%" color="orange" />
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

        {selectingShoot && (
          <div
            className="absolute animate-pulse"
            style={{
              left: `${BASKET_RELATIVE_X * 100}%`,
              top: `${BASKET_RELATIVE_Y * 100}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="w-8 h-8 rounded-full bg-yellow-400 opacity-50" />
            <div className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-yellow-600 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
        )}
      </div>
    </div>
  );
};

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

const COURT_WIDTH = 1200;
const COURT_HEIGHT = 640;
const COURT_ASPECT_RATIO = COURT_WIDTH / COURT_HEIGHT;

// Composant pour l'affichage mobile en mode portrait
const MobileLandscapePrompt = () => (
  <div className="flex items-center justify-center h-screen bg-gray-900 text-white p-4">
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">
        Veuillez tourner votre appareil
      </h1>
      <p>
        Pour une meilleure expérience, utilisez votre appareil en mode
        paysage.
      </p>
    </div>
  </div>
);

// Composant pour l'affichage mobile optimisé
const MobileCreateSystem = ({
  subscriptionStatus,
  user,
  router
}: {
  subscriptionStatus: any;
  user: any;
  router: any;
}) => {
  if (subscriptionStatus === "loading") {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-xl">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Connexion requise</h1>
          <p className="mb-4">Vous devez être connecté pour accéder au créateur de tactiques.</p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors"
          >
            Retour à l&apos;accueil
          </button>
        </div>
      </div>
    );
  }

  if (subscriptionStatus !== "active") {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Abonnement requis</h1>
          <p className="mb-4">Un abonnement actif est nécessaire pour créer des tactiques.</p>
          <div className="space-y-3">
            <button
              onClick={() => router.push("/pricing")}
              className="block w-full bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors"
            >
              Voir les abonnements
            </button>
            <button
              onClick={() => router.push("/library")}
              className="block w-full bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-lg transition-colors"
            >
              Voir ma bibliothèque
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* En-tête mobile */}
      <div className="bg-gray-800 p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold">Créateur de Tactiques</h1>
          <button
            onClick={() => router.push("/library")}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
          >
            <BookOpen size={20} />
          </button>
        </div>
      </div>

      {/* Message d'information mobile */}
      <div className="p-4">
        <div className="bg-blue-900 bg-opacity-50 border border-blue-600 rounded-lg p-4 mb-4">
          <h2 className="text-lg font-bold mb-2 text-blue-300">Mode Mobile Simplifié</h2>
          <p className="text-sm mb-3">
            Sur mobile, vous pouvez visualiser vos tactiques existantes.
            Pour créer et éditer des tactiques, utilisez un ordinateur pour une expérience complète.
          </p>
          <div className="text-xs text-gray-300">
            💡 Conseil : Tournez votre appareil en mode paysage pour une meilleure visualisation
          </div>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={() => router.push("/library")}
            className="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg border border-gray-600 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <BookOpen size={24} className="text-blue-400" />
              <div className="text-left">
                <h3 className="font-semibold">Ma Bibliothèque</h3>
                <p className="text-sm text-gray-400">Voir mes tactiques sauvegardées</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => window.location.href = `${window.location.origin}/createsystem`}
            className="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg border border-gray-600 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Target size={24} className="text-green-400" />
              <div className="text-left">
                <h3 className="font-semibold">Version Desktop</h3>
                <p className="text-sm text-gray-400">Ouvrir en mode création complète</p>
              </div>
            </div>
          </button>

          <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
            <div className="flex items-center space-x-3">
              <User size={24} className="text-purple-400" />
              <div className="text-left">
                <h3 className="font-semibold">Compte</h3>
                <p className="text-sm text-gray-400">{user.emailAddresses?.[0]?.emailAddress || user.username}</p>
                <p className="text-xs text-green-400">Abonnement actif</p>
              </div>
            </div>
          </div>
        </div>

        {/* Aide */}
        <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-600">
          <h3 className="font-semibold mb-2">Besoin d&apos;aide ?</h3>
          <p className="text-sm text-gray-400 mb-3">
            Zone Tactics est optimisé pour desktop. Pour créer des tactiques détaillées,
            nous recommandons d&apos;utiliser un ordinateur ou une tablette.
          </p>
          <button
            onClick={() => window.open("mailto:contactdev@zonetactics.fr", "_blank")}
            className="text-blue-400 text-sm hover:text-blue-300 transition-colors"
          >
            Contacter le support →
          </button>
        </div>
      </div>
    </div>
  );
};

const CreateSystem: React.FC<CreateSystemProps> = ({
  initialData,
  readOnly = false,
  systemName: initialSystemName = "",
  isMobile = false,
}) => {
  // Tous les hooks au début du composant
  const subscriptionStatus = useSubscription();
  const { user } = useUser();
  const router = useRouter();
  const handleGoBack = useCallback(() => {
    window.location.href = "/";
  }, []);

  const [systemName, setSystemName] = useState(initialSystemName);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLandscape, setIsLandscape] = useState(true);

  const [playersOnCourt, setPlayersOnCourt] = useState<
    Array<{ id: string; num: number; team: string; x: number; y: number }>
  >(initialData?.playersOnCourt || []);

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

  const [timeline, setTimeline] = useState<LocalAnimationSequence[]>(
    initialData?.timeline || []
  );

  const [currentSequenceIndex, setCurrentSequenceIndex] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedPlayer, setDraggedPlayer] = useState<any>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [courtDimensions, setCourtDimensions] = useState({
    width: COURT_WIDTH,
    height: COURT_HEIGHT,
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSelectingShootTarget, setIsSelectingShootTarget] = useState(false);
  const [selectedPlayerForShoot, setSelectedPlayerForShoot] = useState<
    string | null
  >(null);
  const [showPlayerNumbers, setShowPlayerNumbers] = useState(true);
  const [canvasScale, setCanvasScale] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sequenceComment, setSequenceComment] = useState("");
  const [showSequenceModal, setShowSequenceModal] = useState(false);
  const [tempPlayerPositions, setTempPlayerPositions] = useState<
    Array<{ id: string; x: number; y: number }>
  >([]);

  // États additionnels nécessaires pour le composant
  const [isPlayingTimeline, setIsPlayingTimeline] = useState(false);
  const courtRef = useRef<HTMLDivElement>(null);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [courtSize, setCourtSize] = useState({
    width: COURT_WIDTH,
    height: COURT_HEIGHT,
  });
  const courtContainerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [audioRecorder, setAudioRecorder] = useState<MediaRecorder | null>(null);
  const [currentRecordingIndex, setCurrentRecordingIndex] = useState<number | null>(null);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [initialPlayersPosition, setInitialPlayersPosition] = useState(playersOnCourt);
  const [initialBallPosition, setInitialBallPosition] = useState(ballPosition);
  const [initialSetup, setInitialSetup] = useState<{
    players: typeof playersOnCourt;
    ball: typeof ballPosition;
  } | null>(null);
  const [selectingShoot, setSelectingShoot] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);

    return () => {
      window.removeEventListener("resize", checkOrientation);
    };
  }, []);

  // Fonction de calcul de la taille du terrain
  const updateCourtSize = useCallback(() => {
    if (courtContainerRef.current) {
      const containerRect = courtContainerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const containerHeight = containerRect.height;

      const aspectRatio = COURT_ASPECT_RATIO;
      let width, height;

      if (containerWidth / containerHeight > aspectRatio) {
        height = containerHeight;
        width = height * aspectRatio;
      } else {
        width = containerWidth;
        height = width / aspectRatio;
      }

      setCourtSize({ width, height });
    }
  }, []);

  // Autres useEffect nécessaires
  useEffect(() => {
    updateCourtSize();
    window.addEventListener("resize", updateCourtSize);
    return () => window.removeEventListener("resize", updateCourtSize);
  }, [updateCourtSize]);

  useEffect(() => {
    if (isMounted) {
      updateCourtSize();
    }
  }, [isMounted, updateCourtSize]);

  useEffect(() => {
    updateCourtSize();
  }, [isPresentationMode, updateCourtSize]);

  useEffect(() => {
    if (initialData) {
      console.log("Données initiales reçues:", initialData);
      setTimeline(initialData.timeline);
      setPlayersOnCourt(initialData.playersOnCourt);
      setBallPosition(initialData.ball || null);
      setInitialSetup({
        players: initialData.playersOnCourt,
        ball: initialData.ball || null,
      });
      setArrows([]);
      setDottedArrows([]);
      setActionHistory([]);
    }
  }, [initialData]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Effet pour gérer l'animation
  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setArrows((arrows) => arrows.slice(0, -1));
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  // Callback pour aller à la bibliothèque
  const goToLibrary = useCallback(() => {
    window.location.href = "/library";
  }, []);

  // Retours conditionnels après tous les hooks
  if (isMobile && !isLandscape) {
    return <MobileLandscapePrompt />;
  }

  if (isMobile && !readOnly) {
    return <MobileCreateSystem subscriptionStatus={subscriptionStatus} user={user} router={router} />;
  }

  const removeSequence = () => {
    if (timeline.length === 0) return;

    const lastSequence = timeline[timeline.length - 1];

    setTimeline((prevTimeline) => prevTimeline.slice(0, -1));

    setPlayersOnCourt((prevPlayers) =>
      prevPlayers.map((player) => {
        const previousPosition = lastSequence.players.find(
          (p) => p.id === player.id
        );
        return previousPosition
          ? {
              ...player,
              x: previousPosition.startX,
              y: previousPosition.startY,
            }
          : player;
      })
    );

    if (lastSequence.ball) {
      setBallPosition({
        x: lastSequence.ball.startX,
        y: lastSequence.ball.startY,
      });
    }

    if (timeline.length === 1) {
      setPlayersOnCourt([]);
      setTeam1Players([1, 2, 3, 4, 5]);
      setTeam2Players([1, 2, 3, 4, 5]);

      setBallPosition(null);

      setInitialSetup(null);
    }
  };

  const calculateCourtSize = () => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const aspectRatio = 1.6; // Ratio largeur/hauteur du terrain

    let width, height;
    if (isMobile) {
      if (screenWidth / screenHeight > aspectRatio) {
        height = screenHeight * 0.8; // Smaller height for better mobile fit
        width = height * aspectRatio;
      } else {
        width = screenWidth * 0.8;
        height = width / aspectRatio;
      }
    } else {
      // Default desktop size
      width = 800;
      height = 500;
    }
    return { width, height };
  };

  const calculatePlayerSize = (courtWidth: number, courtHeight: number) => {
    const baseSize = Math.min(courtWidth, courtHeight);
    return {
      width: baseSize * (isMobile ? 0.08 : 0.05), // Adjusted for better visibility on mobile
      height: baseSize * (isMobile ? 0.08 : 0.05),
      fontSize: baseSize * (isMobile ? 0.04 : 0.03), // Slightly larger font on mobile
    };
  };

  // Fonctions utilitaires

  const togglePresentationMode = () => {
    setIsPresentationMode(!isPresentationMode);
    setTimeout(updateCourtSize, 0);
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
    setInitialPlayersPosition(playersOnCourt);
    if (timeline.length === 0) {
      setInitialSetup((prev) => ({
        players: playersOnCourt,
        ball: prev ? prev.ball : ballPosition,
      }));
    }
  };

  const handleBasketballClick = () => {
    if (ballPosition) {
      setBallPosition(null);
    } else {
      setSelectingPlayerForBall(true);
    }
    if (timeline.length === 0) {
      setInitialSetup((prev) => ({
        players: prev ? prev.players : playersOnCourt,
        ball: ballPosition,
      }));
    }
  };

  const handlePlayerClick = (player: any) => {
    if (selectingPlayerForBall) {
      if (player.team === "team1") {
        const ballX = player.x + 22;
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
          if (player.team !== "team1") return nearest;
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

  // Ajoutez cette fonction utilitaire
  const findPlayerWithBall = (
    players: any[],
    ballPos: { x: number; y: number } | null
  ) => {
    if (!ballPos) return null;
    return players.find(
      (player) =>
        Math.abs(player.x - ballPos.x + 22) < 5 &&
        Math.abs(player.y - ballPos.y) < 5
    );
  };

  const checkAllPlayersAndBallPresent = () => {
    const allTeam1Present = team1Players.every((num) =>
      playersOnCourt.some((p) => p.team === "team1" && p.num === num)
    );
    const allTeam2Present = team2Players.every((num) =>
      playersOnCourt.some((p) => p.team === "team2" && p.num === num)
    );
    return allTeam1Present && allTeam2Present && ballPosition !== null;
  };

  const handleValidateMovement = () => {
    if (!checkAllPlayersAndBallPresent()) {
      alert(
        "Tous les joueurs et le ballon doivent être sur le terrain pour valider une séquence."
      );
      return;
    }

    const hasMovement =
      arrows.length > 0 || dottedArrows.length > 0 || selectingShoot;
    if (!hasMovement) {
      alert("Aucun mouvement à valider.");
      return;
    }

    const newSequence: LocalAnimationSequence = {
      id: Date.now().toString(),
      players: playersOnCourt.map((player) => ({
        id: player.id,
        startX: player.x,
        startY: player.y,
        endX: player.x,
        endY: player.y,
      })),
      ball: ballPosition
        ? {
            startX: ballPosition.x,
            startY: ballPosition.y,
            endX: ballPosition.x,
            endY: ballPosition.y,
          }
        : undefined,
      comment: "",
      audioComment: undefined,
    };

    // Trouver le joueur qui a le ballon initialement
    const initialPlayerWithBall = findPlayerWithBall(
      playersOnCourt,
      ballPosition
    );

    // Mettre à jour les positions des joueurs
    arrows.forEach((arrow) => {
      const player = newSequence.players.find(
        (p) => p.startX === arrow.start.x && p.startY === arrow.start.y
      );
      if (player) {
        player.endX = arrow.end.x;
        player.endY = arrow.end.y;
      }
    });

    // Mettre à jour la position du ballon
    if (dottedArrows.length > 0 && newSequence.ball) {
      const lastDottedArrow = dottedArrows[dottedArrows.length - 1];
      const receiverPlayer = newSequence.players.find(
        (p) =>
          p.startX === lastDottedArrow.end.x &&
          p.startY === lastDottedArrow.end.y
      );
      if (receiverPlayer) {
        newSequence.ball.endX = receiverPlayer.endX + 22; // Ajuster en fonction de la nouvelle position du joueur
        newSequence.ball.endY = receiverPlayer.endY;
      } else {
        newSequence.ball.endX = lastDottedArrow.end.x + 22;
        newSequence.ball.endY = lastDottedArrow.end.y;
      }
    } else if (initialPlayerWithBall) {
      // Si pas de passe, mais un joueur avait le ballon, mettre à jour la position du ballon
      const updatedPlayerWithBall = newSequence.players.find(
        (p) => p.id === initialPlayerWithBall.id
      );
      if (updatedPlayerWithBall && newSequence.ball) {
        newSequence.ball.endX = updatedPlayerWithBall.endX + 22;
        newSequence.ball.endY = updatedPlayerWithBall.endY;
      }
    }

    // Gérer le tir
    if (selectingShoot && ballPosition) {
      const basketPosition = calculateBasketPosition(
        courtSize.width,
        courtSize.height
      );
      newSequence.shoot = {
        playerId: initialPlayerWithBall?.id ?? "",
        targetX: basketPosition.x,
        targetY: basketPosition.y,
      };
      if (newSequence.ball) {
        newSequence.ball.endX = basketPosition.x;
        newSequence.ball.endY = basketPosition.y;
      }
    }

    setTimeline((prevTimeline) => [...prevTimeline, newSequence]);

    // Déclenchement de l'animation
    setIsAnimating(true);
    setTimeout(() => {
      setPlayersOnCourt(
        newSequence.players.map((p) => ({
          ...playersOnCourt.find((player) => player.id === p.id)!,
          x: p.endX,
          y: p.endY,
        }))
      );
      if (newSequence.ball) {
        setBallPosition({
          x: newSequence.ball.endX,
          y: newSequence.ball.endY,
        });
      }
      setIsAnimating(false);
      setArrows([]);
      setDottedArrows([]);
      setSelectingShoot(false);
    }, 1000);
  };

  const playTimeline = async () => {
    setIsPlayingTimeline(true);

    // Définir la position initiale
    if (initialSetup) {
      setPlayersOnCourt(initialSetup.players);
      setBallPosition(initialSetup.ball);

      // Attendre un court instant pour que la position initiale soit visible
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    for (const sequence of timeline) {
      // Positions de départ de la séquence
      setPlayersOnCourt(
        sequence.players.map((p) => ({
          ...playersOnCourt.find((player) => player.id === p.id)!,
          x: p.startX,
          y: p.startY,
        }))
      );

      if (sequence.ball) {
        setBallPosition({ x: sequence.ball.startX, y: sequence.ball.startY });
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      // Animation
      const animationDuration = 1000;
      const startTime = Date.now();

      const animate = () => {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / animationDuration, 1);

        // Animer les joueurs
        const updatedPlayers = sequence.players.map((player) => {
          const originalPlayer = playersOnCourt.find((p) => p.id === player.id);
          return {
            ...originalPlayer!,
            x: player.startX + (player.endX - player.startX) * progress,
            y: player.startY + (player.endY - player.startY) * progress,
          };
        });
        setPlayersOnCourt(updatedPlayers);

        // Animer le ballon
        if (sequence.ball) {
          const ballX =
            sequence.ball.startX +
            (sequence.ball.endX - sequence.ball.startX) * progress;
          const ballY =
            sequence.ball.startY +
            (sequence.ball.endY - sequence.ball.startY) * progress;
          setBallPosition({ x: ballX, y: ballY });
        }

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);

      await new Promise((resolve) =>
        setTimeout(resolve, animationDuration + 500)
      );
    }

    setIsPlayingTimeline(false);
  };

  const startAudioRecording = async (index: number) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        audioChunks.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);

        const newTimeline = [...timeline];
        newTimeline[index].audioComment = audioUrl;
        setTimeline(newTimeline);
      };

      setAudioRecorder(recorder);
      setIsRecordingAudio(true);
      setCurrentRecordingIndex(index);
      recorder.start();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement audio:", error);
      alert(
        "Impossible d'accéder au microphone. Veuillez vérifier les permissions."
      );
    }
  };

  const stopAudioRecording = () => {
    if (audioRecorder && audioRecorder.state === "recording") {
      audioRecorder.stop();
      setIsRecordingAudio(false);
      setCurrentRecordingIndex(null);
    }
  };

  const deleteAudioComment = (index: number) => {
    const newTimeline = [...timeline];
    if (newTimeline[index].audioComment) {
      URL.revokeObjectURL(newTimeline[index].audioComment);
      delete newTimeline[index].audioComment;
      setTimeline(newTimeline);
    }
  };

  const generateShareLink = async () => {
    if (subscriptionStatus !== "active") {
      alert(
        "Le partage de systèmes est réservé aux abonnés premium. Veuillez vous abonner pour utiliser cette fonctionnalité."
      );
      return;
    }
    if (playersOnCourt.length === 0) {
      alert("Tous les joueurs doivent être sur le terrain.");
      return;
    }
    if (!ballPosition) {
      alert("Le ballon doit être présent.");
      return;
    }
    if (timeline.length === 0) {
      alert("Il doit y avoir au moins une séquence dans la timeline.");
      return;
    }

    if (!systemName.trim()) {
      alert("Veuillez donner un nom à votre système avant de le partager.");
      return;
    }

    const systemData = {
      name: systemName,
      timeline,
      playersOnCourt,
    };

    try {
      const response = await fetch("/api/share-system", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(systemData),
      });

      if (response.ok) {
        const { id, url, userId } = await response.json();
        let idUrl: string = "";
        const regex = /user-systems\/[^\/]+\/([a-zA-Z0-9-]+)\.json/;
        const match = url.match(regex);

        if (match && match[1]) {
          idUrl = match[1];
          console.log(idUrl);
        } else {
          console.error("ID non trouvé dans l'URL.");
        }
        const link = `${window.location.origin}/shared-system/${userId}.${idUrl}`;
        setShareLink(link);

        alert("Système partagé et ajouté à votre bibliothèque !");
      } else {
        alert("Erreur lors de la génération du lien de partage.");
      }
    } catch (error) {
      console.error("Erreur lors du partage du système:", error);
      alert("Une erreur est survenue lors du partage du système.");
    }
  };

  const copyShareLink = () => {
    if (shareLink) {
      navigator.clipboard
        .writeText(shareLink)
        .then(() => alert("Lien copié dans le presse-papiers !"))
        .catch((err) => console.error("Erreur lors de la copie du lien:", err));
    }
  };

  const MobileSidebar = ({
    isOpen,
    onClose,
    systemName,
    timeline,
    playTimeline,
    isPlayingTimeline,
    togglePresentationMode,
  }: {
    isOpen: boolean;
    onClose: () => void;
    systemName: string;
    timeline: LocalAnimationSequence[];
    playTimeline: () => void;
    isPlayingTimeline: boolean;
    togglePresentationMode: () => void;
  }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-y-0 left-0 w-3/4 bg-blue-800 text-white z-50 overflow-y-auto">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{systemName}</h2>
            <button onClick={onClose} className="p-2">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Contrôles</h3>
              <div className="space-y-2">
                <ActionButton
                  onClick={playTimeline}
                  disabled={timeline.length === 0 || isPlayingTimeline}
                  icon={<Play size={24} />}
                  title="Jouer l'animation"
                  description="Cliquez pour lancer l'animation"
                />
                <ActionButton
                  onClick={togglePresentationMode}
                  icon={<Maximize size={24} />}
                  title="Mode plein écran"
                  description="Cliquez pour passer en mode plein écran"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Séquences</h3>
              <div className="space-y-2">
                {timeline.map((sequence, index) => (
                  <div key={index} className="bg-blue-700 p-2 rounded">
                    <div className="flex justify-between items-center">
                      <span>Séquence {index + 1}</span>
                    </div>
                    {sequence.comment && (
                      <p className="mt-1 text-sm">{sequence.comment}</p>
                    )}
                    {sequence.audioComment && (
                      <audio
                        src={sequence.audioComment}
                        controls
                        className="w-full h-8 mt-2"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const MobileMenuButton = ({ onClick }: { onClick: () => void }) => (
    <button
      onClick={onClick}
      className="fixed top-4 left-4 z-50 bg-blue-600 p-2 rounded-full shadow-lg"
    >
      <Menu size={24} color="white" />
    </button>
  );
  const playerSize = calculatePlayerSize(courtSize.width, courtSize.height);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen bg-gray-900 overflow-hidden">
        {isMobile ? (
          <>
            <MobileMenuButton onClick={() => setIsSidebarOpen(true)} />
            <MobileSidebar
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              systemName={systemName}
              timeline={timeline}
              playTimeline={playTimeline}
              isPlayingTimeline={isPlayingTimeline}
              togglePresentationMode={togglePresentationMode}
            />
            <div className="h-full w-full flex items-center justify-center">
              <div
                ref={courtContainerRef}
                className="relative"
                style={{
                  width: `${courtSize.width}px`,
                  height: `${courtSize.height}px`,
                  maxWidth: "100%",
                  maxHeight: "100%",
                }}
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
                  width={courtSize.width}
                  height={courtSize.height}
                  readOnly={readOnly}
                  selectingShoot={selectingShoot}
                  isMobile={isMobile}
                  isLandscape={isLandscape}
                  playerSize={playerSize}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            {!isPresentationMode && (
              <nav className="bg-blue-800 text-white flex justify-between p-4">
                <div className="flex items-center space-x-4">
                  <button onClick={handleGoBack} className="back-button p-2">
                    <ArrowLeft size={20} />
                  </button>
                  {readOnly ? (
                    <input
                      type="text"
                      value={systemName}
                      readOnly
                      className="bg-blue-700 text-white rounded px-2 py-1 cursor-not-allowed"
                    />
                  ) : (
                    <input
                      type="text"
                      value={systemName}
                      onChange={(e) => {
                        if (e.target.value.length <= 22) {
                          setSystemName(e.target.value);
                        }
                      }}
                      placeholder="Nom du système"
                      className="bg-blue-700 text-white rounded px-2 py-1"
                      maxLength={22}
                    />
                  )}
                </div>
                <div className="hidden md:flex items-center space-x-4 px-2 mr-8 capitalize gap-2">
                  {user?.username}
                  <Link
                    href="/profile"
                    className="text-white hover:text-blue-300 transition-colors"
                  >
                    <User size={20} />
                  </Link>
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
              className={`flex ${
                isMobile ? "flex-col" : "flex-row"
              } h-screen bg-gray-900`}
            >
              {!isPresentationMode && !readOnly && (
                <div
                  className={`${
                    isMobile ? "w-full h-1/2" : "w-1/4"
                  } bg-blue-800 p-4 text-white overflow-y-auto`}
                >
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
                            !checkAllPlayersAndBallPresent() ||
                            (arrows.length === 0 &&
                              dottedArrows.length === 0 &&
                              !selectingShoot)
                          }
                          icon={<Check size={28} />}
                          title="Valider le mouvement"
                          description="Cliquez pour ajouter la séquence à la timeline"
                        />

                        <ActionButton
                          onClick={() => setSelectingShoot(!selectingShoot)}
                          disabled={!ballPosition || isCourtEmpty}
                          icon={<Target size={28} />}
                          title="Tirer au panier"
                          description={
                            selectingShoot
                              ? "Cliquez sur 'Valider' pour terminer la séquence par un tir"
                              : "Activez pour terminer la séquence par un tir"
                          }
                          isActive={selectingShoot}
                        />

                        <ActionButton
                          onClick={goToLibrary}
                          icon={<BookOpen size={28} />}
                          title="Ma Bibliothèque"
                          description="Voir tous mes systèmes sauvegardés"
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Timeline :</h3>
                      <div className="space-y-2">
                        {timeline.map((sequence, index) => (
                          <div
                            key={index}
                            className={`bg-blue-700 p-2 rounded ${
                              index === timeline.length - 1
                                ? "border-2 border-yellow-400"
                                : ""
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <div>Séquence {index + 1}</div>
                              <div className="flex space-x-2">
                                {!isRecordingAudio ||
                                currentRecordingIndex !== index ? (
                                  <button
                                    onClick={() => startAudioRecording(index)}
                                    className="bg-green-500 text-white p-2 rounded"
                                    title="Enregistrer un commentaire audio"
                                  >
                                    <Mic size={20} />
                                  </button>
                                ) : (
                                  <button
                                    onClick={stopAudioRecording}
                                    className="bg-red-500 text-white p-2 rounded animate-pulse"
                                    title="Arrêter l'enregistrement"
                                  >
                                    <MicOff size={20} />
                                  </button>
                                )}
                                <button
                                  onClick={removeSequence}
                                  className={`p-2 rounded ${
                                    index === timeline.length - 1
                                      ? "bg-red-500 text-white hover:bg-red-600"
                                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                  }`}
                                  title={
                                    index === timeline.length - 1
                                      ? "Supprimer cette séquence"
                                      : "Seule la dernière séquence peut être supprimée"
                                  }
                                  disabled={index !== timeline.length - 1}
                                >
                                  <Trash2 size={20} />
                                </button>
                              </div>
                            </div>
                            <textarea
                              value={sequence.comment}
                              onChange={(e) => {
                                const newTimeline = [...timeline];
                                newTimeline[index].comment = e.target.value;
                                setTimeline(newTimeline);
                              }}
                              onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement;
                                target.style.height = "auto";
                                target.style.height = `${Math.min(
                                  target.scrollHeight,
                                  3 * 24
                                )}px`;
                              }}
                              className="mt-1 w-full bg-blue-600 text-white rounded px-2 py-1 resize-none overflow-hidden"
                              placeholder="Ajouter un commentaire pour cette séquence..."
                              rows={1}
                              maxLength={200}
                              style={{ minHeight: "24px", maxHeight: "72px" }}
                            />
                            {sequence.audioComment && (
                              <div className="mt-2">
                                <audio
                                  src={sequence.audioComment}
                                  controls
                                  className="w-full h-8"
                                />
                              </div>
                            )}
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
                      <h3 className="text-xl font-semibold mb-4">
                        Animation :
                      </h3>
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
                      <h3 className="text-xl font-semibold mb-4">
                        Instructions :
                      </h3>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Les joueurs bleus sont votre équipe.</li>
                        <li>Les joueurs rouges sont l&apos;équipe adverse.</li>
                        <li>
                          Vous ne pouvez faire des passes qu&apos;entre les
                          joueurs bleus.
                        </li>
                        <li>
                          Utilisez les flèches pleines pour les déplacements.
                        </li>
                        <li>
                          Utilisez les flèches en pointillés pour les passes.
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Partage :</h3>
                      <div className="space-y-2">
                        <ActionButton
                          onClick={generateShareLink}
                          icon={<Share2 size={28} />}
                          title="Génrer un lien de partage"
                          description="Créez un lien pour partager votre système avec d'autres personnes"
                        />
                        {shareLink && (
                          <div className="mt-2">
                            <p className="text-white mb-1">
                              Système partagé : {systemName}
                            </p>
                            <input
                              type="text"
                              value={shareLink}
                              readOnly
                              className="w-full bg-blue-700 text-white rounded px-2 py-1"
                            />
                            <button
                              onClick={copyShareLink}
                              className="mt-1 bg-blue-500 text-white px-2 py-1 rounded"
                            >
                              Copier le lien
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {!isPresentationMode && readOnly && (
                <div
                  className={`${
                    isMobile ? "w-full h-1/2" : "w-1/4"
                  } bg-blue-800 p-4 text-white overflow-y-auto`}
                >
                  <h3 className="text-xl font-semibold mb-4">
                    Système partagé : {systemName}
                  </h3>
                  <p className="mb-4">
                    Ce système est en mode lecture seule. Vous pouvez le
                    visualiser mais pas le modifier.
                  </p>
                  <div className="space-y-2 mb-4">
                    <ActionButton
                      onClick={playTimeline}
                      disabled={timeline.length === 0 || isPlayingTimeline}
                      icon={<Play size={28} />}
                      title="Jouer la timeline"
                      description="Cliquez pour jouer toutes les séquences d'animation"
                    />
                    <ActionButton
                      onClick={togglePresentationMode}
                      icon={<Maximize size={28} />}
                      title="Mode présentation"
                      description="Passer en mode présentation pour l'enregistrement"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Timeline :</h3>
                    <div className="space-y-2">
                      {timeline.map((sequence, index) => (
                        <div key={index} className="bg-blue-700 p-2 rounded">
                          <div>Séquence {index + 1}</div>
                          <p className="mt-1 w-full bg-blue-600 text-white rounded px-2 py-1">
                            {sequence.comment}
                          </p>
                          {sequence.audioComment && (
                            <div className="mt-2">
                              <audio
                                src={sequence.audioComment}
                                controls
                                className="h-8 w-full"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div
                className={`${
                  isMobile ? "w-full h-1/2" : "flex-grow"
                } flex items-center justify-center bg-gray-900 overflow-auto`}
              >
                <div
                  ref={courtContainerRef}
                  className="relative"
                  style={{
                    width: `${courtSize.width}px`,
                    height: `${courtSize.height}px`,
                    maxWidth: "100%",
                    maxHeight: "100%",
                  }}
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
                    width={courtSize.width}
                    height={courtSize.height}
                    readOnly={readOnly}
                    selectingShoot={selectingShoot}
                  />
                </div>
              </div>
            </main>
          </>
        )}
        {isPresentationMode && (
          <div className="absolute top-4 left-4 flex space-x-4">
            <ActionButton
              onClick={togglePresentationMode}
              icon={<Minimize size={28} />}
              title="Quitter le mode présentation"
              description="Cliquez pour revenir à l'interface normale"
            />
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
        {isPresentationMode && (
          <button
            className="absolute top-4 right-4 bg-blue-500 text-te p-2 rounded"
            onClick={togglePresentationMode}
          >
            <Minimize size={20} />
          </button>
        )}
        {selectingShoot && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-10">
            Mode tir activé. Cliquez sur &apos;Valider&apos; pour terminer la
            séquence par un tir au panier.
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default CreateSystem;
