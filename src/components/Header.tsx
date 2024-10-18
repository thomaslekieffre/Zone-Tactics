import Image from "next/image";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function Header(): JSX.Element {
  const { isSignedIn, user } = useUser();

  return (
    <div className="w-full bg-bleu">
      <header className="bg-bfonce text-gray-300 w-10/12 mx-auto mt-8 rounded-xl">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <Image
              src="/img/logo.png"
              alt="ZoneTactics Logo"
              width={60}
              height={60}
            />
            <span className="ml-3 text-white text-xl font-semibold">
              ZoneTactics
            </span>
          </div>

          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="hover:text-white">
              Fonctionnalités
            </a>
            <a href="#pricing" className="hover:text-white">
              Prix
            </a>
            <a href="#about" className="hover:text-white">
              À propos
            </a>
          </nav>

          {isSignedIn ? (
            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/"
                className="px-6 py-2 text-black capitalize bg-white rounded-full hover:bg-gray-100"
              >
                {user.username}
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
            </div>
          ) : (
            <SignInButton mode="modal">
              <button className="hidden md:inline-block px-6 py-2 text-black bg-white rounded-full hover:bg-gray-100">
                Accéder à l&apos;app
              </button>
            </SignInButton>
          )}
        </div>
      </header>
    </div>
  );
}
