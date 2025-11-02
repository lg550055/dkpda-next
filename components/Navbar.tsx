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
    <nav className="bg-gray-900 text-white p-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-wide">
          Satire
        </Link>

        {/* Right-side menu */}
        <div className="flex items-center gap-6 text-sm">
          <Link href="/articles" className="hover:text-gray-300 transition">
            Articles
          </Link>

          {user ? (
            <>
              {/* Admin Link */}
              {user.is_admin && (
                <Link href="/admin" className="hover:text-gray-300 transition">
                  Admin
                </Link>
              )}

              {/* User Email */}
              <span className="text-gray-300">{user.email}</span>

              {/* Logout */}
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}