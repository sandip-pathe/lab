import { Suspense } from "react";
import LoginForm from "@/components/LoginForm";

function LoginContent() {
  return <LoginForm />;
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <LoginContent />
    </Suspense>
  );
}
