import { useUser } from "@clerk/nextjs";

const ProfilePage: React.FC = () => {
  const { isSignedIn, user } = useUser();

  if (!isSignedIn) {
    return <div>Veuillez vous connecter pour voir votre profil.</div>;
  }

  return <div>Bienvenue, {user.firstName}!</div>;
};

export default ProfilePage;
