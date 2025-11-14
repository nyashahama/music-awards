import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Sign In - Zimdancehall Music Awards"
        description="Sign in to your Zimdancehall Music Awards account"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
