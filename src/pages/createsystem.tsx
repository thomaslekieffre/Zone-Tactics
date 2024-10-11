import { ArrowLeft, Play, Pause, RotateCw } from "react-feather";
import { UserButton, useUser } from "@clerk/nextjs";

export default function CreateSystem(): JSX.Element {
  const { user } = useUser();

  return (
    <div className="h-screen bg-gray-900 overflow-hidden">
      {" "}
      {/* Assurer que l'écran n'a pas de débordement */}
      <nav className="bg-blue-800 text-white flex justify-between p-4">
        <div className="flex items-center space-x-4">
          <button className="back-button p-2">
            <ArrowLeft size={20} />
          </button>
          <input
            type="text"
            placeholder="Nom du système"
            className="bg-blue-700 rounded-md px-4 py-2 focus:outline-none"
          />
        </div>
        <div className="hidden md:flex items-center space-x-4 px-2mr-8 capitalize">
          {user?.username}
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "ml-4 w-10 h-10",
                userButtonAvatarBox: "w-10 h-10",
              },
            }}
          />
        </div>
      </nav>
      {/* Main content */}
      <main className="flex h-full overflow-hidden">
        {" "}
        {/* Eviter le débordement */}
        {/* Sidebar */}
        <div className="bg-blue-800 p-4 text-white w-1/4 space-y-8 h-full">
          {" "}
          {/* Fixer la hauteur à 100% */}
          {/* Actions */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Actions :</h3>
            <div className="space-y-2">
              <button className="bg-blue-600 p-2 rounded-lg flex items-center justify-center w-full">
                <ArrowLeft size={20} />
              </button>
              <button className="bg-blue-600 p-2 rounded-lg flex items-center justify-center w-full">
                <Play size={20} />
              </button>
              <button className="bg-blue-600 p-2 rounded-lg flex items-center justify-center w-full">
                <Pause size={20} />
              </button>
              <button className="bg-blue-600 p-2 rounded-lg flex items-center justify-center w-full">
                <RotateCw size={20} />
              </button>
            </div>
          </div>
          {/* Equipes */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Équipe 1 :</h3>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  className="bg-blue-500 text-white rounded-full h-10 w-10 flex items-center justify-center"
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Équipe 2 :</h3>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  className="bg-orange-500 text-white rounded-full h-10 w-10 flex items-center justify-center"
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Court */}
        <div className="flex-1 bg-gray-100 p-2 h-full">
          <div className="w-full h-full bg-orange-500 rounded-lg relative">
            <div
              className="absolute inset-0 bg-no-repeat bg-cover bg-center"
              style={{ backgroundImage: "url('/img/basket_court.png')" }}
            ></div>
          </div>
        </div>
      </main>
    </div>
  );
}
