/**
 * Profile Component
 * Admin profile management with profile info and password change tabs
 */

import { useState, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProfile, updateProfile, changePassword } from "./profile.api";
import {
  updateProfileSchema,
  changePasswordSchema,
} from "./profile.validation";
import { toastSuccess, toastError } from "../../utils/toast";
import Button from "../../components/Button";
import Spinner from "../../components/Spinner";
import EyeOpen from "../../assets/svg/EyeOpen";
import EyeClosed from "../../assets/svg/EyeClosed";
import UserIcon from "../../assets/svg/UserIcon";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const queryClient = useQueryClient();

  // Fetch profile data
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Profile form
  const profileForm = useForm({
    resolver: yupResolver(updateProfileSchema),
    values: profile
      ? {
          name: profile.name || "",
          email: profile.email || "",
          phone: profile.phone || "",
          profileImage: profile.profileImage || null,
        }
      : {},
  });

  // Password form
  const passwordForm = useForm({
    resolver: yupResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(["profile"], data);
      toastSuccess("Profile updated successfully!");
    },
    onError: (error) => {
      toastError(error.response?.data?.message || "Failed to update profile");
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toastSuccess("Password changed successfully!");
      passwordForm.reset();
    },
    onError: (error) => {
      toastError(error.response?.data?.message || "Failed to change password");
    },
  });

  const handleProfileSubmit = useCallback(
    (data) => {
      updateProfileMutation.mutate(data);
    },
    [updateProfileMutation],
  );

  const handlePasswordSubmit = useCallback(
    (data) => {
      changePasswordMutation.mutate(data);
    },
    [changePasswordMutation],
  );

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const tabs = useMemo(
    () => [
      { id: "profile", label: "Profile Information" },
      { id: "password", label: "Change Password" },
    ],
    [],
  );

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "400px" }}
      >
        <Spinner />
      </div>
    );
  }

  return (
    <div
      className="container-fluid px-4 py-4"
      style={{ paddingTop: "30px !important" }}
    >
      {/* Header */}
      <div
        className="animate-fade-in"
        style={{
          padding: "35px 40px",
          borderRadius: "24px",
          marginBottom: "30px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          boxShadow: "0 10px 40px rgba(102, 126, 234, 0.25)",
        }}
      >
        <h2
          className="fw-bold mb-2"
          style={{
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <UserIcon size={32} color="white" /> My Profile
        </h2>
        <p
          className="mb-0"
          style={{ color: "rgba(255, 255, 255, 0.85)", fontSize: "0.95rem" }}
        >
          Manage your account settings and preferences
        </p>
      </div>

      {/* Tabs */}
      <div
        className="glass-card mb-4 p-2"
        style={{ borderRadius: "16px", display: "inline-flex", gap: "8px" }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`btn ${activeTab === tab.id ? "" : "btn-link"}`}
            onClick={() => handleTabChange(tab.id)}
            type="button"
            style={{
              padding: "12px 24px",
              borderRadius: "12px",
              fontWeight: 500,
              border: "none",
              background:
                activeTab === tab.id
                  ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  : "transparent",
              color: activeTab === tab.id ? "white" : "#64748b",
              transition: "all 0.3s ease",
              textDecoration: "none",
              boxShadow:
                activeTab === tab.id
                  ? "0 4px 12px rgba(102, 126, 234, 0.3)"
                  : "none",
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.background = "rgba(99, 102, 241, 0.05)";
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.background = "transparent";
              }
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Information Tab */}
      {activeTab === "profile" && (
        <div
          className="glass-card animate-slide-in"
          style={{
            padding: "40px",
            borderRadius: "24px",
          }}
        >
          <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)}>
            <div className="row">
              {/* Profile Image */}
              <div className="col-md-4 mb-4 text-center">
                <div className="mb-3">
                  <div
                    className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: "150px",
                      height: "150px",
                      backgroundColor: "#e9ecef",
                      overflow: "hidden",
                    }}
                  >
                    {imagePreview || profile?.profileImage ? (
                      <img
                        src={imagePreview || profile?.profileImage}
                        alt="Profile"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <i
                        className="bi bi-person"
                        style={{ fontSize: "4rem", color: "#6c757d" }}
                      ></i>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="d-none"
                    id="profileImageInput"
                  />
                  <label
                    htmlFor="profileImageInput"
                    className="btn btn-sm btn-outline-primary"
                  >
                    Change Photo
                  </label>
                </div>
              </div>

              {/* Form Fields */}
              <div className="col-md-8">
                <div className="row">
                  {/* Name */}
                  <div className="col-md-12 mb-3">
                    <label className="form-label fw-semibold">Full Name</label>
                    <input
                      type="text"
                      className={`form-control ${profileForm.formState.errors.name ? "is-invalid" : ""}`}
                      {...profileForm.register("name")}
                    />
                    <div className="invalid-feedback">
                      {profileForm.formState.errors.name?.message}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="col-md-12 mb-3">
                    <label className="form-label fw-semibold">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className={`form-control ${profileForm.formState.errors.email ? "is-invalid" : ""}`}
                      {...profileForm.register("email")}
                    />
                    <div className="invalid-feedback">
                      {profileForm.formState.errors.email?.message}
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="col-md-12 mb-3">
                    <label className="form-label fw-semibold">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      className={`form-control ${profileForm.formState.errors.phone ? "is-invalid" : ""}`}
                      {...profileForm.register("phone")}
                    />
                    <div className="invalid-feedback">
                      {profileForm.formState.errors.phone?.message}
                    </div>
                  </div>

                  {/* Role (Read-only) */}
                  <div className="col-md-12 mb-3">
                    <label className="form-label fw-semibold">Role</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profile?.role?.toUpperCase() || ""}
                      disabled
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="col-md-12">
                    <Button
                      type="submit"
                      variant="primary"
                      loading={updateProfileMutation.isPending}
                    >
                      Update Profile
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Change Password Tab */}
      {activeTab === "password" && (
        <div
          className="glass-card animate-slide-in"
          style={{
            padding: "40px",
            borderRadius: "24px",
          }}
        >
          <div className="row justify-content-center">
            <div className="col-md-7">
              <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}>
                {/* Current Password */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Current Password
                  </label>
                  <div className="position-relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      className={`form-control ${passwordForm.formState.errors.currentPassword ? "is-invalid" : ""}`}
                      {...passwordForm.register("currentPassword")}
                    />
                    <button
                      type="button"
                      className="btn btn-link position-absolute end-0 top-50 translate-middle-y"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      style={{ zIndex: 10 }}
                    >
                      {showCurrentPassword ? <EyeOpen /> : <EyeClosed />}
                    </button>
                    <div className="invalid-feedback">
                      {passwordForm.formState.errors.currentPassword?.message}
                    </div>
                  </div>
                </div>

                {/* New Password */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">New Password</label>
                  <div className="position-relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      className={`form-control ${passwordForm.formState.errors.newPassword ? "is-invalid" : ""}`}
                      {...passwordForm.register("newPassword")}
                    />
                    <button
                      type="button"
                      className="btn btn-link position-absolute end-0 top-50 translate-middle-y"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      style={{ zIndex: 10 }}
                    >
                      {showNewPassword ? <EyeOpen /> : <EyeClosed />}
                    </button>
                    <div className="invalid-feedback">
                      {passwordForm.formState.errors.newPassword?.message}
                    </div>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Confirm New Password
                  </label>
                  <div className="position-relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className={`form-control ${passwordForm.formState.errors.confirmPassword ? "is-invalid" : ""}`}
                      {...passwordForm.register("confirmPassword")}
                    />
                    <button
                      type="button"
                      className="btn btn-link position-absolute end-0 top-50 translate-middle-y"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      style={{ zIndex: 10 }}
                    >
                      {showConfirmPassword ? <EyeOpen /> : <EyeClosed />}
                    </button>
                    <div className="invalid-feedback">
                      {passwordForm.formState.errors.confirmPassword?.message}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  loading={changePasswordMutation.isPending}
                >
                  Change Password
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
