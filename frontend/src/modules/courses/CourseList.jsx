import { useState, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCourses, fetchCourseById, deleteCourse } from "./courses.api";
import { getCourseColumns } from "./courses.columns";
import DataTable from "../../components/DataTable";
import Spinner from "../../components/Spinner";
import Pagination from "../../components/Pagination";
import Button from "../../components/Button";
import AddUpdateCourse from "./components/AddUpdateCourse";
import toast from "react-hot-toast";

export default function CourseList() {
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 10;
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["courses", page],
    queryFn: () => fetchCourses({ page, limit }),
    keepPreviousData: true,
  });

  const courses = useMemo(() => data?.data || [], [data?.data]);
  const pagination = useMemo(() => data?.pagination || {}, [data?.pagination]);

  const deleteMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      toast.success("Course deleted successfully!");
      queryClient.invalidateQueries(["courses"]);
      setPage(1);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete course");
    },
  });

  const handleAdd = useCallback(() => {
    setSelectedCourse(null);
    setShowModal(true);
  }, []);

  const handleEdit = useCallback(async (courseData) => {
    try {
      toast.loading("Loading course details...", { id: "fetch-course" });
      const courseDetails = await fetchCourseById(courseData._id);
      toast.dismiss("fetch-course");
      setSelectedCourse(courseDetails);
      setShowModal(true);
    } catch (error) {
      toast.dismiss("fetch-course");
      toast.error(
        error.response?.data?.message || "Failed to fetch course details",
      );
    }
  }, []);

  const handleDelete = useCallback(
    async (courseData) => {
      if (
        window.confirm(`Are you sure you want to delete ${courseData.title}?`)
      ) {
        await deleteMutation.mutateAsync(courseData._id);
      }
    },
    [deleteMutation],
  );

  const handleModalClose = useCallback(() => {
    setShowModal(false);
    setSelectedCourse(null);
  }, []);

  const handleSuccess = useCallback(() => {
    queryClient.invalidateQueries(["courses"]);
  }, [queryClient]);

  const columns = useMemo(
    () => getCourseColumns(handleEdit, handleDelete),
    [handleEdit, handleDelete],
  );

  return (
    <div
      className="container-fluid py-4"
      style={{ paddingTop: "30px !important" }}
    >
      <div
        className="animate-fade-in"
        style={{
          padding: "35px 40px",
          borderRadius: "24px",
          marginBottom: "30px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          boxShadow: "0 10px 40px rgba(102, 126, 234, 0.25)",
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h2 className="fw-bold mb-2" style={{ color: "white" }}>
              📚 Courses Management
            </h2>
            <p
              className="mb-0"
              style={{
                color: "rgba(255, 255, 255, 0.85)",
                fontSize: "0.95rem",
              }}
            >
              Manage courses, assign teachers, and track curriculum
            </p>
          </div>
          <Button variant="primary" onClick={handleAdd}>
            + Add Course
          </Button>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div
            className="glass-card animate-slide-in"
            style={{
              padding: "32px",
              borderRadius: "24px",
            }}
          >
            {isLoading ? (
              <div className="d-flex justify-content-center align-items-center py-5">
                <Spinner />
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <DataTable
                    columns={columns}
                    data={courses}
                    emptyStateType="courses"
                    emptyStateTitle="No Courses Available"
                    emptyStateMessage="Design and add courses to enrich your learning platform."
                  />
                </div>
                {pagination.totalPages > 1 && (
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.total}
                    itemsPerPage={limit}
                    onPageChange={setPage}
                    showInfo={true}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <AddUpdateCourse
          courseData={selectedCourse}
          onClose={handleModalClose}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
