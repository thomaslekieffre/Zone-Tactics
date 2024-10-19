import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { Eye, ArrowLeft } from "react-feather";

type System = {
  id: string;
  name: string;
  createdAt: string;
};

export default function Library() {
  const [systems, setSystems] = useState<System[]>([]);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchUserSystems();
    }
  }, [user]);

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
    console.log('ici')
    console.log(id)
    router.push(`/shared-system/${id}`);
  };

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
              Ma Bibliothèque
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
