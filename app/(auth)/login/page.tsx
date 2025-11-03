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
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await api.post(
        "/login",
        new URLSearchParams({
          username: data.email,  // FastAPI expects "username" field
          password: data.password,
        }),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      setAuthToken(res.data.access_token);
      router.push("/");
    } catch (err: any) {
      alert(err.response?.data?.detail || "Login failed");
    }
  };

  return (
  <div>
  <div>
  <h1>Login</h1>

  <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="email">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              id="email"
              placeholder="you@example.com"
              
            />
            {errors.email && (
              <p>{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password">
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              id="password"
              placeholder="••••••••"
              
            />
            {errors.password && (
              <p>{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

  <p>
          No account?{" "}
          <Link href="/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}