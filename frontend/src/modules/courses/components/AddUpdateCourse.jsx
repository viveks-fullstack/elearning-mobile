import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import Select from "react-select";
import { createCourseSchema } from "../courses.validation";
import { addCourse, updateCourse } from "../courses.api";
import toast from "react-hot-toast";
import Button from "../../../components/Button";

// Custom styles for react-select
const selectStyles = {
  control: (base, state) => ({
    ...base,
    borderRadius: "12px",
    border: state.isFocused
      ? "2px solid #667eea"
      : state.selectProps.error
        ? "1px solid #dc3545"
        : "1px solid #dee2e6",
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

export default function AddUpdateCourse({
  onClose,
  onSuccess,
  courseData = null,
}) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(createCourseSchema),
    defaultValues: courseData || {
      title: "",
      description: "",
      code: "",
      duration: 0,
      level: "beginner",
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (courseData) {
      setValue("title", courseData.title || "");
      setValue("description", courseData.description || "");
      setValue("code", courseData.code || "");
      setValue("duration", courseData.duration || 0);
      setValue("level", courseData.level || "beginner");
    }
  }, [courseData, setValue]);

  const addMutation = useMutation({
    mutationFn: addCourse,
    onSuccess: () => {
      toast.success("Course created successfully!");
      onSuccess();
      reset();
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create course");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateCourse,
    onSuccess: () => {
      toast.success("Course updated successfully!");
      onSuccess();
      reset();
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update course");
    },
  });

  const onSubmit = async (data) => {
    try {
      if (courseData) {
        await updateMutation.mutateAsync({
          id: courseData._id,
          courseData: data,
        });
      } else {
        await addMutation.mutateAsync(data);
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
              {courseData ? "Update Course" : "Add New Course"}
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
                {/* Title */}
                <div className="col-12 mb-3">
                  <label className="form-label fw-bold">
                    Course Title <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className={`form-control ${errors.title ? "is-invalid" : ""}`}
                        placeholder="Enter course title"
                      />
                    )}
                  />
                  {errors.title && (
                    <div className="invalid-feedback d-block">
                      {errors.title.message}
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="col-12 mb-3">
                  <label className="form-label fw-bold">Description</label>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        className={`form-control ${errors.description ? "is-invalid" : ""}`}
                        placeholder="Enter course description"
                        rows="3"
                      />
                    )}
                  />
                  {errors.description && (
                    <div className="invalid-feedback d-block">
                      {errors.description.message}
                    </div>
                  )}
                </div>

                {/* Code */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Course Code</label>
                  <Controller
                    name="code"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className={`form-control ${errors.code ? "is-invalid" : ""}`}
                        placeholder="e.g., CS101"
                      />
                    )}
                  />
                  {errors.code && (
                    <div className="invalid-feedback d-block">
                      {errors.code.message}
                    </div>
                  )}
                </div>

                {/* Level */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">
                    Level <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="level"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={[
                          { value: "beginner", label: "Beginner" },
                          { value: "intermediate", label: "Intermediate" },
                          { value: "advanced", label: "Advanced" },
                        ]}
                        value={
                          field.value
                            ? {
                                value: field.value,
                                label:
                                  field.value.charAt(0).toUpperCase() +
                                  field.value.slice(1),
                              }
                            : null
                        }
                        onChange={(option) =>
                          field.onChange(option?.value || "")
                        }
                        placeholder="Select level"
                        styles={selectStyles}
                        error={!!errors.level}
                      />
                    )}
                  />
                  {errors.level && (
                    <div className="invalid-feedback d-block">
                      {errors.level.message}
                    </div>
                  )}
                </div>

                {/* Duration */}
                <div className="col-12 mb-3">
                  <label className="form-label fw-bold">
                    Duration (hours) <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="duration"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        className={`form-control ${errors.duration ? "is-invalid" : ""}`}
                        placeholder="Enter duration in hours"
                        min="0"
                      />
                    )}
                  />
                  {errors.duration && (
                    <div className="invalid-feedback d-block">
                      {errors.duration.message}
                    </div>
                  )}
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
                    {courseData ? "Updating..." : "Adding..."}
                  </>
                ) : courseData ? (
                  "Update Course"
                ) : (
                  "Add Course"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
