import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-bleu py-8 mt-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-white">
        <div className="mb-8 md:mb-0">
          <h3 className="text-xl font-bold mb-4">Contact</h3>
          <p>Développeur : thomas.lekeiffredew@gmail.com</p>
          <p>Graphiste : zoe.marchal10@gmail.com</p>
          <p>Mail Projet : zonetactics@zonet.fr</p>
          <p className="mt-4">© 2024 - ZoneTactics - Tous droits réservés</p>
        </div>
        <div className="mb-8 md:mb-0">
          <h3 className="text-xl font-bold mb-4">Social</h3>
          <ul>
            <li>Twitter</li>
            <li>Instagram</li>
            <li>Tik Tok</li>
          </ul>
        </div>
        <div className="flex items-center">
          <Image
            src="/img/logo.png"
            alt="Logo ZoneTactics"
            width={80}
            height={80}
          />
          <span className="text-2xl font-bold ml-4">ZoneTactics</span>
        </div>
      </div>
    </footer>
  );
}
