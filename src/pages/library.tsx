import { useSubscription } from "@/hooks/useSubscription";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function Library() {
  const subscriptionStatus = useSubscription();
  const { isSignedIn } = useUser();

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

  // Contenu de la bibliothèque pour les utilisateurs premium
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Bibliothèque Premium</h1>
      {/* Ajoutez ici le contenu de votre bibliothèque */}
      <p>
        Bienvenue dans votre bibliothèque premium. Profitez de tous les
        avantages !
      </p>
      {/* Liste des éléments de la bibliothèque, fonctionnalités premium, etc. */}
    </div>
  );
}
