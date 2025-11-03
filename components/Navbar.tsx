"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAuthToken, clearAuthToken } from "@/lib/auth";
import { useEffect, useState } from "react";

type User = {
  email: string;
  is_admin: boolean;
};

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

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

  const logout = () => {
    clearAuthToken();
    setUser(null);
    router.push("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-inner">
        {/* Logo */}
        <Link href="/" className="nav-logo">
          Satire
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
        </div>
      </div>
    </nav>
  );
}