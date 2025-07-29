import React, { useState } from "react";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice";

export default function Login({ onSuccess }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const { user, isError, message } = useSelector((state) => state.auth);

  // Log user ID after successful login
  React.useEffect(() => {
    if (user && user._id) {
      console.log("Logged in user ID:", user._id);
    }
  }, [user]);

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await dispatch(login({ email, password })).unwrap();
      if (result) {
        toast.success("Login successful!");
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      toast.error(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 350,
        margin: "60px auto",
        padding: 24,
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 8px #eee",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Login</h2>
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: 16 }}>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            placeholder="Email"
            required
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            placeholder="Password"
            required
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: "100%",
            padding: 10,
            background: "#4f46e5",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            fontWeight: 600,
          }}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
