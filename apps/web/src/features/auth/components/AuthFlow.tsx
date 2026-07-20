"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowLeft, ArrowRight, Eye, EyeOff, KeyRound, Mail, RefreshCw, ShieldCheck, UserCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { forwardRef, useEffect, useRef, useState } from "react";

import apiClient from "@/lib/apiClient";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { OTPInput } from "./OTPInput";

type FlowMode = "login" | "signup";
type Step = "get-started" | "profile" | "password" | "confirm-password" | "verify-email";

// --- GLASS BUTTON COMPONENT (From Reference Code) ---
const glassButtonVariants = cva(
  "relative isolate all-unset cursor-pointer rounded-full transition-all flex items-center justify-center w-full",
  {
    variants: {
      size: {
        default: "text-base font-medium",
        sm: "text-sm font-medium",
        lg: "text-lg font-medium",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const glassButtonTextVariants = cva(
  "glass-button-text relative block select-none tracking-tighter w-full text-center flex items-center justify-center",
  {
    variants: {
      size: {
        default: "px-6 py-3",
        sm: "px-4 py-2",
        lg: "px-8 py-4",
        icon: "flex h-9 w-9 items-center justify-center",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
  contentClassName?: string;
}

const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, children, size, contentClassName, onClick, ...props }, ref) => {
    const handleWrapperClick = (e: React.MouseEvent<HTMLDivElement>) => {
      const button = e.currentTarget.querySelector("button");
      if (button && e.target !== button) button.click();
    };
    return (
      <div
        className={cn("glass-button-wrap cursor-pointer rounded-full relative w-full", className)}
        onClick={handleWrapperClick}
      >
        <button
          className={cn("glass-button relative z-10 w-full", glassButtonVariants({ size }))}
          ref={ref}
          onClick={onClick}
          {...props}
        >
          <span className={cn(glassButtonTextVariants({ size }), contentClassName)}>{children}</span>
        </button>
        <div className="glass-button-shadow rounded-full pointer-events-none"></div>
      </div>
    );
  }
);
GlassButton.displayName = "GlassButton";

// --- SOCIAL SVG ICONS ---
const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5 flex-shrink-0">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.5 24c0-1.6-.15-3.15-.45-4.65H24v9h12.75c-.55 2.85-2.15 5.25-4.55 6.85l7 5.4C43.3 35.15 46.5 30.15 46.5 24z"/>
    <path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.98-6.19z"/>
    <path fill="#34A853" d="M24 38.5c-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48c6.48 0 11.93-2.13 15.89-5.81l-7-5.4c-2.4 1.62-5.48 2.71-8.89 2.71z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);



// --- MAIN COMPONENT ---
export const AuthFlow = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuthSession = useAuthStore((state) => state.setAuthSession);

  // Flow Settings
  const [mode, setMode] = useState<FlowMode>("login");
  const [step, setStep] = useState<Step>("get-started");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form Fields
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationToken, setVerificationToken] = useState("");
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [oauthProvider, setOauthProvider] = useState("");
  const [oauthProviderAccountId, setOauthProviderAccountId] = useState("");

  // UI state Toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Input Refs
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const confirmPasswordInputRef = useRef<HTMLInputElement>(null);

  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleEmailNext = () => {
    setError(null);
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setStep("password");
  };

  const handleProfileNext = () => {
    setError(null);
    if (!firstName.trim()) {
      setError("First name is required.");
      return;
    }
    if (!lastName.trim()) {
      setError("Last name is required.");
      return;
    }
    if (!username.trim()) {
      setError("Username is required.");
      return;
    }
    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setStep("password");
  };

  const handlePasswordNext = async () => {
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (mode === "signup") {
      setStep("confirm-password");
    } else {
      await executeLogin();
    }
  };

  const executeLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.post("/auth/login", {
        identifier: email,
        password: password,
      });

      // Always use username returned by backend; fall back to email prefix only if unavailable
      const resolvedUsername = data.username || email.split("@")[0] || "";

      setAuthSession(
        data.access_token,
        data.refresh_token || "",
        data.user_id,
        data.email || email,
        resolvedUsername
      );

      router.push("/predict");
    } catch (err: any) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const executeRegister = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.post("/auth/register", {
        email: email,
        username: username,
        password: password,
        confirm_password: confirmPassword,
        first_name: firstName,
        last_name: lastName,
        accept_terms: true,
        oauth_provider: oauthProvider || null,
        oauth_provider_account_id: oauthProviderAccountId || null,
      });

      if (data.verification_required) {
        setSuccessMessage("Account created! email verification code sent to your spam box.");
        setStep("verify-email");
      } else {
        await executeLogin();
      }
    } catch (err: any) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const executeVerifyEmail = async (tokenOverride?: string) => {
    const token = tokenOverride !== undefined ? tokenOverride : verificationToken;
    if (!token.trim()) {
      setError("Please enter the verification code.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await apiClient.post("/auth/verify-email", { token });

      setVerificationSuccess(true);
      setSuccessMessage("Email verified! You can now log in.");
      setError(null);
      // Keep email pre-filled so user goes straight to password step
      setMode("login");
      setStep("password");
    } catch (err: any) {
      setError(err.message || "Verification failed. The code may be invalid or expired.");
    } finally {
      setLoading(false);
    }
  };

  const [resendLoading, setResendLoading] = useState(false);

  const executeResendOTP = async () => {
    if (!email) {
      setError("Email address is required to resend the code.");
      return;
    }
    setResendLoading(true);
    setError(null);
    setSuccessMessage(null);
    setVerificationSuccess(false);
    try {
      await apiClient.post("/auth/resend-verification", { email });
      setSuccessMessage("email verification code sent to your spam box.");
    } catch (err: any) {
      setError(err.message || "Failed to resend code. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    const apiBase = process.env["NEXT_PUBLIC_API_URL"] || "http://localhost:8000/api/v1";
    localStorage.setItem("oauth_provider", provider);
    window.location.href = `${apiBase}/auth/oauth/${provider}/login`;
  };

  const resetForm = () => {
    setError(null);
    setSuccessMessage(null);
    setVerificationSuccess(false);
    setEmail("");
    setFirstName("");
    setLastName("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setVerificationToken("");
    setOauthProvider("");
    setOauthProviderAccountId("");
  };

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token") || "";
    const userId = searchParams.get("user_id");
    const emailParam = searchParams.get("email");
    const usernameParam = searchParams.get("username");
    const mfaRequired = searchParams.get("mfa_required");
    const challengeId = searchParams.get("challenge_id");
    const errorParam = searchParams.get("error");
    const oauthRegister = searchParams.get("oauth_register");

    if (oauthRegister === "true" && emailParam && searchParams.get("provider") && searchParams.get("provider_account_id")) {
      window.history.replaceState({}, document.title, window.location.pathname);
      
      setEmail(emailParam);
      setOauthProvider(searchParams.get("provider") || "");
      setOauthProviderAccountId(searchParams.get("provider_account_id") || "");
      setMode("signup");
      setStep("profile");
    } else if (accessToken && userId && emailParam && usernameParam) {
      // Clean up URL parameters for security
      window.history.replaceState({}, document.title, window.location.pathname);
      
      setAuthSession(
        accessToken,
        refreshToken,
        userId,
        emailParam,
        usernameParam
      );
      router.push("/predict");
    } else if (mfaRequired && challengeId) {
      window.history.replaceState({}, document.title, window.location.pathname);
      setError("MFA verification is required for this account.");
    } else if (errorParam) {
      window.history.replaceState({}, document.title, window.location.pathname);
      setError(errorParam || "Social login failed. Please try again.");
    }
  }, [searchParams, router, setAuthSession]);

  useEffect(() => {
    if (step === "password") setTimeout(() => passwordInputRef.current?.focus(), 500);
    else if (step === "confirm-password") setTimeout(() => confirmPasswordInputRef.current?.focus(), 500);
  }, [step]);

  return (
    <div className="auth-liquid-container w-full max-w-md bg-white/[0.02] border border-white/[0.08] backdrop-blur-3xl rounded-[28px] p-8 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.06)] relative overflow-hidden flex flex-col min-h-[500px]">
      
      {/* GLOWING LIQUID GLASS STYLES BLOCK */}
      <style>{`
        .auth-liquid-container {
          --background: #ffffff;
          --foreground: #ffffff;
        }
        
        @property --angle-1 { syntax: "<angle>"; inherits: false; initial-value: -75deg; }
        @property --angle-2 { syntax: "<angle>"; inherits: false; initial-value: -45deg; }
        
        .glass-button-wrap {
          --anim-time: 400ms;
          --anim-ease: cubic-bezier(0.25, 1, 0.5, 1);
          --border-width: clamp(1px, 0.0625em, 4px);
          position: relative;
          z-index: 2;
          transform-style: preserve-3d;
          transition: transform var(--anim-time) var(--anim-ease);
        }
        .glass-button-wrap:has(.glass-button:active) { transform: rotateX(25deg); }
        .glass-button-shadow {
          --shadow-cutoff-fix: 2em;
          position: absolute;
          width: calc(100% + var(--shadow-cutoff-fix));
          height: calc(100% + var(--shadow-cutoff-fix));
          top: calc(0% - var(--shadow-cutoff-fix) / 2);
          left: calc(0% - var(--shadow-cutoff-fix) / 2);
          filter: blur(clamp(2px, 0.125em, 12px));
          transition: filter var(--anim-time) var(--anim-ease);
          pointer-events: none;
          z-index: 0;
        }
        .glass-button-shadow::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05));
          width: calc(100% - var(--shadow-cutoff-fix) - 0.25em);
          height: calc(100% - var(--shadow-cutoff-fix) - 0.25em);
          top: calc(var(--shadow-cutoff-fix) - 0.5em);
          left: calc(var(--shadow-cutoff-fix) - 0.875em);
          padding: 0.125em;
          box-sizing: border-box;
          mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask-composite: exclude;
          transition: all var(--anim-time) var(--anim-ease);
          opacity: 1;
        }
        .glass-button {
          -webkit-tap-highlight-color: transparent;
          backdrop-filter: blur(clamp(2px, 0.125em, 6px));
          transition: all var(--anim-time) var(--anim-ease);
          background: linear-gradient(-75deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.16) 50%, rgba(255, 255, 255, 0.06) 100%);
          box-shadow: inset 0 0.125em 0.125em rgba(255, 255, 255, 0.15), 
                      inset 0 -0.125em 0.125em rgba(0, 0, 0, 0.15), 
                      0 0.25em 0.125em -0.125em rgba(0, 0, 0, 0.3), 
                      0 0 0.1em 0.25em inset rgba(255, 255, 255, 0.05);
        }
        .glass-button:hover {
          transform: scale(0.975);
          backdrop-filter: blur(0.01em);
          background: linear-gradient(-75deg, rgba(255, 255, 255, 0.09) 0%, rgba(255, 255, 255, 0.22) 50%, rgba(255, 255, 255, 0.09) 100%);
          box-shadow: inset 0 0.125em 0.125em rgba(255, 255, 255, 0.2), 
                      inset 0 -0.125em 0.125em rgba(0, 0, 0, 0.15), 
                      0 0.15em 0.05em -0.1em rgba(0, 0, 0, 0.35), 
                      0 0 0.05em 0.1em inset rgba(255, 255, 255, 0.1);
        }
        .glass-button-text {
          color: rgba(255, 255, 255, 0.95);
          text-shadow: 0em 0.05em 0.05em rgba(0, 0, 0, 0.3);
          transition: all var(--anim-time) var(--anim-ease);
        }
        .glass-button:hover .glass-button-text {
          text-shadow: 0.025em 0.025em 0.025em rgba(0, 0, 0, 0.4);
        }
        .glass-button-text::after {
          content: "";
          display: block;
          position: absolute;
          width: calc(100% - var(--border-width));
          height: calc(100% - var(--border-width));
          top: calc(0% + var(--border-width) / 2);
          left: calc(0% + var(--border-width) / 2);
          box-sizing: border-box;
          border-radius: 9999px;
          overflow: clip;
          background: linear-gradient(var(--angle-2), transparent 0%, rgba(255, 255, 255, 0.3) 40% 50%, transparent 55%);
          z-index: 3;
          mix-blend-mode: screen;
          pointer-events: none;
          background-size: 200% 200%;
          background-position: 0% 50%;
          transition: background-position calc(var(--anim-time) * 1.25) var(--anim-ease), --angle-2 calc(var(--anim-time) * 1.25) var(--anim-ease);
        }
        .glass-button:hover .glass-button-text::after { background-position: 25% 50%; }
        .glass-button:active .glass-button-text::after { background-position: 50% 15%; --angle-2: -15deg; }
        .glass-button::after {
          content: "";
          position: absolute;
          z-index: 1;
          inset: 0;
          border-radius: 9999px;
          width: calc(100% + var(--border-width));
          height: calc(100% + var(--border-width));
          top: calc(0% - var(--border-width) / 2);
          left: calc(0% - var(--border-width) / 2);
          padding: var(--border-width);
          box-sizing: border-box;
          background: conic-gradient(from var(--angle-1) at 50% 50%, rgba(255, 255, 255, 0.25) 0%, transparent 5% 40%, rgba(255, 255, 255, 0.25) 50%, transparent 60% 95%, rgba(255, 255, 255, 0.25) 100%), 
                      linear-gradient(180deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
          mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask-composite: exclude;
          transition: all var(--anim-time) var(--anim-ease), --angle-1 500ms ease;
          box-shadow: inset 0 0 0 calc(var(--border-width) / 2) rgba(255, 255, 255, 0.15);
          pointer-events: none;
        }
        .glass-button:hover::after { --angle-1: -125deg; }
        .glass-button:active::after { --angle-1: -75deg; }
        .glass-button-wrap:has(.glass-button:hover) .glass-button-shadow { filter: blur(clamp(2px, 0.0625em, 6px)); }
        .glass-button-wrap:has(.glass-button:hover) .glass-button-shadow::after { top: calc(var(--shadow-cutoff-fix) - 0.875em); opacity: 1; }
        .glass-button-wrap:has(.glass-button:active) .glass-button-shadow { filter: blur(clamp(2px, 0.125em, 12px)); }
        .glass-button-wrap:has(.glass-button:active) .glass-button-shadow::after { top: calc(var(--shadow-cutoff-fix) - 0.5em); opacity: 0.75; }
        .glass-button-wrap:has(.glass-button:active) .glass-button-text { text-shadow: 0.025em 0.25em 0.05em rgba(0, 0, 0, 0.4); }

        /* --- GLASS INPUT STYLES --- */
        .glass-input-wrap { position: relative; z-index: 2; transform-style: preserve-3d; border-radius: 9999px; }
        .glass-input {
          display: flex;
          position: relative;
          width: 100%;
          align-items: center;
          gap: 0.5rem;
          border-radius: 9999px;
          padding: 0.25rem;
          -webkit-tap-highlight-color: transparent;
          backdrop-filter: blur(clamp(2px, 0.125em, 6px));
          transition: all 400ms cubic-bezier(0.25, 1, 0.5, 1);
          background: linear-gradient(-75deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.05) 100%);
          box-shadow: inset 0 0.125em 0.125em rgba(255, 255, 255, 0.1), 
                      inset 0 -0.125em 0.125em rgba(0, 0, 0, 0.15), 
                      0 0.25em 0.125em -0.125em rgba(0, 0, 0, 0.2), 
                      0 0 0.1em 0.25em inset rgba(255, 255, 255, 0.04);
        }
        .glass-input-wrap:focus-within .glass-input {
          backdrop-filter: blur(0.01em);
          background: linear-gradient(-75deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.08) 100%);
          box-shadow: inset 0 0.125em 0.125em rgba(255, 255, 255, 0.15), 
                      inset 0 -0.125em 0.125em rgba(0, 0, 0, 0.15), 
                      0 0.15em 0.05em -0.1em rgba(0, 0, 0, 0.25), 
                      0 0 0.05em 0.1em inset rgba(255, 255, 255, 0.08);
        }
        .glass-input::after {
          content: "";
          position: absolute;
          z-index: 1;
          inset: 0;
          border-radius: 9999px;
          width: calc(100% + clamp(1px, 0.0625em, 4px));
          height: calc(100% + clamp(1px, 0.0625em, 4px));
          top: calc(0% - clamp(1px, 0.0625em, 4px) / 2);
          left: calc(0% - clamp(1px, 0.0625em, 4px) / 2);
          padding: clamp(1px, 0.0625em, 4px);
          box-sizing: border-box;
          background: conic-gradient(from var(--angle-1) at 50% 50%, rgba(255, 255, 255, 0.2) 0%, transparent 5% 40%, rgba(255, 255, 255, 0.2) 50%, transparent 60% 95%, rgba(255, 255, 255, 0.2) 100%), 
                      linear-gradient(180deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08));
          mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask-composite: exclude;
          transition: all 400ms cubic-bezier(0.25, 1, 0.5, 1), --angle-1 500ms ease;
          box-shadow: inset 0 0 0 calc(clamp(1px, 0.0625em, 4px) / 2) rgba(255, 255, 255, 0.1);
          pointer-events: none;
        }
        .glass-input-wrap:focus-within .glass-input::after { --angle-1: -125deg; }
        .glass-input-text-area { position: absolute; inset: 0; border-radius: 9999px; pointer-events: none; }
        .glass-input-text-area::after {
          content: "";
          display: block;
          position: absolute;
          width: calc(100% - clamp(1px, 0.0625em, 4px));
          height: calc(100% - clamp(1px, 0.0625em, 4px));
          top: calc(0% + clamp(1px, 0.0625em, 4px) / 2);
          left: calc(0% + clamp(1px, 0.0625em, 4px) / 2);
          box-sizing: border-box;
          border-radius: 9999px;
          overflow: clip;
          background: linear-gradient(var(--angle-2), transparent 0%, rgba(255, 255, 255, 0.25) 40% 50%, transparent 55%);
          z-index: 3;
          mix-blend-mode: screen;
          pointer-events: none;
          background-size: 200% 200%;
          background-position: 0% 50%;
          transition: background-position calc(400ms * 1.25) cubic-bezier(0.25, 1, 0.5, 1), --angle-2 calc(400ms * 1.25) cubic-bezier(0.25, 1, 0.5, 1);
        }
        .glass-input-wrap:focus-within .glass-input-text-area::after { background-position: 25% 50%; }
      `}</style>

      <div className="flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: LOGIN ENTRY SCREEN */}
          {step === "get-started" && mode === "login" && (
            <motion.div
              key="login-started"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col text-center"
            >
              <h1 className="text-3xl font-bold tracking-tight text-white mb-2 font-sans">
                Get started with Us
              </h1>
              <p className="text-slate-500 text-xs mb-8 font-medium">
                Sign in using your corporate account or email credentials.
              </p>

              {/* Social Login Grid (2x2 Structure) */}
              <div className="grid grid-cols-2 gap-3.5 mb-8">
                {/* Google */}
                <GlassButton
                  onClick={() => handleSocialLogin("google")}
                  size="default"
                >
                  <span className="flex items-center justify-center gap-2">
                    <GoogleIcon />
                    Google
                  </span>
                </GlassButton>

                {/* Github */}
                <GlassButton
                  onClick={() => handleSocialLogin("github")}
                  size="default"
                >
                  <span className="flex items-center justify-center gap-2">
                    <GitHubIcon />
                    GitHub
                  </span>
                </GlassButton>
              </div>

              {/* OR Divider */}
              <div className="relative flex items-center justify-center mb-8">
                <div className="w-full border-t border-white/[0.08]" />
                <span className="absolute bg-[#02040a] px-4 text-[10px] uppercase font-bold tracking-widest text-slate-500">
                  OR
                </span>
              </div>

              {/* Email Input wrapped in liquid glass classes */}
              <div className="glass-input-wrap w-full mb-6">
                <div className="glass-input h-14">
                  <span className="glass-input-text-area"></span>
                  <div className="relative z-10 flex-shrink-0 flex items-center justify-center w-10 pl-2">
                    <Mail className="h-5 w-5 text-white/80" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    onKeyDown={(e) => e.key === "Enter" && handleEmailNext()}
                    className="relative z-10 h-full flex-grow bg-transparent text-white placeholder:text-white/40 focus:outline-none pl-2 text-sm"
                  />
                  <div className={cn("relative z-10 flex-shrink-0 overflow-hidden transition-all duration-300 ease-in-out pr-1.5", validateEmail(email) ? "w-11" : "w-0")}>
                    <GlassButton
                      type="button"
                      onClick={handleEmailNext}
                      size="icon"
                    >
                      <ArrowRight className="w-4 h-4 text-white" />
                    </GlassButton>
                  </div>
                </div>
              </div>

              {/* Switch to Registration */}
              <button
                onClick={() => {
                  resetForm();
                  setMode("signup");
                  setStep("profile");
                }}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors mt-2"
              >
                Need a new account? Register here
              </button>
            </motion.div>
          )}

          {/* STEP 2: REGISTRATION PROFILE SCREEN */}
          {step === "profile" && mode === "signup" && (
            <motion.div
              key="signup-profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col"
            >
              <h1 className="text-3xl font-bold tracking-tight text-white mb-2 text-center font-sans">
                Create your account
              </h1>
              <p className="text-slate-500 text-xs text-center mb-8">
                Enter your details to register a prediction workspace.
              </p>

              {/* Only show social buttons if not in oauth registration flow */}
              {!oauthProvider && (
                <>
                  <div className="grid grid-cols-2 gap-3.5 mb-8">
                    {/* Google */}
                    <GlassButton
                      onClick={() => handleSocialLogin("google")}
                      size="default"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <GoogleIcon />
                        Google
                      </span>
                    </GlassButton>

                    {/* Github */}
                    <GlassButton
                      onClick={() => handleSocialLogin("github")}
                      size="default"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <GitHubIcon />
                        GitHub
                      </span>
                    </GlassButton>
                  </div>

                  <div className="relative flex items-center justify-center mb-8">
                    <div className="w-full border-t border-white/[0.08]" />
                    <span className="absolute bg-[#02040a] px-4 text-[10px] uppercase font-bold tracking-widest text-slate-500">
                      OR
                    </span>
                  </div>
                </>
              )}

              {/* First Name & Last Name */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col gap-1.5 text-left">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-2">
                    First Name
                  </span>
                  <div className="glass-input-wrap w-full">
                    <div className="glass-input h-12">
                      <span className="glass-input-text-area"></span>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First Name"
                        className="relative z-10 h-full flex-grow bg-transparent text-white placeholder:text-white/40 focus:outline-none pl-4 text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 text-left">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-2">
                    Last Name
                  </span>
                  <div className="glass-input-wrap w-full">
                    <div className="glass-input h-12">
                      <span className="glass-input-text-area"></span>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last Name"
                        className="relative z-10 h-full flex-grow bg-transparent text-white placeholder:text-white/40 focus:outline-none pl-4 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Username */}
              <div className="flex flex-col gap-1.5 text-left w-full mb-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-2">
                  Username
                </span>
                <div className="glass-input-wrap w-full">
                  <div className="glass-input h-12">
                    <span className="glass-input-text-area"></span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username"
                      className="relative z-10 h-full flex-grow bg-transparent text-white placeholder:text-white/40 focus:outline-none pl-4 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Email Address */}
              <div className="flex flex-col gap-1.5 text-left w-full mb-6">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-2">
                  Email Address
                </span>
                <div className="glass-input-wrap w-full">
                  <div className="glass-input h-14">
                    <span className="glass-input-text-area"></span>
                    <div className="relative z-10 flex-shrink-0 flex items-center justify-center w-10 pl-2">
                      <Mail className="h-5 w-5 text-white/80" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      disabled={!!oauthProvider}
                      onKeyDown={(e) => e.key === "Enter" && handleProfileNext()}
                      className="relative z-10 h-full flex-grow bg-transparent text-white placeholder:text-white/40 focus:outline-none pl-2 text-sm disabled:opacity-60"
                    />
                    <div className={cn("relative z-10 flex-shrink-0 overflow-hidden transition-all duration-300 ease-in-out pr-1.5", validateEmail(email) ? "w-11" : "w-0")}>
                      <GlassButton
                        type="button"
                        onClick={handleProfileNext}
                        size="icon"
                      >
                        <ArrowRight className="w-4 h-4 text-white" />
                      </GlassButton>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-4">
                <button
                  onClick={() => {
                    resetForm();
                    setMode("login");
                    setStep("get-started");
                  }}
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                >
                  Already have an account? Sign In
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: PASSWORD SCREEN */}
          {step === "password" && (
            <motion.div
              key="step-password"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col"
            >
              <h1 className="text-3xl font-bold tracking-tight text-white mb-2 text-center font-sans">
                {mode === "signup" ? "Create your password" : "Enter your password"}
              </h1>
              <p className="text-slate-500 text-xs text-center mb-8">
                {mode === "signup"
                  ? "Your password must be at least 8 characters long."
                  : "Enter your account password to authorize your session."}
              </p>

              {/* Prefilled email */}
              <div className="flex flex-col gap-1.5 mb-5 text-left w-full">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-2">
                  Account Identifier
                </span>
                <div className="glass-input-wrap w-full">
                  <div className="glass-input h-13 px-5 text-sm text-slate-300 flex items-center gap-3">
                    <Mail className="w-4.5 h-4.5 text-slate-400" />
                    <span className="truncate relative z-10">
                      {mode === "signup" && firstName ? `${firstName} ${lastName} (${email})` : email}
                    </span>
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5 text-left w-full">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-2">
                  Password
                </span>
                <div className="glass-input-wrap w-full">
                  <div className="glass-input h-14">
                    <span className="glass-input-text-area"></span>
                    <div className="relative z-10 flex-shrink-0 flex items-center justify-center w-10 pl-2">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-white/80 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <input
                      ref={passwordInputRef}
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      onKeyDown={(e) => e.key === "Enter" && handlePasswordNext()}
                      className="relative z-10 h-full flex-grow bg-transparent text-white placeholder:text-white/40 focus:outline-none pl-2 text-sm"
                    />
                    <div className={cn("relative z-10 flex-shrink-0 overflow-hidden transition-all duration-300 ease-in-out pr-1.5", password.length >= 8 ? "w-11" : "w-0")}>
                      <GlassButton
                        type="button"
                        onClick={handlePasswordNext}
                        disabled={loading}
                        size="icon"
                      >
                        {loading ? (
                          <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        ) : (
                          <ArrowRight className="w-4 h-4 text-white" />
                        )}
                      </GlassButton>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-8 px-2">
                <button
                  onClick={() => {
                    setError(null);
                    setStep(mode === "signup" ? "profile" : "get-started");
                  }}
                  className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 font-medium transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Go back
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: CONFIRM PASSWORD SCREEN */}
          {step === "confirm-password" && mode === "signup" && (
            <motion.div
              key="step-confirm-password"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col"
            >
              <h1 className="text-3xl font-bold tracking-tight text-white mb-2 text-center font-sans">
                One Last Step
              </h1>
              <p className="text-slate-500 text-xs text-center mb-8 font-medium">
                Confirm your password to create your prediction account.
              </p>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5 text-left w-full">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-2">
                  Confirm Password
                </span>
                <div className="glass-input-wrap w-full">
                  <div className="glass-input h-14">
                    <span className="glass-input-text-area"></span>
                    <div className="relative z-10 flex-shrink-0 flex items-center justify-center w-10 pl-2">
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-white/80 hover:text-white transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <input
                      ref={confirmPasswordInputRef}
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm Password"
                      onKeyDown={(e) => e.key === "Enter" && executeRegister()}
                      className="relative z-10 h-full flex-grow bg-transparent text-white placeholder:text-white/40 focus:outline-none pl-2 text-sm"
                    />
                    <div className={cn("relative z-10 flex-shrink-0 overflow-hidden transition-all duration-300 ease-in-out pr-1.5", confirmPassword.length >= 8 ? "w-11" : "w-0")}>
                      <GlassButton
                        type="button"
                        onClick={executeRegister}
                        disabled={loading}
                        size="icon"
                      >
                        {loading ? (
                          <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        ) : (
                          <ArrowRight className="w-4 h-4 text-white" />
                        )}
                      </GlassButton>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start mt-8 px-2">
                <button
                  onClick={() => {
                    setError(null);
                    setStep("password");
                  }}
                  className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 font-medium transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Go back
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: EMAIL VERIFICATION SCREEN */}
          {step === "verify-email" && (
            <motion.div
              key="step-verify-email"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col"
            >
              <div className="mx-auto w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/25 mb-4">
                <UserCheck className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white mb-2 text-center font-sans">
                Verify your Email
              </h1>
              <p className="text-slate-500 text-xs text-center mb-8 leading-normal px-2">
                Please enter the verification token sent to your email to activate your account.
              </p>

              {/* Verification Token */}
              <div className="flex flex-col items-center gap-4 text-left w-full mb-2">
                <OTPInput
                  length={6}
                  value={verificationToken}
                  onChange={setVerificationToken}
                  onComplete={(val) => {
                    setVerificationToken(val);
                    setTimeout(() => {
                      executeVerifyEmail(val);
                    }, 50);
                  }}
                  status={error ? "error" : verificationSuccess ? "success" : "idle"}
                  disabled={loading}
                  autoFocus
                />
                
                <div className={cn("relative z-10 flex-shrink-0 overflow-hidden transition-all duration-300 ease-in-out pr-1.5 mt-2", verificationToken.length === 6 ? "w-full max-w-[200px] h-12" : "w-0 h-0 opacity-0")}>
                  <GlassButton
                    type="button"
                    onClick={() => executeVerifyEmail(verificationToken)}
                    disabled={loading}
                    className="h-full"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <span className="flex items-center justify-center gap-1.5 text-white w-full">Verify Code <ArrowRight className="w-4 h-4" /></span>
                    )}
                  </GlassButton>
                </div>
              </div>

              <div className="flex items-center justify-between mt-8 px-2">
                <button
                  onClick={() => {
                    setError(null);
                    setSuccessMessage(null);
                    setMode("login");
                    setStep("get-started");
                  }}
                  className="text-xs text-slate-500 hover:text-slate-300 font-medium transition-colors"
                >
                  Return to login
                </button>

                {/* Resend OTP */}
                <button
                  onClick={executeResendOTP}
                  disabled={resendLoading}
                  className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendLoading ? (
                    <RefreshCw className="w-3 h-3 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3 h-3" />
                  )}
                  Resend code
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Alert Error Box */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2.5 shadow-lg backdrop-blur-md z-20"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="leading-tight">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alert Success Box */}
      <AnimatePresence>
        {successMessage && !error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2.5 shadow-lg backdrop-blur-md z-20"
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span className="leading-tight">{successMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
