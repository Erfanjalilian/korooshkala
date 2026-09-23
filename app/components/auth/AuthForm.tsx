"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { LockKeyhole, MessageCircle, ShieldCheck } from "lucide-react";
import { clearStoredAuthUser, storeAuthUser } from "./auth-storage";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 90;

export default function AuthForm() {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    fetch("/api/auth", { cache: "no-store" }).then((response) => {
      if (response.ok) window.location.replace("/account");
      else clearStoredAuthUser();
    }).catch(() => clearStoredAuthUser());
  }, []);

  useEffect(() => {
    if (secondsLeft === 0) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(current - 1, 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [secondsLeft]);

  const requestCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedPhone = phone.replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit))).replace(/\D/g, "");

    if (normalizedPhone.length < 10) {
      setError("لطفاً شماره موبایل معتبر وارد کنید.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "request", phone: normalizedPhone }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "ارسال کد انجام نشد.");
      setPhone(normalizedPhone);
      setStep("otp");
      setSecondsLeft(RESEND_SECONDS);
      window.setTimeout(() => otpRefs.current[0]?.focus(), 0);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "ارسال کد انجام نشد.");
    } finally {
      setLoading(false);
    }
  };

  const updateOtp = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const nextOtp = [...otp];
    nextOtp[index] = digit;
    setOtp(nextOtp);
    setError("");

    if (digit && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, key: string) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const verifyCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (otp.join("").length !== OTP_LENGTH) {
      setError("کد تأیید ۶ رقمی را کامل وارد کنید.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", phone, code: otp.join("") }),
      });
      const result = (await response.json()) as { error?: string; user?: { id: string; phone: string; name: string } };
      if (!response.ok) throw new Error(result.error || "کد واردشده صحیح نیست.");
      if (!result.user) throw new Error("اطلاعات حساب کاربری دریافت نشد.");
      storeAuthUser(result.user);
      const redirectTarget = new URLSearchParams(window.location.search).get("redirect") || "/account";
      window.location.href = redirectTarget;
    } catch (verificationError) {
      setError(verificationError instanceof Error ? verificationError.message : "کد واردشده صحیح نیست.");
    } finally {
      setLoading(false);
    }
  };

  const resendCode = () => {
    if (secondsLeft > 0) return;
    setOtp(Array(OTP_LENGTH).fill(""));
    void requestCode({ preventDefault: () => undefined } as FormEvent<HTMLFormElement>);
  };

  return (
    <>
      <div className="mb-8 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-white shadow-[0_10px_24px_rgba(37,99,235,0.18)]">
          {step === "phone" ? <MessageCircle aria-hidden="true" size={27} /> : <LockKeyhole aria-hidden="true" size={27} />}
        </div>
        <h1 className="mt-5 text-2xl font-extrabold text-[#111827]">
          {step === "phone" ? "ورود به فروشگاه" : "کد تأیید را وارد کنید"}
        </h1>
        <p className="mt-3 text-sm leading-7 text-[#6B7280]">
          {step === "phone" ? "برای ورود یا ثبت‌نام، شماره موبایل خود را وارد کنید." : `کد ارسال‌شده به ${phone} را وارد کنید.`}
        </p>
      </div>

      {step === "phone" ? (
        <form onSubmit={requestCode} className="grid gap-5">
          <label className="grid gap-2 text-sm font-semibold text-[#111827]">
            شماره موبایل
            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="۰۹۱۲۱۲۳۴۵۶۷"
              dir="ltr"
              aria-label="شماره موبایل"
              className="h-13 rounded-xl border border-[#E5E7EB] bg-[#F5F7FA] px-4 text-left text-sm outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-[#2563EB]/10"
            />
          </label>
          <button type="submit" disabled={loading} className="h-12 rounded-xl bg-[#2563EB] text-sm font-bold text-white transition hover:bg-[#7C3AED] disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2563EB]/20">
            {loading ? "در حال ارسال..." : "دریافت کد یک‌بارمصرف"}
          </button>
        </form>
      ) : (
        <form onSubmit={verifyCode} className="grid gap-5">
          <div className="flex justify-center gap-2" dir="ltr">
            {otp.map((digit, index) => (
              <input
                key={`otp-${index}`}
                ref={(element) => {
                  otpRefs.current[index] = element;
                }}
                value={digit}
                onChange={(event) => updateOtp(index, event.target.value)}
                onKeyDown={(event) => handleOtpKeyDown(index, event.key)}
                inputMode="numeric"
                maxLength={1}
                aria-label={`رقم ${index + 1} کد تأیید`}
                className="size-11 rounded-xl border border-[#E5E7EB] bg-[#F5F7FA] text-center text-lg font-extrabold text-[#111827] outline-none transition focus:border-[#2563EB] focus:bg-white focus:ring-4 focus:ring-[#2563EB]/10 sm:size-12"
              />
            ))}
          </div>
          <button type="submit" disabled={loading} className="h-12 rounded-xl bg-[#2563EB] text-sm font-bold text-white transition hover:bg-[#7C3AED] disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2563EB]/20">
            {loading ? "در حال بررسی..." : "تأیید و ورود"}
          </button>
          <div className="flex items-center justify-between text-xs">
            <button type="button" onClick={() => { setStep("phone"); setError(""); }} className="font-semibold text-[#2563EB] hover:text-[#7C3AED]">ویرایش شماره</button>
            <button type="button" onClick={resendCode} disabled={secondsLeft > 0} className="font-semibold text-[#6B7280] disabled:cursor-not-allowed disabled:text-[#9CA3AF]">
              {secondsLeft > 0 ? `ارسال مجدد تا ${secondsLeft} ثانیه` : "ارسال مجدد کد"}
            </button>
          </div>
        </form>
      )}

      {error ? <p role="alert" className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-center text-xs text-red-700">{error}</p> : null}

      <div className="mt-8 flex items-start gap-3 border-t border-[#E5E7EB] pt-5 text-xs leading-6 text-[#6B7280]">
        <ShieldCheck aria-hidden="true" size={17} className="mt-0.5 shrink-0 text-[#2563EB]" />
        ورود با رمز یک‌بارمصرف امن است و اطلاعات شما نزد فروشگاه محفوظ می‌ماند.
      </div>
    </>
  );
}
