import Header from "@/components/Header";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import Footer from "@/components/Footer";
import { SignInButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useRef } from "react";

export default function Home() {
  const { isSignedIn } = useUser();

  const featuresRef = useRef(null);
  const aboutRef = useRef(null);
  const isFeaturesInView = useInView(featuresRef, { once: true, amount: 0.2 });
  const isAboutInView = useInView(aboutRef, { once: true, amount: 0.2 });

  return (
    <div className="flex flex-col min-h-screen bg-bleu">
      <Header />
      <motion.div
        className="flex flex-col items-center text-center p-4 sm:p-8 mt-4 sm:mt-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.button
          className="bg-transparent text-white border border-white py-2 px-4 rounded-full mb-4 sm:mb-8 cursor-default text-sm sm:text-base"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, repeatType: "loop", duration: 3 }}
          whileTap={{ scale: 0.95 }}
        >
          Découvrez le nouvel indispensable du coach !
        </motion.button>
        <motion.h1
          className="text-white text-3xl sm:text-5xl md:text-7xl font-medium mb-4 sm:mb-8 w-full sm:w-9/12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          Le nouveau moyen de créer et d&apos;expliquer ses tactiques
        </motion.h1>
        <motion.p
          className="text-white text-base sm:text-lg max-w-2xl mb-4 sm:mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Grâce à ZoneTactics, vos joueurs comprendront plus simplement vos
          tactiques grâce à des animations rapides et fluides très simples à
          créer et à partager !
        </motion.p>
        <motion.div className="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row">
          {isSignedIn ? (
            <>
              <Link href="/createsystem">
                <motion.button
                  className="bg-white text-black py-2 px-4 rounded-full shadow-lg w-full sm:w-auto"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Accéder à l&apos;application
                </motion.button>
              </Link>
              <Link href="/pricing">
                <motion.button
                  className="bg-transparent text-white border border-white py-2 px-4 rounded-full w-full sm:w-auto"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Voir les abonnements
                </motion.button>
              </Link>
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <motion.button
                  className="bg-white text-black py-2 px-4 rounded-full shadow-lg w-full sm:w-auto"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Accéder à l&apos;application
                </motion.button>
              </SignInButton>
              <Link href="/pricing">
                <motion.button
                  className="bg-transparent text-white border border-white py-2 px-4 rounded-full w-full sm:w-auto"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Voir les abonnements
                </motion.button>
              </Link>
            </>
          )}
        </motion.div>
      </motion.div>
      <main className="flex flex-col items-center mt-10 flex-grow">
        <motion.div
          className="rounded-lg p-4 mb-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <Image
            src="/img/pc.png"
            alt="Aperçu de l'application"
            width={800}
            height={400}
            className="rounded-lg"
          />
        </motion.div>
        <section
          ref={featuresRef}
          className="text-center text-white"
          id="features"
        >
          <motion.h2
            className="text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 50 }}
            animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1 }}
          >
            Les fonctionnalités pour devenir LE coach
          </motion.h2>
          <motion.p
            className="text-xl mb-10"
            initial={{ opacity: 0 }}
            animate={isFeaturesInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2, duration: 1 }}
          >
            Voici tout ce que nous proposons afin de vous aider dans votre
            coaching !
          </motion.p>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 m-4 md:m-40"
            initial={{ opacity: 0 }}
            animate={isFeaturesInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4, duration: 1 }}
          >
            <motion.div
              className="bg-blue-300 bg-opacity-10 p-6 rounded-lg shadow-md"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center mb-4">
                <div className="p-3">
                  <Image
                    src="/img/Icon1.png"
                    alt="Icone de suivi des performances"
                    width={120}
                    height={120}
                  />
                </div>
                <h3 className="text-2xl font-bold ml-4">
                  Suivi des performances en match
                </h3>
              </div>
              <p>
                Zone Tactics permet aux coachs de suivre les performances de
                leurs joueurs. A chaque fin de match, vous pouvez entrer les
                statistiques de vos joueurs, identifiez les points forts et les
                axes d&apos;amélioration pour maximiser leur rendement et
                prendre des décisions stratégiques rapidement.
              </p>
            </motion.div>
            <motion.div
              className="bg-blue-300 bg-opacity-10 p-6 rounded-lg shadow-md"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center mb-4">
                <div className="p-3">
                  <Image
                    src="/img/Icon2.png"
                    alt="Icone de bibliothèque de tactiques"
                    width={120}
                    height={120}
                  />
                </div>
                <h3 className="text-2xl font-bold ml-4">
                  Bibliothèque de tactiques
                </h3>
              </div>
              <p>
                Accédez à votre bibliothèque complète de tactiques
                personnalisables. Créez, organisez et sauvegardez vos stratégies
                pour les utiliser en fonction des besoins de l&apos;équipe.
                Chaque tactique peut être partagée avec vos joueurs, leur
                permettant de mieux se préparer avant les matchs.
              </p>
            </motion.div>
            <motion.div
              className="bg-blue-300 bg-opacity-10 p-6 rounded-lg shadow-md md:col-span-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center mb-6">
                <div className="p-3">
                  <Image
                    src="/img/Icon3.png"
                    alt="Icone de créateur d'animations"
                    width={120}
                    height={120}
                  />
                </div>
                <h3 className="text-2xl font-bold ml-4">
                  Créateur d&apos;animations
                </h3>
              </div>
              <div className="flex flex-col md:flex-row items-center">
                <div className="w-full md:w-1/2 pr-0 md:pr-6 mb-6 md:mb-0">
                  <p className="text-left">
                    Avec Zone Tactics, vous pouvez créer des animations
                    détaillées pour illustrer vos stratégies sur le terrain.
                    Grâce à notre interface intuitive, vous pouvez facilement
                    modéliser les mouvements de vos joueurs, simuler des actions
                    clés et ajuster les positions en temps réel. Que ce soit
                    pour des situations offensives ou défensives, vous pouvez
                    démontrer chaque étape de votre plan de jeu. Ces animations
                    permettent à vos joueurs de visualiser et comprendre plus
                    rapidement les tactiques complexes. De plus, vous pouvez
                    ajouter des commentaires vocaux pour clarifier des points
                    spécifiques ou insister sur des détails critiques. En
                    combinant des visuels clairs et des explications précises,
                    le créateur d&apos;animations devient un outil indispensable
                    pour assurer une communication efficace entre vous et votre
                    équipe.
                  </p>
                </div>
                <div className="w-full md:w-1/2 flex justify-center items-center">
                  <Image
                    src="/img/Screen2.png"
                    alt="Illustration de tactique"
                    width={400}
                    height={300}
                    className="rounded-lg w-auto h-auto max-w-full"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>
        <section
          ref={aboutRef}
          id="about"
          className="text-center text-white mt-20 mb-20 w-full max-w-4xl mx-auto px-4"
        >
          <motion.h2
            className="text-5xl font-bold mb-10"
            initial={{ opacity: 0, y: 50 }}
            animate={isAboutInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1 }}
          >
            À propos de Zone Tactics
          </motion.h2>
          <motion.div
            className="bg-blue-300 bg-opacity-10 p-10 rounded-lg shadow-lg"
            initial={{ opacity: 0 }}
            animate={isAboutInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2, duration: 1 }}
            whileHover={{ scale: 1.05 }}
          >
            <p className="text-lg mb-6">
              Zone Tactics est une plateforme SaaS innovante conçue pour les
              coachs de basketball, leur permettant de créer et partager des
              tactiques dynamiques avec leurs équipes. Grâce à une interface
              intuitive, les coachs peuvent élaborer des animations détaillées
              de stratégies, ajoutant des commentaires vocaux et partageant
              facilement leurs systèmes via des liens uniques.
            </p>
            <p className="text-lg">
              Derrière Zone Tactics se trouve Thomas, un développeur passionné
              et basketteur, qui combine ses compétences techniques et son
              expérience sur le terrain. En tant que coach et joueur, il
              comprend les besoins des équipes et des entraîneurs, et a conçu
              cette plateforme pour optimiser la communication, la préparation
              et l&apos;exécution des tactiques. Chaque fonctionnalité a été
              pensée pour répondre aux défis rencontrés dans la pratique
              quotidienne du basketball.
            </p>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
