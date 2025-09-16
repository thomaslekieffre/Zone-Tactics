import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-bleu py-6 sm:py-8 mt-12 sm:mt-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-white px-4 sm:px-6">
        <div className="mb-6 md:mb-0 text-center md:text-left">
          <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Contact</h3>
          <a
            href="mailto:thomas.lekieffredev@gmail.com"
            className="block text-sm sm:text-base hover:text-blue-200 transition-colors duration-300 mb-1"
          >
            Développeur : thomas.lekieffredev@gmail.com
          </a>
          <a
            href="mailto:zoe.marchal10@gmail.com"
            className="block text-sm sm:text-base hover:text-blue-200 transition-colors duration-300 mb-1"
          >
            Graphiste : zoe.marchal10@gmail.com
          </a>
          <a
            href="mailto:contactdev@zonetactics.fr"
            className="block text-sm sm:text-base hover:text-blue-200 transition-colors duration-300 mb-3"
          >
            Mail Projet : contactdev@zonetactics.fr
          </a>
          <p className="text-xs sm:text-sm text-blue-100">© 2024 - ZoneTactics - Tous droits réservés</p>
        </div>
        <div className="mb-6 md:mb-0 text-center md:text-left">
          <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Social</h3>
          <ul className="space-y-1">
            <li>
              <a
                href="https://x.com/thomasdev59"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm sm:text-base hover:text-blue-200 transition-colors duration-300"
              >
                Twitter
              </a>
            </li>
          </ul>
        </div>
        <div className="flex flex-col sm:flex-row items-center group cursor-pointer">
          <div className="relative mb-2 sm:mb-0">
            <Image
              src="/img/logo.png"
              alt="Logo ZoneTactics"
              width={60}
              height={60}
              className="sm:w-20 sm:h-20 transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <span className="text-xl sm:text-2xl font-bold sm:ml-4 group-hover:text-blue-200 transition-colors duration-300 text-center">
            ZoneTactics
          </span>
        </div>
      </div>
    </footer>
  );
}
