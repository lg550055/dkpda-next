"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/api";

const registerSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await api.post(
        "/register",
        { email: data.email, password: data.password },
        { headers: { "Content-Type": "application/json" } }
      );
      alert("Registration successful! Please log in.");
      router.push("/login");
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string; 0?: { msg?: string } } } };
      const message =
        e.response?.data?.detail ||
        e.response?.data?.[0]?.msg ||
        "Registration failed. Try again.";
      alert(message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create Account</h2>
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
          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
            <input
              {...register("confirmPassword")}
              className="form-input"
              type="password"
              id="confirmPassword"
              placeholder="••••••••"
            />
            {errors.confirmPassword && <p className="form-error">{errors.confirmPassword.message}</p>}
          </div>
          <button type="submit" disabled={isSubmitting} style={{ width: "100%", marginTop: "0.5rem" }}>
            {isSubmitting ? "Creating Account…" : "Register"}
          </button>
        </form>
        <p className="form-footer">
          Already have an account? <Link href="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
