import Header from "@/components/Header";
import Image from "next/image";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import { SignInButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  const { isSignedIn } = useUser();

  return (
    <div className="flex flex-col min-h-screen bg-bleu">
      <Header />
      <motion.div
        className="flex flex-col items-center text-center p-8 mt-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.button
          className="bg-transparent text-white border border-white py-2 px-4 rounded-full mb-8"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Découvrez le nouvel indispensable du coach !
        </motion.button>
        <motion.h1
          className="text-white text-7xl font-medium mb-8 w-9/12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          Le nouveau moyen de créer et d'expliquer ses tactiques
        </motion.h1>
        <motion.p
          className="text-white text-lg max-w-2xl mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Grâce à ZoneTactics, vos joueurs comprendront plus simplement vos
          tactiques grâce à des animations rapides et fluides très simples à
          créer et modifier.
        </motion.p>
        <motion.div className="space-x-4">
          {isSignedIn ? (
            <Link href="/createsystem">
              <motion.button
                className="bg-white text-black py-2 px-4 rounded-full shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                Accéder à l'app
              </motion.button>
            </Link>
          ) : (
            <SignInButton mode="modal">
              <motion.button
                className="bg-white text-black py-2 px-4 rounded-full shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                Accéder à l'app
              </motion.button>
            </SignInButton>
          )}
          <motion.button
            className="bg-transparent text-white border border-white py-2 px-4 rounded-full"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Parler à un expert
          </motion.button>
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
            src="/img/screen1.png"
            alt="Aperçu de l'app"
            width={800}
            height={400}
            className="rounded-lg"
          />
        </motion.div>
        <section className="text-center text-white">
          <motion.h2
            className="text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Les fonctionnalités pour devenir LE coach
          </motion.h2>
          <motion.p
            className="text-xl mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 1 }}
          >
            Voici tous ce que nous proposons afin de vous aidez dans votre
            coaching !
          </motion.p>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 m-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
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
                Il va falloir penser à préparer les textes, ils doivent être pas
                mal long quand même, on les fera avec got plus que juju paye
                t'in il est sympatoche et j pense ils ira jla, ya les img à
                changer aussi mais sinon c'est good
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
                Il va falloir penser à préparer les textes, ils doivent être pas
                mal long quand même, on les fera avec got plus que juju paye
                t'in il est sympatoche et j pense ils ira, ya les img à changer
                aussi mais sinon c'est good
              </p>
            </motion.div>
            <motion.div
              className="bg-blue-300 bg-opacity-10 p-6 rounded-lg shadow-md md:col-span-2 flex flex-col md:flex-row md:items-start"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-full md:w-1/2 mr-0 md:mr-6 mb-6 md:mb-0">
                <div className="flex items-center mb-4">
                  <div className="p-3">
                    <Image
                      src="/img/Icon3.png"
                      alt="Icone de créateur d'animations"
                      width={120}
                      height={120}
                    />
                  </div>
                  <h3 className="text-2xl font-bold ml-4">
                    Créateur d'animations
                  </h3>
                </div>
                <p className="mt-4 w-9/12 m-12">
                  Il va falloir penser à préparer les textes, ils doivent être
                  pas mal long quand même, on les fera avec got plus que juju
                  paye t'in il est sympatoche et j pense ils ira, ya les img à
                  changer aussi mais sinon c'est good
                </p>
              </div>
              <div className="ml-32">
                <Image
                  src="/img/Screen2.png"
                  alt="Illustration de tactique"
                  width={400}
                  height={300}
                  className="rounded-lg w-full h-auto"
                />
              </div>
            </motion.div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
