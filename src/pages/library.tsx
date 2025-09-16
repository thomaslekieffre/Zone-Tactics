import { useState, useEffect } from "react";
import { useSubscription } from "@/hooks/useSubscription";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/router";
import { Eye, ArrowLeft } from "react-feather";

type System = {
  id: string;
  name: string;
  createdAt: string;
};

export default function Library() {
  const [systems, setSystems] = useState<System[]>([]);
  const router = useRouter();
  const subscriptionStatus = useSubscription();
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    if (isSignedIn && subscriptionStatus === "active" && user) {
      fetchUserSystems();
    }
  }, [isSignedIn, subscriptionStatus, user]);

  const fetchUserSystems = async () => {
    try {
      const response = await fetch("/api/get-user-systems");
      if (response.ok) {
        const data = await response.json();
        setSystems(data);
      } else {
        console.error("Erreur lors de la récupération des systèmes");
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const viewSystem = (id: string) => {
    router.push(`/shared-system/${id}`);
  };

  if (subscriptionStatus === "loading") {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Accès restreint</h1>
          <p className="mb-4">
            Veuillez vous connecter pour accéder à la bibliothèque.
          </p>
          <Link
            href="/sign-in"
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  if (subscriptionStatus !== "active") {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Accès Premium Requis</h1>
          <p className="mb-4">
            La bibliothèque est une fonctionnalité réservée aux membres premium.
          </p>
          <Link
            href="/pricing"
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Passer au Premium
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="sm:px-0">
          <div className="flex items-center mb-4 sm:mb-6">
            <button
              onClick={() => router.push("/")}
              className="mr-3 sm:mr-4 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-100">
              Ma Bibliothèque Premium
            </h1>
          </div>

          {/* Bouton pour créer un nouveau système */}
          <div className="mb-6">
            <button
              onClick={() => router.push("/createsystem")}
              className="w-full sm:w-auto bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              + Créer une nouvelle tactique
            </button>
          </div>

          {systems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-16 w-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-medium text-gray-300 mb-2">Aucune tactique trouvée</h3>
              <p className="text-sm sm:text-base text-gray-400 mb-6">Commencez par créer votre première tactique !</p>
              <button
                onClick={() => router.push("/createsystem")}
                className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Créer ma première tactique
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {systems.map((system) => (
                <div
                  key={system.id}
                  className="bg-gray-800 overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  <div className="p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-100 mb-2 line-clamp-2">
                      {system.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 mb-4">
                      Créé le {new Date(system.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                    <button
                      onClick={() => viewSystem(system.id)}
                      className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      <Eye size={16} className="mr-2" />
                      Voir la tactique
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
