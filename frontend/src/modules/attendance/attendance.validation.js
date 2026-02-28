/**
 * Attendance Form Validation Rules
 */

export const attendanceValidation = {
    studentId: {
        required: "Student is required",
    },
    status: {
        required: "Attendance status is required",
    },
    remarks: {
        maxLength: {
            value: 500,
            message: "Remarks cannot exceed 500 characters",
        },
    },
};

export const validateAttendanceForm = (data) => {
    const errors = {};

    if (!data.studentId || data.studentId.trim() === "") {
        errors.studentId = "Student is required";
    }

    if (!data.status || data.status.trim() === "") {
        errors.status = "Attendance status is required";
    } else if (!["present", "absent", "leave"].includes(data.status)) {
        errors.status = "Invalid attendance status";
    }

    if (data.remarks && data.remarks.length > 500) {
        errors.remarks = "Remarks cannot exceed 500 characters";
    }

    return errors;
};
