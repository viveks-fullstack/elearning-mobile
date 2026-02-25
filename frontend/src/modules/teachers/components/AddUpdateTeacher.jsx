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
import EyeOpen from "../../../assets/svg/EyeOpen";
import EyeClosed from "../../../assets/svg/EyeClosed";

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
              {teacher ? "Update Teacher" : "Add New Teacher"}
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
                {/* Name */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">
                    Name <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className={`form-control ${errors.name ? "is-invalid" : ""}`}
                        placeholder="Enter teacher name"
                      />
                    )}
                  />
                  {errors.name && (
                    <div className="invalid-feedback d-block">
                      {errors.name.message}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">
                    Email <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="email"
                        className={`form-control ${errors.email ? "is-invalid" : ""}`}
                        placeholder="Enter email"
                      />
                    )}
                  />
                  {errors.email && (
                    <div className="invalid-feedback d-block">
                      {errors.email.message}
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">
                    Phone <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="tel"
                        className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                        placeholder="Enter phone number"
                      />
                    )}
                  />
                  {errors.phone && (
                    <div className="invalid-feedback d-block">
                      {errors.phone.message}
                    </div>
                  )}
                </div>

                {/* Password */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">
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
                          className={`form-control ${errors.password ? "is-invalid" : ""}`}
                          placeholder="Enter password"
                          style={{ paddingRight: "38px" }}
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
                    <div className="invalid-feedback d-block">
                      {errors.password.message}
                    </div>
                  )}
                </div>

                {/* Qualifications */}
                <div className="col-12 mb-3">
                  <label className="form-label fw-bold">
                    Qualifications <span className="text-danger">*</span>
                  </label>
                  {qualificationFields.map((field, index) => (
                    <div key={field.id} className="card mb-3 p-3">
                      <div className="row">
                        <div className="col-md-6 mb-2">
                          <label className="form-label">Degree *</label>
                          <Controller
                            name={`teacherProfile.qualifications.${index}.degree`}
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="text"
                                className={`form-control ${errors.teacherProfile?.qualifications?.[index]?.degree ? "is-invalid" : ""}`}
                                placeholder="e.g., B.Ed, M.Ed, PhD"
                              />
                            )}
                          />
                          {errors.teacherProfile?.qualifications?.[index]
                            ?.degree && (
                            <div className="invalid-feedback d-block">
                              {
                                errors.teacherProfile.qualifications[index]
                                  .degree.message
                              }
                            </div>
                          )}
                        </div>
                        <div className="col-md-6 mb-2">
                          <label className="form-label">
                            University/Institute *
                          </label>
                          <Controller
                            name={`teacherProfile.qualifications.${index}.university`}
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="text"
                                className={`form-control ${errors.teacherProfile?.qualifications?.[index]?.university ? "is-invalid" : ""}`}
                                placeholder="University or Institute name"
                              />
                            )}
                          />
                          {errors.teacherProfile?.qualifications?.[index]
                            ?.university && (
                            <div className="invalid-feedback d-block">
                              {
                                errors.teacherProfile.qualifications[index]
                                  .university.message
                              }
                            </div>
                          )}
                        </div>
                        <div className="col-md-5 mb-2">
                          <label className="form-label">Start Year *</label>
                          <Controller
                            name={`teacherProfile.qualifications.${index}.startYear`}
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="number"
                                className={`form-control ${errors.teacherProfile?.qualifications?.[index]?.startYear ? "is-invalid" : ""}`}
                                placeholder="2020"
                                min="1950"
                              />
                            )}
                          />
                          {errors.teacherProfile?.qualifications?.[index]
                            ?.startYear && (
                            <div className="invalid-feedback d-block">
                              {
                                errors.teacherProfile.qualifications[index]
                                  .startYear.message
                              }
                            </div>
                          )}
                        </div>
                        <div className="col-md-5 mb-2">
                          <label className="form-label">End Year *</label>
                          <Controller
                            name={`teacherProfile.qualifications.${index}.endYear`}
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="number"
                                className={`form-control ${errors.teacherProfile?.qualifications?.[index]?.endYear ? "is-invalid" : ""}`}
                                placeholder="2024"
                                min="1950"
                              />
                            )}
                          />
                          {errors.teacherProfile?.qualifications?.[index]
                            ?.endYear && (
                            <div className="invalid-feedback d-block">
                              {
                                errors.teacherProfile.qualifications[index]
                                  .endYear.message
                              }
                            </div>
                          )}
                        </div>
                        <div className="col-md-2 mb-2 d-flex align-items-end">
                          {qualificationFields.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-outline-danger w-100"
                              onClick={() => removeQualification(index)}
                            >
                              −
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
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
                    <div className="invalid-feedback d-block">
                      {errors.teacherProfile.qualifications.message}
                    </div>
                  )}
                </div>

                {/* Experiences */}
                <div className="col-12 mb-3">
                  <label className="form-label fw-bold">
                    Experience <span className="text-danger">*</span>
                  </label>
                  {experienceFields.map((field, index) => (
                    <div key={field.id} className="card mb-3 p-3">
                      <div className="row">
                        <div className="col-md-6 mb-2">
                          <label className="form-label">Job Title *</label>
                          <Controller
                            name={`teacherProfile.experiences.${index}.title`}
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="text"
                                className={`form-control ${errors.teacherProfile?.experiences?.[index]?.title ? "is-invalid" : ""}`}
                                placeholder="e.g., Senior Teacher, Principal"
                              />
                            )}
                          />
                          {errors.teacherProfile?.experiences?.[index]
                            ?.title && (
                            <div className="invalid-feedback d-block">
                              {
                                errors.teacherProfile.experiences[index].title
                                  .message
                              }
                            </div>
                          )}
                        </div>
                        <div className="col-md-6 mb-2">
                          <label className="form-label">
                            Company/Organization *
                          </label>
                          <Controller
                            name={`teacherProfile.experiences.${index}.company`}
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="text"
                                className={`form-control ${errors.teacherProfile?.experiences?.[index]?.company ? "is-invalid" : ""}`}
                                placeholder="Company or school name"
                              />
                            )}
                          />
                          {errors.teacherProfile?.experiences?.[index]
                            ?.company && (
                            <div className="invalid-feedback d-block">
                              {
                                errors.teacherProfile.experiences[index].company
                                  .message
                              }
                            </div>
                          )}
                        </div>
                        <div className="col-md-4 mb-2">
                          <label className="form-label">Start Year *</label>
                          <Controller
                            name={`teacherProfile.experiences.${index}.startYear`}
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="number"
                                className={`form-control ${errors.teacherProfile?.experiences?.[index]?.startYear ? "is-invalid" : ""}`}
                                placeholder="2020"
                                min="1950"
                              />
                            )}
                          />
                          {errors.teacherProfile?.experiences?.[index]
                            ?.startYear && (
                            <div className="invalid-feedback d-block">
                              {
                                errors.teacherProfile.experiences[index]
                                  .startYear.message
                              }
                            </div>
                          )}
                        </div>
                        <div className="col-md-4 mb-2">
                          <label className="form-label">End Year</label>
                          <Controller
                            name={`teacherProfile.experiences.${index}.endYear`}
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="number"
                                className={`form-control ${errors.teacherProfile?.experiences?.[index]?.endYear ? "is-invalid" : ""}`}
                                placeholder="2024 or leave empty if current"
                                min="1950"
                              />
                            )}
                          />
                          {errors.teacherProfile?.experiences?.[index]
                            ?.endYear && (
                            <div className="invalid-feedback d-block">
                              {
                                errors.teacherProfile.experiences[index].endYear
                                  .message
                              }
                            </div>
                          )}
                        </div>
                        <div className="col-md-2 mb-2">
                          <label className="form-label">Current</label>
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
                            <button
                              type="button"
                              className="btn btn-outline-danger w-100"
                              onClick={() => removeExperience(index)}
                            >
                              −
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
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
                    <div className="invalid-feedback d-block">
                      {errors.teacherProfile.experiences.message}
                    </div>
                  )}
                </div>

                {/* Assign Class */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">
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
                    <div className="invalid-feedback d-block">
                      {errors.classId.message}
                    </div>
                  )}
                </div>

                {/* Assign Course */}
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">
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
                    <div className="invalid-feedback d-block">
                      {errors.courseId.message}
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
