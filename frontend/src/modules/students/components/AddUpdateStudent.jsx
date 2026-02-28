import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import Select from "react-select";
import { createStudentSchema } from "../students.validation";
import {
  addStudent,
  updateStudent,
  uploadImage,
  fetchClasses,
  fetchCourses,
  enrollStudentInClass,
  enrollStudentInCourse,
} from "../students.api";
import toast from "react-hot-toast";
import Button from "../../../components/Button";
import { FormField, PasswordField } from "../../../components/FormField";
import styles from "./AddUpdateStudent.module.css";
import modalStyles from "../../../components/Modal.module.css";
import EyeOpen from "../../../assets/svg/EyeOpen";
import EyeClosed from "../../../assets/svg/EyeClosed";

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

// Custom styles for react-select
const selectStyles = {
  control: (base, state) => ({
    ...base,
    borderRadius: "12px",
    border: state.isFocused ? "2px solid #667eea" : "1px solid #dee2e6",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(102, 126, 234, 0.1)" : "none",
    padding: "6px 8px",
    background: "white",
    transition: "all 0.2s ease",
    "&:hover": {
      borderColor: "#667eea",
    },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#667eea"
      : state.isFocused
        ? "#f0f2ff"
        : "white",
    color: state.isSelected ? "white" : "#333",
    padding: "12px 16px",
    cursor: "pointer",
    "&:active": {
      backgroundColor: "#667eea",
    },
  }),
  menu: (base) => ({
    ...base,
    borderRadius: "12px",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
    overflow: "hidden",
    marginTop: "8px",
  }),
  menuList: (base) => ({
    ...base,
    padding: 0,
  }),
  placeholder: (base) => ({
    ...base,
    color: "#6c757d",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#333",
  }),
};

export default function AddUpdateStudent({
  onClose,
  onSuccess,
  student = null,
}) {
  const [imagePreview, setImagePreview] = useState(
    toAbsoluteImageUrl(student?.image || student?.profileImage || null),
  );
  const [showPassword, setShowPassword] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Fetch classes and courses
  const { data: classesData } = useQuery({
    queryKey: ["classes"],
    queryFn: fetchClasses,
  });

  const { data: coursesData } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  const classes = classesData?.data || [];
  const courses = coursesData?.data || [];

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(createStudentSchema),
  });

  // Populate form when editing
  useEffect(() => {
    if (student) {
      setValue("name", student.name || "");
      setValue("email", student.email || "");
      setValue("phone", student.phone || "");
      setValue("parents.father.name", student.parents?.father?.name || "");
      setValue("parents.father.phone", student.parents?.father?.phone || "");

      // Set image preview if available
      if (student.profileImage) {
        setImagePreview(toAbsoluteImageUrl(student.profileImage));
      }
    }
  }, [student, setValue]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setValue("image", file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setImagePreview(null);
    setValue("image", null);
  };

  const addMutation = useMutation({
    mutationFn: addStudent,
    onSuccess: () => {
      toast.success("Student created successfully!");
      onSuccess();
      reset();
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create student");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateStudent,
    onSuccess: () => {
      toast.success("Student updated successfully!");
      onSuccess();
      reset();
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update student");
    },
  });

  const onSubmit = async (data) => {
    try {
      let payload = { ...data };
      // Handle image upload
      if (payload.image && payload.image instanceof File) {
        const uploadRes = await uploadImage({
          file: payload.image,
          type: "local",
        });
        const uploadedPath =
          uploadRes.filepath || uploadRes.path || uploadRes.url || "";

        if (!uploadedPath) {
          throw new Error("Image upload response did not include a filepath");
        }

        payload.image = uploadedPath;
      }

      let studentId;
      if (student) {
        await updateMutation.mutateAsync({
          id: student._id,
          studentData: payload,
        });
        studentId = student._id;
      } else {
        const newStudent = await addMutation.mutateAsync(payload);
        studentId = newStudent._id;
      }

      // Enroll in class if selected
      if (selectedClass && studentId) {
        try {
          await enrollStudentInClass({
            userId: studentId,
            classId: selectedClass,
          });
        } catch (err) {
          console.error("Error enrolling in class:", err);
        }
      }

      // Enroll in course if selected
      if (selectedCourse && studentId) {
        try {
          await enrollStudentInCourse({
            userId: studentId,
            courseId: selectedCourse,
          });
        } catch (err) {
          console.error("Error enrolling in course:", err);
          toast.error(
            err.response?.data?.message || "Failed to enroll in course",
          );
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const isLoading = addMutation.isPending || updateMutation.isPending;

  return (
    <div className={`modal d-block ${modalStyles.modalOverlay}`}>
      <div className={`modal-dialog modal-lg ${modalStyles.modalDialog}`}>
        <div
          className={`modal-content glass-card animate-fade-in ${modalStyles.modalContent}`}
        >
          <div className={`modal-header border-0 ${modalStyles.modalHeader}`}>
            <h5 className={`modal-title fw-bold ${modalStyles.modalTitle}`}>
              {student ? "Update Student" : "Add New Student"}
            </h5>
            <button
              type="button"
              className={`${modalStyles.closeButton} btn-close btn-close-white`}
              onClick={onClose}
            ></button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={`modal-body ${modalStyles.modalBody}`}>
              <div className="row">
                {/* Image */}
                <div className="col-12 mb-3">
                  <label className="form-label fw-bold">
                    Image <span className="text-danger">*</span>
                  </label>
                  <div
                    className={`${styles.imageDropzone} ${errors.image ? styles.imageDropzoneError : ""}`}
                    onClick={() => window.fileInputRef?.click()}
                  >
                    {imagePreview ? (
                      <>
                        <img
                          src={imagePreview}
                          alt="Student"
                          className={styles.imagePreviewFull}
                        />
                        {/* Edit Icon */}
                        <div className={styles.editIcon}>✎</div>
                        {/* Delete Icon */}
                        <div
                          className={styles.deleteIcon}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteImage();
                          }}
                        >
                          ×
                        </div>
                      </>
                    ) : (
                      <div className={styles.imagePlaceholder}>
                        <div className={styles.imagePlaceholderPlus}>+</div>
                        <div className={styles.imagePlaceholderText}>
                          Click to add image
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Hidden File Input */}
                  <input
                    ref={(el) => {
                      if (el) window.fileInputRef = el;
                    }}
                    type="file"
                    className={styles.hiddenInput}
                    accept="image/*"
                    onChange={handleImageChange}
                  />

                  {errors.image && (
                    <div
                      className={`invalid-feedback d-block ${styles.imageError}`}
                    >
                      {errors.image.message}
                    </div>
                  )}
                </div>

                {/* Name */}
                <div className="col-md-6 mb-3">
                  <FormField
                    label="Name"
                    name="name"
                    control={control}
                    errors={errors}
                    placeholder="Enter student name"
                    required
                  />
                </div>

                {/* Email */}
                <div className="col-md-6 mb-3">
                  <FormField
                    label="Email"
                    name="email"
                    control={control}
                    errors={errors}
                    type="email"
                    placeholder="Enter email"
                    required
                  />
                </div>

                {/* Phone */}
                <div className="col-md-6 mb-3">
                  <FormField
                    label="Phone"
                    name="phone"
                    control={control}
                    errors={errors}
                    type="tel"
                    placeholder="Enter phone number"
                    required
                  />
                </div>

                {/* Password */}
                <div className="col-md-6 mb-3">
                  <PasswordField
                    label="Password"
                    name="password"
                    control={control}
                    errors={errors}
                    placeholder="Enter password"
                    showPassword={showPassword}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                    PasswordIcon={showPassword ? <EyeOpen /> : <EyeClosed />}
                    required
                  />
                </div>

                {/* Class Selection */}
                <div className="col-md-6 mb-3">
                  <label className={styles.selectLabel}>Class</label>
                  <Select
                    options={classes.map((cls) => ({
                      value: cls._id,
                      label: cls.title,
                    }))}
                    value={
                      selectedClass
                        ? {
                            value: selectedClass,
                            label:
                              classes.find((c) => c._id === selectedClass)
                                ?.title || "",
                          }
                        : null
                    }
                    onChange={(option) =>
                      setSelectedClass(option ? option.value : null)
                    }
                    isClearable
                    placeholder="Select a class"
                    styles={selectStyles}
                  />
                </div>

                {/* Course Selection */}
                <div className="col-md-6 mb-3">
                  <label className={styles.selectLabel}>Course</label>
                  <Select
                    options={courses.map((course) => ({
                      value: course._id,
                      label: `${course.title} - ${course.level}`,
                    }))}
                    value={
                      selectedCourse
                        ? {
                            value: selectedCourse,
                            label: courses.find((c) => c._id === selectedCourse)
                              ? `${courses.find((c) => c._id === selectedCourse).title} - ${courses.find((c) => c._id === selectedCourse).level}`
                              : "",
                          }
                        : null
                    }
                    onChange={(option) =>
                      setSelectedCourse(option ? option.value : null)
                    }
                    isClearable
                    placeholder="Select a course"
                    styles={selectStyles}
                  />
                  <small className={`text-muted ${styles.selectHint}`}>
                    Students can be enrolled in one active course at a time
                  </small>
                </div>

                {/* Father Details */}
                <div className="col-12 mb-3">
                  <h6 className={styles.sectionHeader}>Father Details</h6>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <FormField
                        label="Name"
                        name="parents.father.name"
                        control={control}
                        errors={errors}
                        placeholder="Enter father name"
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <FormField
                        label="Phone"
                        name="parents.father.phone"
                        control={control}
                        errors={errors}
                        type="tel"
                        placeholder="Enter father phone"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Mother Details */}
                <div className="col-12 mb-3">
                  <h6 className={styles.sectionHeader}>
                    Mother Details (Optional)
                  </h6>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <FormField
                        label="Name"
                        name="parents.mother.name"
                        control={control}
                        errors={errors}
                        placeholder="Enter mother name"
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <FormField
                        label="Phone"
                        name="parents.mother.phone"
                        control={control}
                        errors={errors}
                        type="tel"
                        placeholder="Enter mother phone"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`modal-footer border-0 ${modalStyles.modalFooter}`}>
              <Button
                variant="secondary"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    {student ? "Updating..." : "Adding..."}
                  </>
                ) : student ? (
                  "Update Student"
                ) : (
                  "Add Student"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
