import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "./login.validation";
import { useMutation } from "@tanstack/react-query";
import api from "../../app/axios";
import { useAuth } from "../../app/authContext";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner";
import { toastApiError, toastError, toastSuccess } from "../../utils/toast";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/auth/login", data);
      return res.data;
    },
    onSuccess: (data) => {
      toastSuccess("Login successfully");
      login(data.data);
      navigate("/dashboard");
    },
    onError: (error) => {
      toastApiError(error);
    },
  });

  const onSubmit = (data) => mutation.mutate(data);

  return (
    <>
      <div className="vh-100 d-flex" style={{ overflow: "hidden" }}>
        {/* Left Branding Panel */}
        <div
          className="d-none d-md-flex flex-column justify-content-center align-items-center text-white position-relative"
          style={{
            width: "50%",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            overflow: "hidden",
          }}
        >
          {/* Animated background circles */}
          <div
            style={{
              position: "absolute",
              width: "300px",
              height: "300px",
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "50%",
              top: "-100px",
              left: "-100px",
              filter: "blur(60px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: "400px",
              height: "400px",
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "50%",
              bottom: "-150px",
              right: "-150px",
              filter: "blur(80px)",
            }}
          />

          <div style={{ zIndex: 1, textAlign: "center" }}>
            <div
              style={{
                fontSize: "4rem",
                marginBottom: "20px",
                filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.2))",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <GraduationCapIcon size={80} color="white" />
            </div>
            <h1
              className="fw-bold display-4"
              style={{
                marginBottom: "20px",
                textShadow: "0 4px 12px rgba(0,0,0,0.2)",
              }}
            >
              Coaching ERP
            </h1>
            <p
              className="fs-5"
              style={{
                opacity: 0.95,
                maxWidth: "400px",
                margin: "0 auto",
              }}
            >
              Smart Learning Management System
            </p>
            <div
              style={{
                marginTop: "40px",
                display: "flex",
                gap: "30px",
                justifyContent: "center",
                flexWrap: "wrap",
                padding: "0 40px",
              }}
            >
              <div
                className="glass"
                style={{
                  padding: "20px 30px",
                  borderRadius: "16px",
                  textAlign: "center",
                  minWidth: "140px",
                }}
              >
                <div
                  style={{
                    fontSize: "2rem",
                    marginBottom: "10px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <ChartBarIcon size={32} color="white" />
                </div>
                <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>
                  Analytics
                </div>
              </div>
              <div
                className="glass"
                style={{
                  padding: "20px 30px",
                  borderRadius: "16px",
                  textAlign: "center",
                  minWidth: "140px",
                }}
              >
                <div
                  style={{
                    fontSize: "2rem",
                    marginBottom: "10px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <UsersIcon size={32} color="white" />
                </div>
                <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>
                  Collaboration
                </div>
              </div>
              <div
                className="glass"
                style={{
                  padding: "20px 30px",
                  borderRadius: "16px",
                  textAlign: "center",
                  minWidth: "140px",
                }}
              >
                <div
                  style={{
                    fontSize: "2rem",
                    marginBottom: "10px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <RocketIcon size={32} color="white" />
                </div>
                <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>
                  Performance
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Login Panel */}
        <div
          className="d-flex justify-content-center align-items-center w-100 position-relative"
          style={{
            background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
            overflow: "hidden",
          }}
        >
          {/* Background decoration */}
          <div
            style={{
              position: "absolute",
              width: "500px",
              height: "500px",
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: "50%",
              top: "-200px",
              right: "-200px",
              filter: "blur(100px)",
            }}
          />

          <div
            className="glass animate-slide-in"
            style={{
              width: "440px",
              padding: "50px 45px",
              borderRadius: "24px",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              background: "rgba(255,255,255,0.95)",
              border: "1px solid rgba(255,255,255,0.5)",
              color: "#1e293b",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
              zIndex: 1,
            }}
          >
            <div className="text-center mb-4">
              <div
                style={{
                  width: "70px",
                  height: "70px",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                  fontSize: "2rem",
                  boxShadow: "0 10px 30px rgba(102, 126, 234, 0.4)",
                }}
              >
                <BusinessPersonIcon size={36} color="white" />
              </div>
              <h3 className="fw-bold mb-2" style={{ color: "#1e293b" }}>
                Welcome Back!
              </h3>
              <p style={{ color: "#64748b", fontSize: "0.95rem" }}>
                Sign in to continue to your dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Email */}
              <div className="mb-4">
                <label
                  className="form-label fw-semibold"
                  style={{ color: "#475569", fontSize: "0.9rem" }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  {...register("email")}
                  style={{
                    padding: "14px 18px",
                    fontSize: "0.95rem",
                    border: "2px solid #e2e8f0",
                    borderRadius: "12px",
                  }}
                />
                <div className="invalid-feedback">{errors.email?.message}</div>
              </div>

              {/* Password */}
              <div className="mb-4 position-relative">
                <label
                  className="form-label fw-semibold"
                  style={{ color: "#475569", fontSize: "0.9rem" }}
                >
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className={`form-control ${
                    errors.password ? "is-invalid" : ""
                  }`}
                  {...register("password")}
                  style={{
                    padding: "14px 18px",
                    paddingRight: "50px",
                    fontSize: "0.95rem",
                    border: "2px solid #e2e8f0",
                    borderRadius: "12px",
                  }}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "18px",
                    top: "42px",
                    cursor: "pointer",
                    fontSize: "1.2rem",
                    userSelect: "none",
                  }}
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
                <div className="invalid-feedback">
                  {errors.password?.message}
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={mutation.isPending}
                className="btn w-100 fw-semibold d-flex justify-content-center align-items-center"
                style={{
                  height: "52px",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                  borderRadius: "12px",
                  color: "white",
                  fontSize: "1rem",
                  boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)",
                  transition: "all 0.3s ease",
                  transform: mutation.isPending ? "scale(0.98)" : "scale(1)",
                }}
                onMouseEnter={(e) => {
                  if (!mutation.isPending) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 12px 32px rgba(102, 126, 234, 0.5)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!mutation.isPending) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 24px rgba(102, 126, 234, 0.4)";
                  }
                }}
              >
                {mutation.isPending ? (
                  <>
                    <Spinner size="sm" variant="light" />
                    <span className="ms-2">Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <span style={{ marginLeft: "8px" }}>→</span>
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="text-center mt-4">
              <p style={{ color: "#94a3b8", fontSize: "0.85rem", margin: 0 }}>
                © 2026 Coaching ERP. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
