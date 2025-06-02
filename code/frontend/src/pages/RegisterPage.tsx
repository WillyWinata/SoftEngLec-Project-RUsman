import { Link } from "react-router-dom";
import { RegisterForm } from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-pink-900 to-black p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-pink-400">Create Account</h1>
          <p className="text-pink-300 mt-2">Sign up to get started</p>
        </div>

        <RegisterForm />

        <div className="text-center mt-6">
          <p className="text-pink-300">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-pink-400 hover:text-pink-300 underline underline-offset-4"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
