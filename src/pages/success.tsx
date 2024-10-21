import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner,
} from "react-icons/fa";

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

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <div className="flex flex-col items-center">
            <FaSpinner className="animate-spin text-blue-400 text-4xl mb-4" />
            <p className="text-xl">Vérification de votre abonnement...</p>
          </div>
        );
      case "error":
        return (
          <div className="flex flex-col items-center">
            <FaExclamationTriangle className="text-yellow-400 text-4xl mb-4" />
            <h1 className="text-2xl font-bold mb-4">Une erreur est survenue</h1>
            <p className="mb-4">Veuillez contacter notre support technique.</p>
            <Link href="/pricing">
              <a className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">
                Retour à la page d&apos;abonnement
              </a>
            </Link>
          </div>
        );
      case "success":
        return (
          <>
            <FaCheckCircle className="text-green-400 text-6xl mb-6" />
            <h1 className="text-3xl font-bold mb-4">
              Merci pour votre abonnement !
            </h1>
            <p className="mb-6 text-xl">
              Votre abonnement Premium a été activé avec succès.
            </p>
            <Link href="/createsystem">
              <a className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition duration-300 text-lg font-semibold">
                Commencer à utiliser ZoneTactics
              </a>
            </Link>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-center max-w-md w-full border border-blue-500">
        {renderContent()}
      </div>
    </div>
  );
}
