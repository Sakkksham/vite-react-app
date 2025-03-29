import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { loginUser } from "../assets/api/authApi";  // ✅ Ensure authApi.ts exists
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// ✅ Schema validation using Zod
const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError("");

    try {
      const response = await loginUser(data);

      if (response.token) {
        localStorage.setItem("token", response.token);  // ✅ Store token
        alert("Login successful!");
        navigate("/dashboard");  // ✅ Redirect on success
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-4 p-6 border rounded-lg shadow-lg bg-white w-96"
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <input
          {...register("email")}
          placeholder="Email"
          className="border p-2 rounded"
        />
        <p className="text-red-500">{errors.email?.message}</p>

        <input
          type="password"
          {...register("password")}
          placeholder="Password"
          className="border p-2 rounded"
        />
        <p className="text-red-500">{errors.password?.message}</p>

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
