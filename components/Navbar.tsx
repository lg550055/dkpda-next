"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { getAuthToken, clearAuthToken } from "@/lib/auth";
import { useEffect, useRef, useState } from "react";

type User = { email: string; is_admin: boolean };
type Theme = "light" | "dark";

const CATEGORIES = [
  { label: "All", href: "/" },
  { label: "Crony", href: "/articles?category=crony" },
  { label: "Nonsense", href: "/articles?category=nonsense" },
  { label: "AI", href: "/articles?category=ai" },
  { label: "Grift", href: "/articles?category=grift" },
  { label: "Graft", href: "/articles?category=graft" },
];

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<Theme>("light");
  const [today, setToday] = useState("");
  const headerRef = useRef<HTMLElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setToday(
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );
  }, []);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) { setUser(null); return; }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser({ email: payload.sub, is_admin: !!payload.is_admin });
    } catch {
      clearAuthToken();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const stored = window.localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial: Theme =
      stored === "light" || stored === "dark" ? stored : prefersDark ? "dark" : "light";
    setTheme(initial);
    document.documentElement.dataset.theme = initial;
  }, []);

  // Keep --masthead-height in sync so sidebar sticky top is correct
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const update = () =>
      document.documentElement.style.setProperty(
        "--masthead-height",
        el.offsetHeight + "px"
      );
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      window.localStorage.setItem("theme", next);
      return next;
    });
  };

  const logout = () => {
    clearAuthToken();
    setUser(null);
    router.push("/login");
  };

  return (
    <header className="masthead" ref={headerRef}>
      {/* Top utility bar */}
      <div className="masthead-top">
        <div className="mast-inner">
          <div className="mast-date-meta">
            <span>{today}</span>
            <span className="mast-meta-sep">·</span>
            <span>Est. 2025</span>
            <span className="mast-meta-sep">·</span>
            <span>100% Satirical</span>
          </div>
          <div className="mast-auth">
            <Link href="/articles">Articles</Link>
            {user ? (
              <>
                {user.is_admin && <Link href="/admin">Admin</Link>}
                <button className="btn-text" onClick={logout}>Logout</button>
              </>
            ) : (
              <Link href="/login">Login</Link>
            )}
          </div>
        </div>
      </div>

      {/* Logo */}
      <div className="mast-brand">
        <Link href="/" className="mast-logo">Dikipedia</Link>
        <p className="mast-tagline">Your Daily Dose of Satire</p>
      </div>

      <div className="mast-rule" />

      {/* Category nav */}
      <div className="mast-nav-row">
        <div className="mast-inner">
          <nav className="mast-nav">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className={`nav-link${pathname === cat.href ? " active" : ""}`}
              >
                {cat.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "☀" : "⏾"}
          </button>
        </div>
      </div>
    </header>
  );
}
