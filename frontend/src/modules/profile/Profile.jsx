/**
 * Profile Component
 * Admin profile management with profile info and password change tabs
 */

import { useState, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchProfile,
  updateProfile,
  changePassword,
  uploadProfileImage,
} from "./profile.api";
import {
  updateProfileSchema,
  changePasswordSchema,
} from "./profile.validation";
import { toastSuccess, toastError } from "../../utils/toast";
import Button from "../../components/Button";
import Spinner from "../../components/Spinner";
import { FormField, PasswordField } from "../../components/FormField";
import EyeOpen from "../../assets/svg/EyeOpen";
import EyeClosed from "../../assets/svg/EyeClosed";
import UserIcon from "../../assets/svg/UserIcon";
import styles from "./Profile.module.css";
import headerStyles from "../../styles/PageHeader.module.css";

const toAbsoluteImageUrl = (image) => {
  if (!image) return null;
  if (
    image.startsWith("http") ||
    image.startsWith("blob:") ||
    image.startsWith("data:")
  ) {
    return image;
  }

  return `${import.meta.env.VITE_API_BASE_URL?.replace("/api", "")}${image}`;
};

export default function Profile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

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

  const {
    setValue: setProfileValue,
    getValues: getProfileValues,
    formState: { errors: profileErrors },
  } = profileForm;

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

  const handleImageChange = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const previousImage =
        getProfileValues("profileImage") || profile?.profileImage || null;
      const localPreview = URL.createObjectURL(file);
      setImagePreview(localPreview);
      setIsUploadingImage(true);

      try {
        const uploadRes = await uploadProfileImage({ file, type: "local" });
        const imagePath =
          uploadRes.filepath || uploadRes.path || uploadRes.url || "";

        if (!imagePath) {
          throw new Error("Image upload response did not include a URL");
        }

        setProfileValue("profileImage", imagePath, {
          shouldDirty: true,
          shouldValidate: true,
        });
        setImagePreview(toAbsoluteImageUrl(imagePath));
        toastSuccess("Profile image uploaded");
      } catch (error) {
        setImagePreview(toAbsoluteImageUrl(previousImage));
        toastError(error.response?.data?.message || "Failed to upload image");
      } finally {
        URL.revokeObjectURL(localPreview);
        setIsUploadingImage(false);
      }
    },
    [getProfileValues, profile?.profileImage, setProfileValue],
  );

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
        className={`d-flex justify-content-center align-items-center ${styles.loadingContainer}`}
      >
        <Spinner />
      </div>
    );
  }

  return (
    <div className={`container-fluid px-4 py-4 ${styles.container}`}>
      {/* Header */}
      <div className={`animate-fade-in ${headerStyles.pageHeader}`}>
        <h2
          className={`fw-bold mb-2 ${headerStyles.pageTitle} ${headerStyles.titleWithIcon}`}
        >
          <UserIcon size={32} color="white" /> My Profile
        </h2>
        <p className={headerStyles.pageSubtitle}>
          Manage your account settings and preferences
        </p>
      </div>

      {/* Tabs */}
      <div className={`glass-card mb-4 p-2 ${styles.tabsContainer}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tabButton} ${activeTab === tab.id ? styles.tabButtonActive : styles.tabButtonInactive}`}
            onClick={() => handleTabChange(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Information Tab */}
      {activeTab === "profile" && (
        <div className={`glass-card animate-slide-in ${styles.profileCard}`}>
          <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)}>
            <div className="row">
              {/* Profile Image */}
              <div className="col-md-4 mb-4 text-center">
                <div className="mb-3">
                  <div
                    className={`rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center ${styles.profileImageCircle}`}
                  >
                    {imagePreview || profile?.profileImage ? (
                      <img
                        src={toAbsoluteImageUrl(
                          imagePreview || profile?.profileImage,
                        )}
                        alt="Profile"
                        className={styles.profileImage}
                      />
                    ) : (
                      <i
                        className={`bi bi-person ${styles.profilePlaceholderIcon}`}
                      ></i>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="d-none"
                    id="profileImageInput"
                    disabled={isUploadingImage}
                  />
                  <label
                    htmlFor="profileImageInput"
                    className={`${styles.changePhotoButton} ${isUploadingImage ? styles.changePhotoButtonDisabled : ""}`}
                  >
                    {isUploadingImage ? "Uploading..." : "Change Photo"}
                  </label>
                  {profileErrors.profileImage && (
                    <div className={styles.imageError}>
                      {profileErrors.profileImage.message}
                    </div>
                  )}
                </div>
              </div>

              {/* Form Fields */}
              <div className="col-md-8">
                <div className="row">
                  {/* Name */}
                  <div className="col-md-12">
                    <FormField
                      label="Full Name"
                      name="name"
                      control={profileForm.control}
                      errors={profileForm.formState.errors}
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Email */}
                  <div className="col-md-12">
                    <FormField
                      label="Email Address"
                      name="email"
                      control={profileForm.control}
                      errors={profileForm.formState.errors}
                      type="email"
                      placeholder="Enter your email"
                    />
                  </div>

                  {/* Phone */}
                  <div className="col-md-12">
                    <FormField
                      label="Phone Number"
                      name="phone"
                      control={profileForm.control}
                      errors={profileForm.formState.errors}
                      type="tel"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  {/* Role (Read-only) */}
                  {/* <div className="col-md-12 mb-3">
                    <Input
                      label="Role"
                      type="text"
                      value={profile?.role?.toUpperCase() || ""}
                      disabled
                      className={styles.roleInput}
                    />
                  </div> */}

                  {/* Submit Button */}
                  <div className="col-md-12">
                    <Button
                      type="submit"
                      variant="primary"
                      loading={
                        updateProfileMutation.isPending || isUploadingImage
                      }
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
        <div className={`glass-card animate-slide-in ${styles.profileCard}`}>
          <div className="row justify-content-center">
            <div className="col-md-7">
              <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}>
                {/* Current Password */}
                <PasswordField
                  label="Current Password"
                  name="currentPassword"
                  control={passwordForm.control}
                  errors={passwordForm.formState.errors}
                  placeholder="Enter your current password"
                  showPassword={showCurrentPassword}
                  onTogglePassword={() =>
                    setShowCurrentPassword(!showCurrentPassword)
                  }
                  PasswordIcon={
                    showCurrentPassword ? <EyeOpen /> : <EyeClosed />
                  }
                  required
                />

                {/* New Password */}
                <PasswordField
                  label="New Password"
                  name="newPassword"
                  control={passwordForm.control}
                  errors={passwordForm.formState.errors}
                  placeholder="Enter your new password"
                  showPassword={showNewPassword}
                  onTogglePassword={() => setShowNewPassword(!showNewPassword)}
                  PasswordIcon={showNewPassword ? <EyeOpen /> : <EyeClosed />}
                  required
                />

                {/* Confirm Password */}
                <PasswordField
                  label="Confirm New Password"
                  name="confirmPassword"
                  control={passwordForm.control}
                  errors={passwordForm.formState.errors}
                  placeholder="Confirm your new password"
                  showPassword={showConfirmPassword}
                  onTogglePassword={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  PasswordIcon={
                    showConfirmPassword ? <EyeOpen /> : <EyeClosed />
                  }
                  required
                />

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
