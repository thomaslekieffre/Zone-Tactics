import { SignIn } from "@clerk/nextjs";

const SignInPage: React.FC = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    <SignIn />
  </div>
);

export default SignInPage;
