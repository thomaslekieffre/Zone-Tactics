import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { STRIPE_PLANS } from "@/config/stripe";
import { loadStripe } from "@stripe/stripe-js";
import { FaCheck, FaBolt, FaLock, FaHeadset } from "react-icons/fa";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const featureIcons = [FaBolt, FaLock, FaHeadset, FaCheck];

const PLAN = STRIPE_PLANS.BASIC;

export default function Pricing() {
  const { isSignedIn, user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscription = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: PLAN.price, userId: user?.id }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { id: sessionId } = await response.json();
      const stripe = await stripePromise;
      const { error } = await stripe!.redirectToCheckout({ sessionId });

      if (error) {
        console.error("Erreur Stripe:", error);
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Lien de retour */}
        <div className="mb-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-xl p-4 sm:p-6 md:p-8 border border-blue-500 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center text-blue-300">
            {PLAN.name}
          </h2>
          <p className="text-3xl sm:text-4xl font-bold mb-6 text-center">
            5€{" "}
            <span className="text-xl sm:text-2xl font-normal text-gray-400">/ mois</span>
          </p>
          <ul className="mb-6 sm:mb-8 space-y-3 sm:space-y-4">
            {PLAN.features.map((feature, index) => {
              const Icon = featureIcons[index % featureIcons.length];
              return (
                <li key={index} className="flex items-start sm:items-center">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-green-400 mr-3 mt-0.5 sm:mt-0 flex-shrink-0" />
                  <span className="text-sm sm:text-base lg:text-lg">{feature}</span>
                </li>
              );
            })}
          </ul>
          <button
            onClick={handleSubscription}
            disabled={!isSignedIn || isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition duration-300 disabled:opacity-50 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Chargement...
              </span>
            ) : (
              "S'abonner maintenant"
            )}
          </button>
        </div>
        <p className="mt-6 text-center text-gray-400">
          Accédez à toutes les fonctionnalités premium et boostez votre
          expérience !
        </p>
      </div>
    </div>
  );
}
