import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "../../app/authContext";
import { fetchStudentClasses, fetchTeacherClasses } from "./meetings.api";
import { generateAuthorizedMeetingLink } from "../classes/classes.api";
import Spinner from "../../components/Spinner";
import Button from "../../components/Button";
import { toastApiError, toastSuccess } from "../../utils/toast";
import ClassIcon from "../../assets/svg/ClassIcon";
import styles from "./MeetingsDashboard.module.css";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [];

  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  return days;
}

export default function MeetingsDashboard() {
  const { user } = useAuth();
  const isTeacher = user?.role === "teacher";
  const [now] = useState(() => new Date());
  const [calMonth, setCalMonth] = useState(now.getMonth());
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [joiningId, setJoiningId] = useState(null);

  const { data: classes = [], isLoading } = useQuery({
    queryKey: [isTeacher ? "teacherClasses" : "studentClasses", user?.id],
    queryFn: () =>
      isTeacher ? fetchTeacherClasses(user.id) : fetchStudentClasses(user.id),
    enabled: !!user?.id,
  });

  const joinMutation = useMutation({
    mutationFn: generateAuthorizedMeetingLink,
    onSuccess: (data) => {
      const url = data?.meetingLink || data?.url || data;
      if (url) {
        window.open(url, "_blank", "noopener");
        toastSuccess("Joining meeting…");
      }
    },
    onError: (err) => toastApiError(err),
    onSettled: () => setJoiningId(null),
  });

  const handleJoin = (classId) => {
    setJoiningId(classId);
    joinMutation.mutate(classId);
  };

  const calendarDays = useMemo(
    () => getCalendarDays(calYear, calMonth),
    [calYear, calMonth],
  );

  const prevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear((y) => y - 1);
    } else setCalMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear((y) => y + 1);
    } else setCalMonth((m) => m + 1);
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Greeting */}
      <div className={styles.greeting}>
        <h2 className={styles.greetingTitle}>
          Welcome Back{user?.name ? `, ${user.name}` : ""}!
        </h2>
        <p className={styles.greetingSubtitle}>
          {isTeacher
            ? "Here are your classes. Start or join a meeting anytime."
            : "Here are your enrolled classes. Join live meetings below."}
        </p>
      </div>

      <div className={styles.grid}>
        {/* Classes / Meetings List */}
        <div className={styles.meetingsSection}>
          <h4 className={styles.sectionTitle}>
            <ClassIcon size={20} />
            <span>My Classes</span>
            <span className={styles.badge}>{classes.length}</span>
          </h4>

          {classes.length === 0 ? (
            <div className={styles.emptyState}>
              <ClassIcon size={48} />
              <p>
                {isTeacher
                  ? "No classes assigned to you yet."
                  : "You are not enrolled in any classes yet."}
              </p>
            </div>
          ) : (
            <div className={styles.meetingsList}>
              {classes.map((cls) => {
                const classData = cls.class || cls; // handle populated join-table shape
                const classId = classData._id || classData.id;
                const teacherName =
                  classData.teacher?.name || classData.teacher?.email || "—";

                return (
                  <div key={classId} className={styles.meetingCard}>
                    <div className={styles.meetingInfo}>
                      <h5 className={styles.meetingTitle}>{classData.title}</h5>
                      {!isTeacher && (
                        <span className={styles.teacherLabel}>
                          Teacher: {teacherName}
                        </span>
                      )}
                      {classData.totalHours && (
                        <span className={styles.hoursLabel}>
                          {classData.totalHours}h total
                        </span>
                      )}
                    </div>
                    <Button
                      variant="primary"
                      onClick={() => handleJoin(classId)}
                      loading={joiningId === classId}
                      disabled={joiningId === classId}
                      className={styles.joinBtn}
                    >
                      {joiningId === classId ? "Joining…" : "Join Meeting"}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Calendar */}
        <div className={styles.calendarSection}>
          <div className={styles.calendarHeader}>
            <button onClick={prevMonth} className={styles.calNavBtn}>
              ‹
            </button>
            <span className={styles.calMonthLabel}>
              {MONTHS[calMonth]} {calYear}
            </span>
            <button onClick={nextMonth} className={styles.calNavBtn}>
              ›
            </button>
          </div>

          <div className={styles.calendarGrid}>
            {WEEKDAYS.map((d) => (
              <div key={d} className={styles.calWeekday}>
                {d}
              </div>
            ))}
            {calendarDays.map((day, i) => {
              const isToday =
                day === now.getDate() &&
                calMonth === now.getMonth() &&
                calYear === now.getFullYear();

              return (
                <div
                  key={i}
                  className={`${styles.calDay} ${!day ? styles.calDayEmpty : ""} ${isToday ? styles.calDayToday : ""}`}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
