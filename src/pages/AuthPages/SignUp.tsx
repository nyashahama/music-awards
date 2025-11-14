import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../components/auth/SignUpForm";

export default function SignUp() {
  return (
    <>
      <PageMeta
        title="Sign Up - Zimdancehall Music Awards"
        description="Create a new account for Zimdancehall Music Awards"
      />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
