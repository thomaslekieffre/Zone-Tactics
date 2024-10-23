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
        .then((data: SystemData) => {
          console.log("Données du système partagé reçues:", data);
          setSystemData(data);
        })
        .catch((error) =>
          console.error("Erreur lors de la récupération du système:", error)
        );
    }
  }, [router.isReady, id]);

  if (!systemData) {
    return <div>Chargement...</div>;
  }

  return (
    <div className={`min-h-screen bg-gray-900 ${isMobile ? "p-2" : "p-4"}`}>
      {isMobile && !isLandscape ? (
        <div className="text-white flex items-center justify-center h-screen">
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
      ) : (
        <CreateSystem
          initialData={systemData}
          readOnly={true}
          systemName={systemData.name}
          isMobile={isMobile}
        />
      )}
    </div>
  );
};

export default SharedSystem;
