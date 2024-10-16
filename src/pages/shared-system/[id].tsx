import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CreateSystem from "../createsystem";

const SharedSystem = () => {
  const router = useRouter();
  const { id } = router.query;
  const [systemData, setSystemData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/get-shared-system?id=${id}`)
        .then(async (response) => {
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Erreur inconnue");
          }
          return response.json();
        })
        .then((data) => setSystemData(data))
        .catch((error) => {
          console.error(
            "Erreur lors de la récupération du système partagé:",
            error
          );
          setError(error.message);
        });
    }
  }, [id]);

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  if (!systemData) {
    return <div>Chargement...</div>;
  }

  return <CreateSystem initialData={systemData} />;
};

export default SharedSystem;
