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
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center mb-6">
            <button
              onClick={() => router.push("/")}
              className="mr-4 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-3xl font-bold text-gray-100">
              Ma Bibliothèque Premium
            </h1>
          </div>
          {systems.length === 0 ? (
            <p className="text-xl text-gray-400">Aucun système trouvé.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {systems.map((system) => (
                <div
                  key={system.id}
                  className="bg-gray-800 overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow"
                >
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-semibold text-gray-100 mb-2">
                      {system.name}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Créé le {new Date(system.createdAt).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => viewSystem(system.id)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Eye size={18} className="mr-2" />
                      Voir le système
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
