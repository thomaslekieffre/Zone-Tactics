import Head from "next/head";
import Image from "next/image";
import localFont from "next/font/local";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-500">
      <h1 className="text-4xl font-bold text-white">
        Bienvenue sur Zone Tactics!
      </h1>
      <p className="mt-4 text-lg text-white">
        Le meilleur outil pour créer et partager des stratégies de basket.
      </p>
    </div>
  );
}
