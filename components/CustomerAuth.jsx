"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import { publicApi, hrefWith } from "../lib/publicApi";
import { customerApi, nextPath, setSession } from "./customerSession";

const password = ["password", "Password", "password", 72];
const confirm = ["confirmPassword", "Confirm password", "password", 72];
const email = ["email", "Email address", "email", 254];
const phone = ["phone", "Mobile number", "tel", 10];
const forms = {
  login: ["Log in", [["login", "Email, username or mobile", "text", 254], password]],
  signup: ["Create your account", [["name","Full name","text",50],["username","Username","text",30],email,phone,password,confirm]],
  "verify-phone": ["Verify your mobile number", [phone, ["otp","Verification code","text",6]]],
  "verify-email": ["Verify your email", []],
  "resend-email": ["Resend verification email", [email]],
  "forgot-password": ["Reset your password", [email]],
  "reset-password": ["Choose a new password", [password, confirm]],
  "change-password": ["Change your password", [["currentPassword","Current password","password",72],["newPassword","New password","password",72],confirm]],
};

export default function CustomerAuth({ mode, query }) {
  const [title, fields] = forms[mode];
  const [visible, setVisible] = useState({});
  const [status, setStatus] = useState({});
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const next = nextPath(query.next);
  const login = hrefWith("/login", { next });
  const otpPage = hrefWith("/verify-phone", { next });
  const [phoneValue, setPhone] = useState("");
  useEffect(() => { if (mode === "verify-phone") setPhone(sessionStorage.getItem("venuefy:pending-phone") || ""); }, [mode]);

  async function run(action) {
    if (busy) return;
    setBusy(true);
    setStatus({});
    try {
      const result = await action();
      if (result) setStatus({ message: result.message || "Done." });
    } catch (error) { setStatus({ error: error.message, fields: error.fields }); }
    finally { setBusy(false); }
  }

  function submit(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    run(async () => {
      if (values.confirmPassword !== undefined && values.confirmPassword !== (values.newPassword || values.password)) {
        throw Object.assign(new Error("Please check your password."), { fields: { confirmPassword: "Passwords must match." } });
      }
      if (mode === "verify-email") return publicApi(hrefWith("/auth/verify-email", { token: query.token }));
      if (mode === "signup") values.role = "customer";
      if (mode === "reset-password") values.token = query.token;
      const request = mode === "change-password" ? customerApi : publicApi;
      const data = await request(`/auth/${mode}`, { body: values });
      if (mode === "login") {
        if (data.user?.role !== "customer") {
          await publicApi("/auth/logout", { body: { refreshToken: data.refreshToken } }).catch(() => {});
          throw new Error("Use the partner portal to sign in with a staff or vendor account.");
        }
        setSession(data);
        router.replace(next);
        return;
      }
      if (mode === "signup") {
        sessionStorage.setItem("venuefy:pending-phone", data.phone || values.phone);
        router.replace(otpPage);
        return;
      }
      if (mode === "verify-phone") {
        sessionStorage.removeItem("venuefy:pending-phone");
        return { message: "Mobile verified. Verify your email from your inbox, then log in." };
      }
      if (mode === "change-password") {
        setSession(null);
        router.replace(login);
        return;
      }
      return data;
    });
  }

  return <><Header /><main className="container account-shell"><section className="account-visual"><span className="vf-kicker">Your Venuefy account</span><h2>From venue discovery to your big day</h2><p>Keep your enquiries, bookings and updates together.</p></section>
    <section className="account-form"><h1>{title}</h1>
      {mode === "verify-phone" && <p>Enter the code sent to your registered email. Open the verification link in that email as well.</p>}
      {mode === "verify-email" && <p>Confirm this address to activate your Venuefy account.</p>}
      <form className="vf-form" onSubmit={submit}>
        {fields.map(([key, label, type, maxLength]) => <div key={key}><label htmlFor={`auth-${key}`}>{label} <span aria-hidden="true">*</span></label>
          <div className={type === "password" ? "auth-password" : undefined}>
          <input
            id={`auth-${key}`} name={key} type={type === "password" && visible[key] ? "text" : type} maxLength={maxLength} required
            autoComplete={type === "password" ? (["login","currentPassword"].includes(mode === "login" ? mode : key) ? "current-password" : "new-password") : key === "otp" ? "one-time-code" : undefined}
            pattern={key === "phone" ? "[6-9][0-9]{9}" : key === "otp" ? "[0-9]{6}" : key === "username" ? "[A-Za-z0-9_]{4,30}" : undefined}
            minLength={key === "name" ? 3 : key === "password" && mode !== "login" ? 8 : undefined}
            aria-invalid={Boolean(status.fields?.[key])}
            {...(key === "phone" && mode === "verify-phone" ? { value: phoneValue, onChange: (e) => setPhone(e.target.value) } : {})}
          />
            {type === "password" && <button type="button" aria-label={`${visible[key] ? "Hide" : "Show"} ${label.toLowerCase()}`} aria-controls={`auth-${key}`} onClick={() => setVisible((previous) => ({ ...previous, [key]: !previous[key] }))}><i className={visible[key] ? "bi bi-eye-slash" : "bi bi-eye"} aria-hidden="true" /></button>}
          </div>
          {status.fields?.[key] && <small role="alert" className="vf-error">{status.fields[key]}</small>}
        </div>)}
        {status.error && <p role="alert" className="vf-error">{status.error}</p>}
        {status.message && <p role="status" className="vf-success">{status.message}</p>}
        <button className="vf-button" disabled={busy || (["verify-email", "reset-password"].includes(mode) && !query.token)}>{busy ? "Please wait…" : title}</button>
        {mode === "verify-phone" && <button type="button" className="vf-text-button" disabled={busy || !/^[6-9]\d{9}$/.test(phoneValue)} onClick={() => run(() => publicApi("/auth/resend-otp", { body: { phone: phoneValue } }))}>Resend code</button>}
      </form>
      <div className="account-links">
        {mode === "login" ? <><Link href={hrefWith("/signup", { next })}>Create account</Link><Link href="/forgot-password">Forgot password?</Link><Link href={otpPage}>Verify mobile</Link><Link href="/resend-email">Resend verification email</Link></> : <Link href={login}>Back to login</Link>}
      </div>
    </section></main><Footer /></>;
}
