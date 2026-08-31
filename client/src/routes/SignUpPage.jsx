import { SignUp } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import "./AuthPage.css";

const SignUpPage = () => {
  return (
    <div className="auth-page">
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        redirectUrl="/dashboard"
        appearance={{
          baseTheme: dark,
          variables: {
            colorPrimary: "#10a37f",
            colorBackground: "#1a1a1a",
            colorText: "#ffffff",
            colorTextSecondary: "#e5e7eb",
            colorInputBackground: "#0d0d0d",
            colorInputText: "#ffffff",
            borderRadius: "8px",
          },
          elements: {
            socialButtonsBlockButton: "clerk-social-button",
            socialButtonsBlockButtonText: "clerk-social-button-text",
            socialButtonsProviderIcon: "clerk-social-button-icon",
          },
        }}
      />
    </div>
  );
};

export default SignUpPage;
