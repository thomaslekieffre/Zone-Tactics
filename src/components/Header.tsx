import Image from "next/image";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "react-feather";

export default function Header(): JSX.Element {
  const { isSignedIn, user } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="w-full bg-bleu">
      <header className="bg-bfonce text-gray-300 w-11/12 sm:w-10/12 mx-auto mt-4 sm:mt-8 rounded-xl">
        <div className="flex items-center justify-between p-4">
          {/* Logo */}
          <div className="flex items-center">
            <Image
              src="/img/logo.png"
              alt="ZoneTactics Logo"
              width={50}
              height={50}
              className="sm:w-[60px] sm:h-[60px]"
            />
            <span className="ml-2 sm:ml-3 text-white text-lg sm:text-xl font-semibold">
              ZoneTactics
            </span>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="hover:text-white transition-colors">
              Fonctionnalités
            </a>
            <Link href="/pricing" className="hover:text-white transition-colors">
              Prix
            </Link>
            <a href="#about" className="hover:text-white transition-colors">
              À propos
            </a>
          </nav>

          {/* Boutons Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {isSignedIn ? (
              <>
                <Link
                  href="/library"
                  className="px-4 py-2 text-white border border-white rounded-full hover:bg-white hover:text-black transition-colors"
                >
                  Bibliothèque
                </Link>
                <Link
                  href="/createsystem"
                  className="px-4 py-2 text-black capitalize bg-white rounded-full hover:bg-gray-100 transition-colors"
                >
                  Créer
                </Link>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10",
                      userButtonAvatarBox: "w-10 h-10",
                    },
                  }}
                />
              </>
            ) : (
              <SignInButton mode="modal">
                <button className="px-6 py-2 text-black bg-white rounded-full hover:bg-gray-100 transition-colors">
                  Accéder à l&apos;app
                </button>
              </SignInButton>
            )}
          </div>

          {/* Menu Mobile Toggle */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-white hover:text-gray-300 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-600 bg-bfonce rounded-b-xl">
            <nav className="flex flex-col p-4 space-y-4">
              <a
                href="#features"
                className="text-gray-300 hover:text-white transition-colors py-2"
                onClick={toggleMenu}
              >
                Fonctionnalités
              </a>
              <Link
                href="/pricing"
                className="text-gray-300 hover:text-white transition-colors py-2"
                onClick={toggleMenu}
              >
                Prix
              </Link>
              <a
                href="#about"
                className="text-gray-300 hover:text-white transition-colors py-2"
                onClick={toggleMenu}
              >
                À propos
              </a>

              {isSignedIn ? (
                <div className="flex flex-col space-y-3 pt-4 border-t border-gray-600">
                  <Link
                    href="/library"
                    className="text-center px-4 py-2 text-white border border-white rounded-full hover:bg-white hover:text-black transition-colors"
                    onClick={toggleMenu}
                  >
                    Bibliothèque
                  </Link>
                  <Link
                    href="/createsystem"
                    className="text-center px-4 py-2 text-black bg-white rounded-full hover:bg-gray-100 transition-colors"
                    onClick={toggleMenu}
                  >
                    Créer une tactique
                  </Link>
                  <div className="flex items-center justify-center pt-2">
                    <UserButton
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: "w-10 h-10",
                          userButtonAvatarBox: "w-10 h-10",
                        },
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-600">
                  <SignInButton mode="modal">
                    <button
                      className="w-full px-4 py-2 text-black bg-white rounded-full hover:bg-gray-100 transition-colors"
                      onClick={toggleMenu}
                    >
                      Accéder à l&apos;app
                    </button>
                  </SignInButton>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>
    </div>
  );
}
