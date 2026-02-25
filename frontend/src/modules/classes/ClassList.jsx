import { useState, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchClasses,
  fetchClassById,
  deleteClass,
  regenerateMeetingLink,
} from "./classes.api";
import { getClassColumns } from "./classes.columns";
import DataTable from "../../components/DataTable";
import Spinner from "../../components/Spinner";
import Pagination from "../../components/Pagination";
import Button from "../../components/Button";
import AddUpdateClass from "./components/AddUpdateClass";
import toast from "react-hot-toast";

export default function ClassList() {
  const [showModal, setShowModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 10;
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["classes", page],
    queryFn: () => fetchClasses({ page, limit }),
    keepPreviousData: true,
  });

  const classes = useMemo(() => data?.data || [], [data?.data]);
  const pagination = useMemo(() => data?.pagination || {}, [data?.pagination]);

  const deleteMutation = useMutation({
    mutationFn: deleteClass,
    onSuccess: () => {
      toast.success("Class deleted successfully!");
      queryClient.invalidateQueries(["classes"]);
      setPage(1);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete class");
    },
  });

  const regenerateLinkMutation = useMutation({
    mutationFn: regenerateMeetingLink,
    onSuccess: () => {
      toast.success("Meeting link regenerated successfully!");
      queryClient.invalidateQueries(["classes"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to regenerate link");
    },
  });

  const handleAdd = useCallback(() => {
    setSelectedClass(null);
    setShowModal(true);
  }, []);

  const handleEdit = useCallback(async (classData) => {
    try {
      toast.loading("Loading class details...", { id: "fetch-class" });
      const classDetails = await fetchClassById(classData._id);
      toast.dismiss("fetch-class");
      setSelectedClass(classDetails);
      setShowModal(true);
    } catch (error) {
      toast.dismiss("fetch-class");
      toast.error(
        error.response?.data?.message || "Failed to fetch class details",
      );
    }
  }, []);

  const handleDelete = useCallback(
    async (classData) => {
      if (
        window.confirm(`Are you sure you want to delete ${classData.title}?`)
      ) {
        await deleteMutation.mutateAsync(classData._id);
      }
    },
    [deleteMutation],
  );

  const handleRegenerateLink = useCallback(
    async (classData) => {
      if (
        window.confirm(
          `Are you sure you want to regenerate the meeting link for ${classData.title}? The old link will no longer work.`,
        )
      ) {
        await regenerateLinkMutation.mutateAsync(classData._id);
      }
    },
    [regenerateLinkMutation],
  );

  const handleCopyLink = useCallback((link) => {
    navigator.clipboard.writeText(link);
    toast.success("Meeting link copied to clipboard!");
  }, []);

  const handleModalClose = useCallback(() => {
    setShowModal(false);
    setSelectedClass(null);
  }, []);

  const handleSuccess = useCallback(() => {
    queryClient.invalidateQueries(["classes"]);
  }, [queryClient]);

  const columns = useMemo(
    () =>
      getClassColumns(
        handleEdit,
        handleDelete,
        handleCopyLink,
        handleRegenerateLink,
      ),
    [handleEdit, handleDelete, handleCopyLink, handleRegenerateLink],
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
              🏫 Classes Management
            </h2>
            <p
              className="mb-0"
              style={{
                color: "rgba(255, 255, 255, 0.85)",
                fontSize: "0.95rem",
              }}
            >
              Manage classes and generate secure meeting links
            </p>
          </div>
          <Button variant="primary" onClick={handleAdd}>
            + Add Class
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
                    data={classes}
                    emptyStateType="classes"
                    emptyStateTitle="No Classes Available"
                    emptyStateMessage="Create your first class to start organizing your educational content."
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
        <AddUpdateClass
          classData={selectedClass}
          onClose={handleModalClose}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
