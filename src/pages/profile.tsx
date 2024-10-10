import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEffect } from "react";

const ProfilePage: React.FC = () => {
  const { isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isSignedIn) {
      router.push("/login");
    }
  }, [isSignedIn, router]);

  if (!isSignedIn) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <h1>Profil</h1>
      <p>
        Nom : {user.firstName} {user.lastName}
      </p>
      <p>Email : {user.primaryEmailAddress?.emailAddress}</p>
    </div>
  );
};

export default ProfilePage;
