import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CreateSystem, { LocalAnimationSequence } from "../createsystem";

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

  useEffect(() => {
    if (id) {
      fetch(`/api/get-shared-system?id=${id}`)
        .then((response) => response.json())
        .then((data: SystemData) => setSystemData(data))
        .catch((error) =>
          console.error("Erreur lors de la récupération du système:", error)
        );
    }
  }, [id]);

  if (!systemData) {
    return <div>Chargement...</div>;
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
