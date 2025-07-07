import { useState } from "react";
import { useUserStore } from "../store/useUserStore";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const navigate = useNavigate();

  const setUser = useUserStore((state) => state.setUser);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    setLoginLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Invalid credentials");

      const { user, access, refresh } = await res.json();

      setUser(user, access, refresh);

      navigate("/", refresh); // or wherever you want to redirect
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-600">USER LOGIN</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-600 text-sm">{error}</p>}

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full px-4 py-2 border rounded-full"
          required
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full px-4 py-2 border rounded-full"
          required
        />
        <div className="text-right">
          <Link to="/forgot-password" className="text-blue-600 text-sm">
            Forgot password?
          </Link>
        </div>
        <button
          type="submit"
          disabled={loginLoading}
          className="w-full bg-teal-400 font-bold text-white py-2 rounded-full hover:bg-teal-500 cursor-pointer"
        >
          {loginLoading ? "Loading..." : "LOG ME IN"}
        </button>
      </form>
      <p className="text-sm text-center mt-4">
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-600">
          Register
        </Link>
      </p>
    </div>
  );
};

export default Login;
