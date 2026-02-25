import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { createClassSchema } from "../classes.validation";
import { createClass, updateClass } from "../classes.api";
import toast from "react-hot-toast";
import Button from "../../../components/Button";

export default function AddUpdateClass({
  onClose,
  onSuccess,
  classData = null,
}) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(createClassSchema),
    defaultValues: classData || {
      title: "",
      totalHours: 0,
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (classData) {
      setValue("title", classData.title || "");
      setValue("totalHours", classData.totalHours || 0);
    }
  }, [classData, setValue]);

  const addMutation = useMutation({
    mutationFn: createClass,
    onSuccess: () => {
      toast.success("Class created successfully!");
      onSuccess();
      reset();
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create class");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateClass,
    onSuccess: () => {
      toast.success("Class updated successfully!");
      onSuccess();
      reset();
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update class");
    },
  });

  const onSubmit = async (data) => {
    try {
      if (classData) {
        await updateMutation.mutateAsync({
          id: classData._id,
          classData: data,
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
              {classData ? "Update Class" : "Add New Class"}
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
                    Class Title <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className={`form-control ${errors.title ? "is-invalid" : ""}`}
                        placeholder="Enter class title"
                      />
                    )}
                  />
                  {errors.title && (
                    <div className="invalid-feedback d-block">
                      {errors.title.message}
                    </div>
                  )}
                </div>

                {/* Total Hours */}
                <div className="col-12 mb-3">
                  <label className="form-label fw-bold">
                    Total Hours <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="totalHours"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        className={`form-control ${errors.totalHours ? "is-invalid" : ""}`}
                        placeholder="Enter total hours"
                        min="0"
                      />
                    )}
                  />
                  {errors.totalHours && (
                    <div className="invalid-feedback d-block">
                      {errors.totalHours.message}
                    </div>
                  )}
                </div>

                {/* Meeting Link (Display only if editing) */}
                {classData?.meetingLink && (
                  <div className="col-12 mb-3">
                    <label className="form-label fw-bold">Meeting Link</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        value={classData.meetingLink}
                        readOnly
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => {
                          navigator.clipboard.writeText(classData.meetingLink);
                          toast.success("Link copied to clipboard!");
                        }}
                      >
                        Copy
                      </button>
                    </div>
                    <small className="text-muted">
                      Meeting link is auto-generated when creating a class
                    </small>
                  </div>
                )}
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
                    {classData ? "Updating..." : "Adding..."}
                  </>
                ) : classData ? (
                  "Update Class"
                ) : (
                  "Add Class"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
