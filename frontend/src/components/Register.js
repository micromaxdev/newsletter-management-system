import React, { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../features/auth/authSlice";

export default function Register({ onSuccess }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    password2: "",
    type: "pending",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { firstName, lastName, email, password, password2, type } = formData;

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      toast.error("Passwords do not match");
      return;
    }
    setIsLoading(true);
    try {
      const name = `${firstName} ${lastName}`.trim();
      const result = await dispatch(
        register({ name, email, password, type })
      ).unwrap();
      if (result) {
        toast.success("Registration successful! Please login.");
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "60px auto",
        padding: 24,
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 8px #eee",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Register</h2>
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: 12 }}>
          <input
            type="text"
            name="firstName"
            value={firstName}
            onChange={onChange}
            placeholder="First Name"
            required
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <input
            type="text"
            name="lastName"
            value={lastName}
            onChange={onChange}
            placeholder="Last Name"
            required
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
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
        <div style={{ marginBottom: 12 }}>
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
        <div style={{ marginBottom: 16 }}>
          <input
            type="password"
            name="password2"
            value={password2}
            onChange={onChange}
            placeholder="Confirm Password"
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
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
