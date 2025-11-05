"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAuthToken, clearAuthToken } from "@/lib/auth";
import { useEffect, useState } from "react";

type User = {
  email: string;
  is_admin: boolean;
};

type Theme = "light" | "dark";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<Theme>("light");
  const router = useRouter();

  const applyTheme = (nextTheme: Theme) => {
    if (typeof document === "undefined") {
      return;
    }
    document.documentElement.dataset.theme = nextTheme;
  };

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setUser(null);
      return;
    }

    try {
      // Decode JWT payload (sub = email, is_admin)
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser({
        email: payload.sub,
        is_admin: !!payload.is_admin,
      });
    } catch (err) {
      console.error("Invalid token:", err);
      clearAuthToken();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("theme");
    if (storedTheme === "light" || storedTheme === "dark") {
      setTheme(storedTheme);
      applyTheme(storedTheme);
      return;
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme: Theme = prefersDark ? "dark" : "light";
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const nextTheme: Theme = prevTheme === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
      window.localStorage.setItem("theme", nextTheme);
      return nextTheme;
    });
  };

  const logout = () => {
    clearAuthToken();
    setUser(null);
    router.push("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-inner">
        {/* Logo */}
        <Link href="/" className="nav-logo" aria-label="home">
          KP
        </Link>

        {/* Right-side menu */}
        <div className="nav-right">
          <Link href="/articles">
            Articles
          </Link>

          {user ? (
            <>
              {/* Admin Link */}
              {user.is_admin && (
                <Link href="/admin">
                  Admin
                </Link>
              )}

              {/* User Email */}
              <span>{user.email}</span>

              {/* Logout */}
              <button onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <Link href="/login">
              <button type="button" className="btn-primary">
                Login
              </button>
            </Link>
          )}

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
    </nav>
  );
}