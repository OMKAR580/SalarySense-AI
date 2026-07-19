"use client";

import {
  AnimatePresence,
  animate,
  motion,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type OTPStatus = "idle" | "error" | "success";

export interface OTPInputProps {
  length?: number;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  label?: string;
  hint?: string;
  successMessage?: string;
  errorMessage?: string;
  status?: OTPStatus;
  mask?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  "aria-label"?: string;
  className?: string;
}

export function OTPInput({
  length = 6,
  value: controlledValue,
  defaultValue = "",
  onChange,
  onComplete,
  label,
  hint,
  successMessage,
  errorMessage,
  status = "idle",
  mask = false,
  disabled = false,
  autoFocus = false,
  "aria-label": ariaLabel = "One-time passcode",
  className,
}: OTPInputProps) {
  const uid = useId();
  const reduce = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const slotsRef = useRef<HTMLDivElement>(null);

  const controlled = controlledValue !== undefined;

  const [slots, setSlots] = useState<string[]>(() =>
    toSlots(controlled ? controlledValue : defaultValue, length),
  );

  const [focused, setFocused] = useState(false);
  const [active, setActive] = useState(0);

  const joined = slots.join("");
  const joinedRef = useRef(joined);
  joinedRef.current = joined;

  useEffect(() => {
    if (!controlled) return;

    const incoming = sanitize(controlledValue, length);

    if (incoming !== joinedRef.current) {
      setSlots(toSlots(incoming, length));
    }
  }, [controlled, controlledValue, length]);

  const commit = (next: string[]) => {
    const wasComplete = slots.every((c) => c !== "");
    setSlots(next);

    const str = next.join("");

    onChange?.(str);

    if (!wasComplete && next.every((c) => c !== "")) {
      onComplete?.(str);
    }
  };

  const clearSlot = (idx: number) => {
    const next = [...slots];

    next[idx] = "";

    commit(next);
  };

  const slotFromClientX = (clientX: number) => {
    const els = slotsRef.current?.children;

    if (!els) return 0;

    for (let i = 0; i < els.length; i++) {
      if (clientX < els[i].getBoundingClientRect().right) return i;
    }

    return length - 1;
  };

  const insert = (raw: string, from = active) => {
    const digits = raw.replace(/\D/g, "");

    if (!digits) return;

    const next = [...slots];
    let i = from;

    for (const ch of digits) {
      if (i >= length) break;
      next[i] = ch;
      i++;
    }

    commit(next);
    setActive(Math.min(i, length - 1));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled || e.metaKey || e.ctrlKey || e.altKey) return;

    const k = e.key;

    if (/^[0-9]$/.test(k)) {
      e.preventDefault();
      insert(k);
    } else if (k === "Backspace") {
      e.preventDefault();

      if (slots[active]) {
        clearSlot(active);
      } else if (active > 0) {
        clearSlot(active - 1);
        setActive(active - 1);
      }
    } else if (k === "Delete") {
      e.preventDefault();
      clearSlot(active);
    } else if (k === "ArrowLeft") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (k === "ArrowRight") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, length - 1));
    } else if (k === "Home") {
      e.preventDefault();
      setActive(0);
    } else if (k === "End") {
      e.preventDefault();
      setActive(length - 1);
    }
  };

  const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    e.preventDefault();
    insert(e.clipboardData.getData("text"), active);
  };

  const onChangeNative = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = sanitize(e.target.value, length);

    if (!digits) return;

    commit(toSlots(digits, length));
    setActive(Math.min(digits.length, length - 1));
  };

  useEffect(() => {
    if (status !== "error" || reduce || !slotsRef.current) return;

    animate(
      slotsRef.current,
      {
        x: [0, -5, 5, -3, 3, -1, 0],
      },
      {
        duration: 0.45,
        ease: EASE_OUT,
      },
    );
  }, [status, reduce]);

  const showSuccess = status === "success";
  const activeIndex = focused ? active : -1;

  const message = showSuccess
    ? successMessage
    : status === "error"
      ? errorMessage
      : hint;

  return (
    <div className={cn("inline-flex flex-col gap-2 w-full items-center", className)}>
      {label ? (
        <label
          htmlFor={`${uid}-input`}
          className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1 self-start"
        >
          {label}
        </label>
      ) : null}

      <div
        className="relative inline-flex w-max"
        onMouseDown={(e) => {
          if (disabled) return;

          e.preventDefault();

          const firstEmpty = slots.indexOf("");
          const key = firstEmpty === -1 ? length - 1 : firstEmpty;

          setActive(Math.min(slotFromClientX(e.clientX), key));
          inputRef.current?.focus();
        }}
      >
        <input
          ref={inputRef}
          id={`${uid}-input`}
          inputMode="numeric"
          autoComplete="one-time-code"
          autoFocus={autoFocus}
          disabled={disabled}
          aria-label={ariaLabel}
          aria-invalid={status === "error"}
          value=""
          maxLength={length}
          onKeyDown={onKeyDown}
          onChange={onChangeNative}
          onPaste={onPaste}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="absolute inset-0 z-20 h-full w-full cursor-text bg-transparent text-transparent caret-transparent opacity-0 outline-none disabled:cursor-not-allowed"
        />

        <div ref={slotsRef} className="flex items-center gap-2">
          {Array.from({ length }, (_, i) => {
            const char = slots[i] ?? "";
            const isActive = i === activeIndex;

            return (
              <div
                key={`${uid}-${i}`}
                data-active={isActive}
                data-filled={char !== ""}
                className={cn(
                  "relative grid h-14 w-12 place-items-center overflow-hidden rounded-xl border text-xl font-bold tabular-nums transition-all duration-300",
                  "bg-white/[0.03] backdrop-blur-md",
                  showSuccess
                    ? "border-emerald-500/50 text-emerald-400 bg-emerald-500/[0.02]"
                    : status === "error"
                      ? "border-red-500/50 text-red-400 bg-red-500/[0.02]"
                      : char
                        ? "border-white/25 text-white bg-white/[0.06]"
                        : "border-white/[0.08] text-white/30",
                  isActive &&
                    !showSuccess &&
                    status !== "error" &&
                    "border-blue-500/80 text-white shadow-[0_0_15px_rgba(59,130,246,0.15)] bg-white/[0.08]",
                  disabled && "opacity-50",
                )}
              >
                {isActive && !showSuccess ? (
                  <motion.span
                    aria-hidden
                    animate={reduce ? undefined : { opacity: [1, 1, 0, 0] }}
                    transition={
                      reduce
                        ? undefined
                        : {
                            duration: 1,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          }
                    }
                    className={cn(
                      "pointer-events-none absolute top-1/2 h-6 w-px -translate-y-1/2 bg-blue-400",
                      char ? "right-3" : "left-1/2 -translate-x-1/2",
                    )}
                  />
                ) : null}

                <AnimatePresence initial={false}>
                  {char ? (
                    <motion.span
                      key={char}
                      initial={
                        reduce
                          ? {
                              opacity: 0,
                            }
                          : {
                              y: 14,
                              opacity: 0,
                              filter: "blur(4px)",
                            }
                      }
                      animate={
                        reduce
                          ? {
                              opacity: 1,
                            }
                          : {
                              y: 0,
                              opacity: 1,
                              filter: "blur(0px)",
                            }
                      }
                      exit={
                        reduce
                          ? {
                              opacity: 0,
                            }
                          : {
                              y: -14,
                              opacity: 0,
                              filter: "blur(4px)",
                            }
                      }
                      transition={
                        reduce
                          ? {
                              duration: 0,
                            }
                          : {
                              duration: 0.22,
                              ease: EASE_OUT,
                            }
                      }
                      className="absolute inset-0 grid place-items-center leading-none"
                    >
                      {mask ? "•" : char}
                    </motion.span>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <AnimatePresence>
          {showSuccess ? (
            <motion.span
              initial={
                reduce
                  ? {
                      opacity: 0,
                    }
                  : {
                      scale: 0.6,
                      opacity: 0,
                    }
              }
              animate={
                reduce
                  ? {
                      opacity: 1,
                    }
                  : {
                      scale: 1,
                      opacity: 1,
                    }
              }
              exit={
                reduce
                  ? {
                      opacity: 0,
                    }
                  : {
                      scale: 0.6,
                      opacity: 0,
                    }
              }
              transition={
                reduce
                  ? {
                      duration: 0,
                    }
                  : {
                      type: "spring",
                      stiffness: 500,
                      damping: 28,
                    }
              }
              className="pointer-events-none absolute -right-7 top-1/2 -translate-y-1/2 text-emerald-500"
              aria-hidden
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <title>Verified</title>
                <motion.path
                  d="M5 13l4 4L19 7"
                  initial={
                    reduce
                      ? {
                          pathLength: 1,
                        }
                      : {
                          pathLength: 0,
                        }
                  }
                  animate={{
                    pathLength: 1,
                  }}
                  transition={
                    reduce
                      ? {
                          duration: 0,
                        }
                      : {
                          duration: 0.35,
                          ease: EASE_OUT,
                          delay: 0.1,
                        }
                  }
                />
              </svg>
            </motion.span>
          ) : null}
        </AnimatePresence>
      </div>

      {message ? (
        <p
          aria-live="polite"
          className={cn(
            "text-xs mt-1",
            showSuccess
              ? "text-emerald-400"
              : status === "error"
                ? "text-red-400"
                : "text-slate-400",
          )}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}

function sanitize(raw: string | undefined, length: number) {
  return (raw ?? "").replace(/\D/g, "").slice(0, length);
}

function toSlots(raw: string | undefined, length: number) {
  const digits = sanitize(raw, length);

  return Array.from({ length }, (_, i) => digits[i] ?? "");
}
