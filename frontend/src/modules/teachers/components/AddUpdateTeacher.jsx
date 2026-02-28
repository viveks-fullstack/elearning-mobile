import { useState, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import Select from "react-select";
import { createTeacherSchema } from "../teachers.validation";
import { addTeacher, updateTeacher } from "../teachers.api";
import {
  fetchClasses,
  fetchClassesByTeacher,
  assignTeacherToClasses,
} from "../../classes/classes.api";
import {
  fetchCourses,
  fetchCoursesByTeacher,
  assignTeacherToCourses,
} from "../../courses/courses.api";
import toast from "react-hot-toast";
import Button from "../../../components/Button";
import {
  FormField,
  PasswordField,
  SelectField,
} from "../../../components/FormField";
import EyeOpen from "../../../assets/svg/EyeOpen";
import EyeClosed from "../../../assets/svg/EyeClosed";
import styles from "./AddUpdateTeacher.module.css";
import modalStyles from "../../../components/Modal.module.css";

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

export default function AddUpdateTeacher({
  onClose,
  onSuccess,
  teacher = null,
}) {
  const [showPassword, setShowPassword] = useState(false);

  // Fetch all classes and courses for selection
  const { data: allClassesData } = useQuery({
    queryKey: ["classes"],
    queryFn: fetchClasses,
  });

  const { data: allCoursesData } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  const allClasses = allClassesData?.data || [];
  const allCourses = allCoursesData?.data || [];

  // Fetch teacher's current classes and courses when editing
  const { data: teacherClasses = [] } = useQuery({
    queryKey: ["teacherClasses", teacher?._id],
    queryFn: () => fetchClassesByTeacher(teacher._id),
    enabled: !!teacher?._id,
  });

  const { data: teacherCourses = [] } = useQuery({
    queryKey: ["teacherCourses", teacher?._id],
    queryFn: () => fetchCoursesByTeacher(teacher._id),
    enabled: !!teacher?._id,
  });

  // Set selected class and course when editing
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(createTeacherSchema),
    defaultValues: teacher || {
      name: "",
      phone: "",
      email: "",
      password: "",
      classId: "",
      courseId: "",
      teacherProfile: {
        qualifications: [
          { degree: "", university: "", startYear: "", endYear: "" },
        ],
        experiences: [
          {
            title: "",
            company: "",
            startYear: "",
            endYear: "",
            isCurrent: false,
          },
        ],
      },
    },
  });

  const {
    fields: qualificationFields,
    append: appendQualification,
    remove: removeQualification,
  } = useFieldArray({
    control,
    name: "teacherProfile.qualifications",
  });

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control,
    name: "teacherProfile.experiences",
  });

  useEffect(() => {
    if (teacher) {
      // Populate basic fields
      setValue("name", teacher.name || "");
      setValue("email", teacher.email || "");
      setValue("phone", teacher.phone || "");

      // Populate teacher profile if exists
      if (teacher.teacherProfile) {
        if (teacher.teacherProfile.qualifications?.length > 0) {
          setValue(
            "teacherProfile.qualifications",
            teacher.teacherProfile.qualifications,
          );
        }
        if (teacher.teacherProfile.experiences?.length > 0) {
          setValue(
            "teacherProfile.experiences",
            teacher.teacherProfile.experiences,
          );
        }
      }
    }
  }, [teacher, setValue]);

  useEffect(() => {
    if (teacher && teacherClasses.length > 0) {
      setValue("classId", teacherClasses[0]._id);
    }
  }, [teacher, teacherClasses, setValue]);

  useEffect(() => {
    if (teacher && teacherCourses.length > 0) {
      setValue("courseId", teacherCourses[0]._id);
    }
  }, [teacher, teacherCourses, setValue]);

  const addMutation = useMutation({
    mutationFn: addTeacher,
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create teacher");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateTeacher,
    onSuccess: () => {
      toast.success("Teacher updated successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update teacher");
    },
  });

  const onSubmit = async (data) => {
    try {
      let teacherId;

      // Extract class and course IDs from form data
      const { classId, courseId, ...teacherData } = data;

      if (teacher) {
        await updateMutation.mutateAsync({
          id: teacher._id,
          teacherData,
        });
        teacherId = teacher._id;
      } else {
        const newTeacher = await addMutation.mutateAsync(teacherData);
        teacherId = newTeacher._id;
      }

      // Assign class and course to the teacher (sent as arrays for future scalability)
      const classIds = classId ? [classId] : [];
      const courseIds = courseId ? [courseId] : [];

      await Promise.all([
        assignTeacherToClasses({ teacherId, classIds }),
        assignTeacherToCourses({ teacherId, courseIds }),
      ]);

      if (!teacher) {
        toast.success("Teacher created and assigned successfully!");
      }

      onSuccess();
      reset();
      onClose();
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
              {teacher ? "Update Teacher" : "Add New Teacher"}
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
                {/* Name */}
                <div className="col-md-6">
                  <FormField
                    label="Name"
                    name="name"
                    control={control}
                    errors={errors}
                    placeholder="Enter teacher name"
                    required
                  />
                </div>

                {/* Email */}
                <div className="col-md-6">
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
                <div className="col-md-6">
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
                <div className="col-md-6">
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

                {/* Qualifications */}
                <div className="col-12 mb-3">
                  <label className={styles.selectLabel}>
                    Qualifications <span className="text-danger">*</span>
                  </label>
                  {qualificationFields.map((field, index) => (
                    <div key={field.id} className="card mb-3 p-3">
                      <div className="row">
                        <div className="col-md-6 mb-2">
                          <FormField
                            label="Degree"
                            name={`teacherProfile.qualifications.${index}.degree`}
                            control={control}
                            errors={errors}
                            placeholder="e.g., B.Ed, M.Ed, PhD"
                            required
                          />
                        </div>
                        <div className="col-md-6 mb-2">
                          <FormField
                            label="University/Institute"
                            name={`teacherProfile.qualifications.${index}.university`}
                            control={control}
                            errors={errors}
                            placeholder="University or Institute name"
                            required
                          />
                        </div>
                        <div className="col-md-5 mb-2">
                          <FormField
                            label="Start Year"
                            name={`teacherProfile.qualifications.${index}.startYear`}
                            control={control}
                            errors={errors}
                            type="number"
                            placeholder="2020"
                            min="1950"
                            required
                          />
                        </div>
                        <div className="col-md-5 mb-2">
                          <FormField
                            label="End Year"
                            name={`teacherProfile.qualifications.${index}.endYear`}
                            control={control}
                            errors={errors}
                            type="number"
                            placeholder="2024"
                            min="1950"
                            required
                          />
                        </div>
                        <div className="col-md-2 mb-2 d-flex align-items-end">
                          {qualificationFields.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              className={styles.removeInlineButton}
                              onClick={() => removeQualification(index)}
                            >
                              −
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className={styles.addInlineButton}
                    onClick={() =>
                      appendQualification({
                        degree: "",
                        university: "",
                        startYear: "",
                        endYear: "",
                      })
                    }
                  >
                    + Add Qualification
                  </button>
                  {errors.teacherProfile?.qualifications && (
                    <div className={styles.fieldError}>
                      {errors.teacherProfile.qualifications.message}
                    </div>
                  )}
                </div>

                {/* Experiences */}
                <div className="col-12 mb-3">
                  <label className={styles.selectLabel}>
                    Experience <span className="text-danger">*</span>
                  </label>
                  {experienceFields.map((field, index) => (
                    <div key={field.id} className="card mb-3 p-3">
                      <div className="row">
                        <div className="col-md-6 mb-2">
                          <FormField
                            label="Job Title"
                            name={`teacherProfile.experiences.${index}.title`}
                            control={control}
                            errors={errors}
                            placeholder="e.g., Senior Teacher, Principal"
                            required
                          />
                        </div>
                        <div className="col-md-6 mb-2">
                          <FormField
                            label="Company/Organization"
                            name={`teacherProfile.experiences.${index}.company`}
                            control={control}
                            errors={errors}
                            placeholder="Company or school name"
                            required
                          />
                        </div>
                        <div className="col-md-4 mb-2">
                          <FormField
                            label="Start Year"
                            name={`teacherProfile.experiences.${index}.startYear`}
                            control={control}
                            errors={errors}
                            type="number"
                            placeholder="2020"
                            min="1950"
                            required
                          />
                        </div>
                        <div className="col-md-4 mb-2">
                          <FormField
                            label="End Year"
                            name={`teacherProfile.experiences.${index}.endYear`}
                            control={control}
                            errors={errors}
                            type="number"
                            placeholder="2024 or leave empty if current"
                            min="1950"
                          />
                        </div>
                        <div className="col-md-2 mb-2">
                          <label className={styles.selectLabel}>Current</label>
                          <Controller
                            name={`teacherProfile.experiences.${index}.isCurrent`}
                            control={control}
                            render={({ field }) => (
                              <div className="form-check">
                                <input
                                  {...field}
                                  type="checkbox"
                                  className="form-check-input"
                                  checked={field.value}
                                />
                                <label className="form-check-label">Yes</label>
                              </div>
                            )}
                          />
                        </div>
                        <div className="col-md-2 mb-2 d-flex align-items-end">
                          {experienceFields.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              className={styles.removeInlineButton}
                              onClick={() => removeExperience(index)}
                            >
                              −
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className={styles.addInlineButton}
                    onClick={() =>
                      appendExperience({
                        title: "",
                        company: "",
                        startYear: "",
                        endYear: "",
                        isCurrent: false,
                      })
                    }
                  >
                    + Add Experience
                  </button>
                  {errors.teacherProfile?.experiences && (
                    <div className={styles.fieldError}>
                      {errors.teacherProfile.experiences.message}
                    </div>
                  )}
                </div>

                {/* Assign Class */}
                <div className="col-md-6 mb-3">
                  <label className={styles.selectLabel}>
                    Assign Class <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="classId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={allClasses.map((classItem) => ({
                          value: classItem._id,
                          label: classItem.title,
                        }))}
                        value={
                          field.value
                            ? {
                                value: field.value,
                                label:
                                  allClasses.find((c) => c._id === field.value)
                                    ?.title || "",
                              }
                            : null
                        }
                        onChange={(option) =>
                          field.onChange(option?.value || "")
                        }
                        isClearable
                        placeholder="Select a class"
                        styles={selectStyles}
                        error={!!errors.classId}
                      />
                    )}
                  />
                  {errors.classId && (
                    <div className={styles.fieldError}>
                      {errors.classId.message}
                    </div>
                  )}
                </div>

                {/* Assign Course */}
                <div className="col-md-6 mb-3">
                  <label className={styles.selectLabel}>
                    Assign Course <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="courseId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={allCourses.map((course) => ({
                          value: course._id,
                          label: `${course.title} (${course.code || "No code"})`,
                        }))}
                        value={
                          field.value
                            ? {
                                value: field.value,
                                label: allCourses.find(
                                  (c) => c._id === field.value,
                                )
                                  ? `${allCourses.find((c) => c._id === field.value).title} (${allCourses.find((c) => c._id === field.value).code || "No code"})`
                                  : "",
                              }
                            : null
                        }
                        onChange={(option) =>
                          field.onChange(option?.value || "")
                        }
                        isClearable
                        placeholder="Select a course"
                        styles={selectStyles}
                        error={!!errors.courseId}
                      />
                    )}
                  />
                  {errors.courseId && (
                    <div className={styles.fieldError}>
                      {errors.courseId.message}
                    </div>
                  )}
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
                    {teacher ? "Updating..." : "Adding..."}
                  </>
                ) : teacher ? (
                  "Update Teacher"
                ) : (
                  "Add Teacher"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
