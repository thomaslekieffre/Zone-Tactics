import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Success() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const router = useRouter();
  const { session_id } = router.query;

  useEffect(() => {
    if (session_id) {
      fetch(`/api/verify-subscription?session_id=${session_id}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "active") {
            setStatus("success");
          } else {
            setStatus("error");
          }
        })
        .catch(() => setStatus("error"));
    }
  }, [session_id]);

  if (status === "loading") {
    return <div>Chargement...</div>;
  }

  if (status === "error") {
    return <div>Une erreur est survenue. Veuillez contacter le support.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">
          Merci pour votre abonnement !
        </h1>
        <p className="mb-4">Votre abonnement a été activé avec succès.</p>
        <Link href="/createsystem">
          <a className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">
            Commencer à utiliser ZoneTactics
          </a>
        </Link>
      </div>
    </div>
  );
}
