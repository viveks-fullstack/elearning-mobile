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
import EyeOpen from "../../../assets/svg/EyeOpen";
import EyeClosed from "../../../assets/svg/EyeClosed";

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

// Modern form field wrapper styles
const formFieldStyle = {
  marginBottom: "24px",
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontWeight: "600",
  color: "#333",
  fontSize: "0.95rem",
};

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: "12px",
  border: "1px solid #dee2e6",
  fontSize: "0.95rem",
  transition: "all 0.2s ease",
  background: "white",
};

export default function AddUpdateStudent({
  onClose,
  onSuccess,
  student = null,
}) {
  const [imagePreview, setImagePreview] = useState(student?.image || null);
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
        setImagePreview(student.profileImage);
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
        payload.image = uploadRes.path || uploadRes.url || "";
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
    <div
      className="modal d-block"
      style={{
        backgroundColor: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <div className="modal-dialog modal-lg" style={{ margin: "30px auto" }}>
        <div
          className="modal-content glass-card animate-fade-in"
          style={{
            border: "none",
            borderRadius: "24px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            overflow: "hidden",
          }}
        >
          <div
            className="modal-header border-0"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              padding: "24px 32px",
              borderRadius: "24px 24px 0 0",
            }}
          >
            <h5
              className="modal-title fw-bold"
              style={{ color: "white", fontSize: "1.25rem" }}
            >
              {student ? "Update Student" : "Add New Student"}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              style={{ filter: "brightness(0) invert(1)" }}
            ></button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div
              className="modal-body"
              style={{
                padding: "32px",
                maxHeight: "calc(100vh - 250px)",
                overflowY: "auto",
              }}
            >
              <div className="row">
                {/* Image */}
                <div className="col-12 mb-3">
                  <label className="form-label fw-bold">
                    Image <span className="text-danger">*</span>
                  </label>
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "200px",
                      borderRadius: "8px",
                      overflow: "hidden",
                      backgroundColor: "#f5f5f5",
                      border: "2px dashed #dee2e6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      borderColor: errors.image ? "#dc3545" : "#dee2e6",
                    }}
                    onClick={() => window.fileInputRef?.click()}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor = "#0d6efd")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor = errors.image
                        ? "#dc3545"
                        : "#dee2e6")
                    }
                  >
                    {imagePreview ? (
                      <>
                        <img
                          src={imagePreview}
                          alt="Student"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        {/* Edit Icon */}
                        <div
                          style={{
                            position: "absolute",
                            bottom: "12px",
                            right: "12px",
                            backgroundColor: "#0d6efd",
                            color: "white",
                            borderRadius: "50%",
                            width: "44px",
                            height: "44px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "24px",
                            cursor: "pointer",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                            fontWeight: "bold",
                          }}
                        >
                          ✎
                        </div>
                        {/* Delete Icon */}
                        <div
                          style={{
                            position: "absolute",
                            top: "12px",
                            right: "12px",
                            backgroundColor: "#dc3545",
                            color: "white",
                            borderRadius: "50%",
                            width: "44px",
                            height: "44px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "28px",
                            cursor: "pointer",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                            fontWeight: "bold",
                            lineHeight: "1",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteImage();
                          }}
                        >
                          ×
                        </div>
                      </>
                    ) : (
                      <div style={{ textAlign: "center", color: "#6c757d" }}>
                        <div
                          style={{
                            fontSize: "48px",
                            marginBottom: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          +
                        </div>
                        <div style={{ fontSize: "16px", fontWeight: "500" }}>
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
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={handleImageChange}
                  />

                  {errors.image && (
                    <div
                      className="invalid-feedback d-block"
                      style={{
                        display: "block",
                        marginTop: "8px",
                        color: "#dc3545",
                      }}
                    >
                      {errors.image.message}
                    </div>
                  )}
                </div>

                {/* Name */}
                <div className="col-md-6 mb-3">
                  <label style={labelStyle}>
                    Name <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        style={{
                          ...inputStyle,
                          borderColor: errors.name ? "#dc3545" : "#dee2e6",
                        }}
                        placeholder="Enter student name"
                        onFocus={(e) =>
                          (e.target.style.borderColor = "#667eea")
                        }
                        onBlur={(e) =>
                          (e.target.style.borderColor = errors.name
                            ? "#dc3545"
                            : "#dee2e6")
                        }
                      />
                    )}
                  />
                  {errors.name && (
                    <div
                      style={{
                        color: "#dc3545",
                        fontSize: "0.875rem",
                        marginTop: "4px",
                      }}
                    >
                      {errors.name.message}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="col-md-6 mb-3">
                  <label style={labelStyle}>
                    Email <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="email"
                        style={{
                          ...inputStyle,
                          borderColor: errors.email ? "#dc3545" : "#dee2e6",
                        }}
                        placeholder="Enter email"
                        onFocus={(e) =>
                          (e.target.style.borderColor = "#667eea")
                        }
                        onBlur={(e) =>
                          (e.target.style.borderColor = errors.email
                            ? "#dc3545"
                            : "#dee2e6")
                        }
                      />
                    )}
                  />
                  {errors.email && (
                    <div
                      style={{
                        color: "#dc3545",
                        fontSize: "0.875rem",
                        marginTop: "4px",
                      }}
                    >
                      {errors.email.message}
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div className="col-md-6 mb-3">
                  <label style={labelStyle}>
                    Phone <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="tel"
                        style={{
                          ...inputStyle,
                          borderColor: errors.phone ? "#dc3545" : "#dee2e6",
                        }}
                        placeholder="Enter phone number"
                        onFocus={(e) =>
                          (e.target.style.borderColor = "#667eea")
                        }
                        onBlur={(e) =>
                          (e.target.style.borderColor = errors.phone
                            ? "#dc3545"
                            : "#dee2e6")
                        }
                      />
                    )}
                  />
                  {errors.phone && (
                    <div
                      style={{
                        color: "#dc3545",
                        fontSize: "0.875rem",
                        marginTop: "4px",
                      }}
                    >
                      {errors.phone.message}
                    </div>
                  )}
                </div>

                {/* Password */}
                <div className="col-md-6 mb-3">
                  <label style={labelStyle}>
                    Password <span className="text-danger">*</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <Controller
                      name="password"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          style={{
                            ...inputStyle,
                            paddingRight: "48px",
                            borderColor: errors.password
                              ? "#dc3545"
                              : "#dee2e6",
                          }}
                          placeholder="Enter password"
                          onFocus={(e) =>
                            (e.target.style.borderColor = "#667eea")
                          }
                          onBlur={(e) =>
                            (e.target.style.borderColor = errors.password
                              ? "#dc3545"
                              : "#dee2e6")
                          }
                        />
                      )}
                    />
                    <button
                      type="button"
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "24px",
                        height: "24px",
                      }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOpen /> : <EyeClosed />}
                    </button>
                  </div>
                  {errors.password && (
                    <div
                      style={{
                        color: "#dc3545",
                        fontSize: "0.875rem",
                        marginTop: "4px",
                      }}
                    >
                      {errors.password.message}
                    </div>
                  )}
                </div>

                {/* Class Selection */}
                <div className="col-md-6 mb-3">
                  <label style={labelStyle}>Class</label>
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
                  <label style={labelStyle}>Course</label>
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
                  <small className="text-muted" style={{ fontSize: "0.85rem" }}>
                    Students can be enrolled in one active course at a time
                  </small>
                </div>

                {/* Father Details */}
                <div className="col-12 mb-3">
                  <h6
                    style={{
                      fontWeight: "700",
                      color: "#667eea",
                      marginBottom: "16px",
                      fontSize: "1.1rem",
                    }}
                  >
                    Father Details
                  </h6>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label style={labelStyle}>
                        Name <span className="text-danger">*</span>
                      </label>
                      <Controller
                        name="parents.father.name"
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="text"
                            style={{
                              ...inputStyle,
                              borderColor: errors.parents?.father?.name
                                ? "#dc3545"
                                : "#dee2e6",
                            }}
                            placeholder="Enter father name"
                            onFocus={(e) =>
                              (e.target.style.borderColor = "#667eea")
                            }
                            onBlur={(e) =>
                              (e.target.style.borderColor = errors.parents
                                ?.father?.name
                                ? "#dc3545"
                                : "#dee2e6")
                            }
                          />
                        )}
                      />
                      {errors.parents?.father?.name && (
                        <div
                          style={{
                            color: "#dc3545",
                            fontSize: "0.875rem",
                            marginTop: "4px",
                          }}
                        >
                          {errors.parents.father.name.message}
                        </div>
                      )}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label style={labelStyle}>
                        Phone <span className="text-danger">*</span>
                      </label>
                      <Controller
                        name="parents.father.phone"
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="tel"
                            style={{
                              ...inputStyle,
                              borderColor: errors.parents?.father?.phone
                                ? "#dc3545"
                                : "#dee2e6",
                            }}
                            placeholder="Enter father phone"
                            onFocus={(e) =>
                              (e.target.style.borderColor = "#667eea")
                            }
                            onBlur={(e) =>
                              (e.target.style.borderColor = errors.parents
                                ?.father?.phone
                                ? "#dc3545"
                                : "#dee2e6")
                            }
                          />
                        )}
                      />
                      {errors.parents?.father?.phone && (
                        <div
                          style={{
                            color: "#dc3545",
                            fontSize: "0.875rem",
                            marginTop: "4px",
                          }}
                        >
                          {errors.parents.father.phone.message}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mother Details */}
                <div className="col-12 mb-3">
                  <h6 className="fw-bold text-secondary mb-3">
                    Mother Details (Optional)
                  </h6>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">Name</label>
                      <Controller
                        name="parents.mother.name"
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="text"
                            className="form-control"
                            placeholder="Enter mother name"
                          />
                        )}
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">Phone</label>
                      <Controller
                        name="parents.mother.phone"
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="tel"
                            className="form-control"
                            placeholder="Enter mother phone"
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="modal-footer border-0"
              style={{ padding: "20px 32px 32px", gap: "12px" }}
            >
              <Button
                variant="secondary"
                onClick={onClose}
                disabled={isLoading}
                style={{
                  padding: "12px 32px",
                  borderRadius: "12px",
                  fontWeight: "600",
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={isLoading}
                style={{
                  padding: "12px 32px",
                  borderRadius: "12px",
                  fontWeight: "600",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                }}
              >
                {isLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                      style={{ display: "inline-block" }}
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
