"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/api";
import { setAuthToken } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await api.post(
        "/token",
        new URLSearchParams({ username: data.email, password: data.password }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
      setAuthToken(res.data.access_token);
      router.push("/");
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { detail?: string } } }).response?.data?.detail
          : undefined;
      alert(msg || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              {...register("email")}
              className="form-input"
              type="email"
              id="email"
              placeholder="you@example.com"
            />
            {errors.email && <p className="form-error">{errors.email.message}</p>}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              {...register("password")}
              className="form-input"
              type="password"
              id="password"
              placeholder="••••••••"
            />
            {errors.password && <p className="form-error">{errors.password.message}</p>}
          </div>
          <button type="submit" disabled={isSubmitting} style={{ width: "100%", marginTop: "0.5rem" }}>
            {isSubmitting ? "Logging in…" : "Login"}
          </button>
        </form>
        <p className="form-footer">
          No account? <Link href="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
