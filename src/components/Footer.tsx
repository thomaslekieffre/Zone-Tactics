import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-bleu py-8 mt-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-white">
        <div className="mb-8 md:mb-0">
          <h3 className="text-xl font-bold mb-4">Contact</h3>
          <a
            href="https://github.com/thomaslekieffre"
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:text-blue-600 transition-colors duration-300"
          >
            Développeur : thomas.lekieffredev@gmail.com
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:text-blue-600 transition-colors duration-300"
          >
            Graphiste : zoe.marchal10@gmail.com
          </a>
          <a
            href="https://github.com/thomaslekieffre/Zone-Tactics"
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:text-blue-600 transition-colors duration-300"
          >
            Mail Projet : contactdev@zonetactics.fr
          </a>
          <p className="mt-4">© 2024 - ZoneTactics - Tous droits réservés</p>
        </div>
        <div className="mb-8 md:mb-0">
          <h3 className="text-xl font-bold mb-4">Social</h3>
          <ul>
            <li>
              <a
                href="https://x.com/thomasdev59"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors duration-300"
              >
                Twitter
              </a>
            </li>
          </ul>
        </div>
        <div className="flex items-center group cursor-pointer">
          <div className="relative">
            <Image
              src="/img/logo.png"
              alt="Logo ZoneTactics"
              width={80}
              height={80}
              className="transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <span className="text-2xl font-bold ml-4 group-hover:text-blue-600 transition-colors duration-300">
            ZoneTactics
          </span>
        </div>
      </div>
    </footer>
  );
}
