/**
 * Meetings API
 * Fetch classes for student/teacher meetings dashboard
 */

import api from "../../app/axios";
import { API_ENDPOINTS } from "../../utils/constants";

export const fetchStudentClasses = async (userId) => {
    const res = await api.get(API_ENDPOINTS.STUDENT_CLASSES(userId));
    return res.data.data;
};

export const fetchTeacherClasses = async (teacherId) => {
    const res = await api.get(API_ENDPOINTS.CLASS_TEACHER(teacherId));
    return res.data.data;
};
