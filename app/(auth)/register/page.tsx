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
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await api.post(
        "/register",
        {
          email: data.email,
          password: data.password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      alert("Registration successful! Please log in.");
      router.push("/login");
    } catch (err: any) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.[0]?.msg ||
        "Registration failed. Try again.";
      alert(message);
    }
  };

  return (
  <div>
  <div>
  <h1>Create Account</h1>

  <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
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

          {/* Password */}
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

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              {...register("confirmPassword")}
              type="password"
              id="confirmPassword"
              placeholder="••••••••"
              
            />
            {errors.confirmPassword && (
              <p>{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            
          >
            {isSubmitting ? "Creating Account..." : "Register"}
          </button>
        </form>

  <p>
          Already have an account?{" "}
          <Link href="/login">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}