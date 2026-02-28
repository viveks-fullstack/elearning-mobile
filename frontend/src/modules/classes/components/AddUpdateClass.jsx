import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { createClassSchema } from "../classes.validation";
import {
  createClass,
  updateClass,
  generateAuthorizedMeetingLink,
} from "../classes.api";
import toast from "react-hot-toast";
import Button from "../../../components/Button";
import { FormField } from "../../../components/FormField";
import modalStyles from "../../../components/Modal.module.css";
import styles from "./AddUpdateClass.module.css";

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

  const handleCopyMeetingLink = async () => {
    try {
      if (!classData?._id) return;
      const linkData = await generateAuthorizedMeetingLink(classData._id);
      const linkToCopy = linkData?.joinUrl;

      if (!linkToCopy) {
        toast.error("Meeting link is not available");
        return;
      }

      navigator.clipboard.writeText(linkToCopy);
      toast.success("Authorized meeting link copied to clipboard!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to generate secure link",
      );
    }
  };

  return (
    <div className={`modal d-block ${modalStyles.modalOverlay}`}>
      <div className={`modal-dialog modal-lg ${modalStyles.modalDialog}`}>
        <div
          className={`modal-content glass-card animate-fade-in ${modalStyles.modalContent}`}
        >
          <div className={`modal-header border-0 ${modalStyles.modalHeader}`}>
            <h5 className={`modal-title fw-bold ${modalStyles.modalTitle}`}>
              {classData ? "Update Class" : "Add New Class"}
            </h5>
            <button
              type="button"
              className={`btn-close btn-close-white ${modalStyles.closeButton}`}
              onClick={onClose}
            ></button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={`modal-body ${modalStyles.modalBody}`}>
              <div className="row">
                {/* Title */}
                <div className="col-12 mb-3">
                  <FormField
                    label="Class Title"
                    name="title"
                    control={control}
                    errors={errors}
                    placeholder="Enter class title"
                    required
                  />
                </div>

                {/* Total Hours */}
                <div className="col-12 mb-3">
                  <FormField
                    label="Total Hours"
                    name="totalHours"
                    control={control}
                    errors={errors}
                    type="number"
                    placeholder="Enter total hours"
                    required
                  />
                </div>

                {/* Meeting Link (Display only if editing) */}
                {classData?._id && (
                  <div className="col-12 mb-3">
                    <label className={styles.meetingLinkLabel}>
                      Secure Meeting Link
                    </label>
                    <div className={styles.meetingLinkContainer}>
                      <button
                        type="button"
                        className={styles.copyButton}
                        onClick={handleCopyMeetingLink}
                      >
                        Generate & Copy
                      </button>
                    </div>
                    <small className={styles.noteText}>
                      Generates a short-lived authorized Jitsi join link for the
                      logged-in user.
                    </small>
                  </div>
                )}
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
