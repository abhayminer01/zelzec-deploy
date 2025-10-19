import React from "react";
import { useModal } from "../contexts/ModalContext";
import { registerUser } from "../services/auth";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

export default function RegisterComponent() {
  const { closeRegister, openLogin } = useModal();
  const { isAuthenticated, login } = useAuth();

  const handleBackdropClick = () => {
    closeRegister();
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const handleFormSubmit = async e => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const req = await registerUser({ email, password });
    if(req?.success) {
      toast.success('User Registration', {
        description : "Successfully Registered User"
      });
      login();
      closeRegister();
    } else {
      toast.error('Something Occured while Register', {
        description : `${req?.message || req?.err}`
      });
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-[350px] p-8 flex flex-col items-center relative"
        onClick={handleModalClick}
      >
        {/* Heading */}
        <h1 className="text-2xl font-bold mb-1">Sign Up</h1>
        <p className="text-gray-700 text-sm">
          Welcome to <span className="font-semibold">ZelZec</span>
        </p>
        <p className="text-gray-500 text-sm mb-6">
          Create an account to Buy and Sell your Stuff!
        </p>

        {/* Form */}
        <form className="w-full flex flex-col gap-4" onSubmit={handleFormSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              className="w-full border border-gray-300 rounded-lg h-10 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              className="w-full border border-gray-300 rounded-lg h-10 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-white rounded-lg h-10 mt-1 font-medium transition"
          >
            Sign Up
          </button>

          {/* Footer */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <span onClick={() => { closeRegister(); openLogin(); }} className="text-primary font-medium cursor-pointer hover:underline">
              Sign In
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
