import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

// Hook personnalisé pour vérifier si on est côté client
function useIsClient() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  return isClient;
}

function AdminPage() {
  const { user, isLoaded } = useUser();
  const isClient = useIsClient();
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingRole, setIsSettingRole] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      const checkAdminStatus = async () => {
        await user.reload();
        setIsAdmin(user.publicMetadata?.role === "Admin");
      };
      checkAdminStatus();
    }
  }, [isLoaded, user]);

  if (!isLoaded) return <div>Chargement...</div>;
  if (!isAdmin) return <div>Accès non autorisé</div>;

  console.log("User public metadata:", user?.publicMetadata);

  if (isClient && (!isLoaded || user?.publicMetadata?.role !== "Admin")) {
    router.push("/");
    return null;
  }

  const handleAddSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/add-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        alert("Abonnement ajouté avec succès");
        setUserId("");
      } else {
        const error = await response.json();
        alert(`Erreur : ${error.message}`);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'abonnement:", error);
      alert("Une erreur est survenue lors de l'ajout de l'abonnement");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetAdminRole = async () => {
    setIsSettingRole(true);
    try {
      const response = await fetch("/api/set-admin-role", { method: "POST" });
      if (response.ok) {
        alert(
          "Rôle Admin défini avec succès. Veuillez vous déconnecter et vous reconnecter."
        );
      } else {
        throw new Error("Erreur lors de la définition du rôle Admin");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur est survenue lors de la définition du rôle Admin.");
    } finally {
      setIsSettingRole(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Page d'administration</h1>
      <form onSubmit={handleAddSubscription} className="max-w-md">
        <div className="mb-4">
          <label htmlFor="userId" className="block mb-2">
            ID de l'utilisateur :
          </label>
          <input
            type="text"
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full p-2 bg-gray-800 rounded"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300 disabled:opacity-50"
        >
          {isLoading ? "Chargement..." : "Ajouter l'abonnement"}
        </button>
      </form>
      <button
        onClick={handleSetAdminRole}
        disabled={isSettingRole}
        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300 mt-4"
      >
        {isSettingRole ? "Définition du rôle..." : "Définir le rôle Admin"}
      </button>
    </div>
  );
}

// Utiliser dynamic pour charger le composant côté client uniquement
export default dynamic(() => Promise.resolve(AdminPage), {
  ssr: false,
});
