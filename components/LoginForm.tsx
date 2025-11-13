"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
  const [pin, setPin] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasAttemptedRef = useRef(false);

  // Auto-submit when PIN is complete
  useEffect(() => {
    if (pin.length === 4 && !hasAttemptedRef.current) {
      hasAttemptedRef.current = true;

      // Add a slight delay for smooth UX
      setTimeout(() => {
        setIsAuthenticating(true);

        setTimeout(() => {
          if (login(pin)) {
            const redirectTo = searchParams.get("redirect") || "/dashboard";
            router.push(redirectTo);
          } else {
            setIsAuthenticating(false);
            hasAttemptedRef.current = false;
            // Shake animation on error
            const input = document.querySelector('input[type="password"]');
            if (input) {
              input.classList.add("animate-shake");
              setTimeout(() => input.classList.remove("animate-shake"), 500);
            }
            // Clear PIN on error
            setPin("");
          }
        }, 300);
      }, 200);
    }
  }, [pin, login, router, searchParams]);

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow digits
    if (value.length <= 4) {
      setPin(value);
      hasAttemptedRef.current = false;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black relative overflow-hidden">
      {/* Ambient background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-black to-cyan-950/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0.8),rgba(0,0,0,1))]"></div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:100px_100px]"></div>

      <div className="relative z-10 max-w-3xl w-full px-8">
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <Image
            src="/logo.png"
            alt="Legal AI Lab Logo"
            width={100}
            height={100}
            className="object-contain opacity-90"
            priority
          />
        </div>

        {/* Quote Section */}
        <div className="text-center mb-20">
          <p className="text-2xl md:text-3xl font-light text-cyan-100/90 leading-relaxed mb-4 tracking-wide">
            One way you create luck and get luckier is to put yourself out there
            more.
          </p>
          <p className="text-xl md:text-2xl font-extralight text-cyan-300/70 leading-relaxed tracking-wide">
            You systematically put yourself out there where good things can
            happen to you.
          </p>
        </div>

        {/* PIN Input - Centered and minimal */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <input
              type="password"
              value={pin}
              onChange={handlePinChange}
              maxLength={4}
              disabled={isAuthenticating}
              autoFocus
              className="w-full px-0 py-6 text-5xl tracking-[0.8em] text-center bg-transparent border-b-2 border-cyan-900/50 text-cyan-100 placeholder-cyan-700/50 focus:outline-none focus:border-cyan-500 transition-all duration-300 font-mono disabled:opacity-50"
              placeholder="••••"
              autoComplete="current-password"
            />
            <div
              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
              style={{ width: pin ? `${(pin.length / 4) * 100}%` : "0%" }}
            ></div>
          </div>

          {/* Status indicator */}
          {isAuthenticating && (
            <div className="text-center mt-8">
              <div className="inline-flex items-center gap-3 text-cyan-400/70 text-sm tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
                AUTHENTICATING
              </div>
            </div>
          )}
        </div>

        {/* Subtle hint */}
        <div className="text-center mt-16">
          <p className="text-xs text-cyan-900/50 tracking-widest uppercase">
            Access Control System v2.0
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-10px);
          }
          75% {
            transform: translateX(10px);
          }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
