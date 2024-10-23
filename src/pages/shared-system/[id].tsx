import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CreateSystem, { LocalAnimationSequence } from "../createsystem";
import { useIsMobile } from "../../hooks/useIsMobile";

type SystemData = {
  name: string;
  timeline: LocalAnimationSequence[];
  playersOnCourt: {
    id: string;
    num: number;
    team: string;
    x: number;
    y: number;
  }[];
};

const SharedSystem = () => {
  const router = useRouter();
  const { id } = router.query;
  const [systemData, setSystemData] = useState<SystemData | null>(null);
  const [isLandscape, setIsLandscape] = useState(true);
  const isMobile = useIsMobile();

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

  useEffect(() => {
    if (router.isReady && id) {
      fetch(`/api/get-shared-system?id=${id}`)
        .then((response) => response.json())
        .then((data: SystemData) => setSystemData(data))
        .catch((error) =>
          console.error("Erreur lors de la récupération du système:", error)
        );
    }
  }, [router.isReady, id]);

  if (!systemData) {
    return <div>Chargement...</div>;
  }

  if (isMobile && !isLandscape) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center p-4">
          <h1 className="text-2xl font-bold mb-4">
            Veuillez tourner votre appareil
          </h1>
          <p>
            Pour une meilleure expérience, veuillez utiliser votre appareil en
            mode paysage.
          </p>
        </div>
      </div>
    );
  }

  return (
    <CreateSystem
      initialData={systemData}
      readOnly={true}
      systemName={systemData?.name}
    />
  );
};

export default SharedSystem;
