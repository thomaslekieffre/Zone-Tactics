import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useSubscription } from "@/hooks/useSubscription";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Shield,
  Eye,
  EyeOff,
} from "react-feather";

export default function Profile() {
  const { isSignedIn, user } = useUser();
  const subscriptionStatus = useSubscription();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleCancelSubscription = async () => {
    if (confirm("Êtes-vous sûr de vouloir résilier votre abonnement ?")) {
      setIsLoading(true);
      try {
        const response = await fetch("/api/cancel-subscription", {
          method: "POST",
        });
        if (response.ok) {
          alert("Votre abonnement a été résilié avec succès.");
          router.reload();
        } else {
          throw new Error("Erreur lors de la résiliation de l'abonnement");
        }
      } catch (error) {
        console.error("Erreur:", error);
        alert(
          "Une erreur est survenue lors de la résiliation de l'abonnement."
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleUpdatePassword = async () => {
    setIsLoading(true);
    setPasswordError("");

    if (newPassword !== confirmPassword) {
      setPasswordError("Les nouveaux mots de passe ne correspondent pas.");
      setIsLoading(false);
      return;
    }

    try {
      await user?.updatePassword({
        currentPassword,
        newPassword,
      });
      alert("Votre mot de passe a été mis à jour avec succès.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du mot de passe:", error);
      setPasswordError(
        "Erreur lors de la mise à jour du mot de passe. Veuillez vérifier vos informations."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    if (field === "current") {
      setShowCurrentPassword(!showCurrentPassword);
    } else if (field === "new") {
      setShowNewPassword(!showNewPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Accès restreint</h1>
          <p className="mb-4">
            Veuillez vous connecter pour accéder à votre profil.
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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.push("/")}
            className="mr-4 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold">Profil</h1>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Informations personnelles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <User className="mr-2" />
              <p>
                <strong>Nom :</strong> {user?.fullName}
              </p>
            </div>
            <div className="flex items-center">
              <Mail className="mr-2" />
              <p>
                <strong>Email :</strong>{" "}
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-2" />
              <p>
                <strong>Date d&apos;inscription :</strong>{" "}
                {new Date(user?.createdAt || "").toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center">
              <Shield className="mr-2" />
              <p>
                <strong>Dernière connexion :</strong>{" "}
                {new Date(user?.lastSignInAt || "").toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Abonnement</h2>
          <p className="mb-2">
            <strong>Statut :</strong>{" "}
            {subscriptionStatus === "active" ? "Actif" : "Inactif"}
          </p>
          {subscriptionStatus === "active" && (
            <>
              <p className="mb-2">
                <strong>Type d&apos;abonnement :</strong> Premium
              </p>

              <button
                onClick={handleCancelSubscription}
                disabled={isLoading}
                className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-300 disabled:opacity-50"
              >
                {isLoading ? "Chargement..." : "Résilier l'abonnement"}
              </button>
            </>
          )}
          {subscriptionStatus !== "active" && (
            <>
              <p className="mb-4">
                Vous n&apos;avez pas d&apos;abonnement actif.
              </p>
              <Link
                href="/pricing"
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
              >
                S&apos;abonner
              </Link>
            </>
          )}
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Changer le mot de passe
          </h2>
          <div className="space-y-4">
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Mot de passe actuel"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-2 bg-gray-700 rounded pr-10"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("current")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Nouveau mot de passe"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 bg-gray-700 rounded pr-10"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmer le nouveau mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 bg-gray-700 rounded pr-10"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {passwordError && <p className="text-red-500">{passwordError}</p>}
            <button
              onClick={handleUpdatePassword}
              disabled={isLoading}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 disabled:opacity-50"
            >
              {isLoading ? "Chargement..." : "Mettre à jour le mot de passe"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
