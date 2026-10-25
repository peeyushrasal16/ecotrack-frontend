import { useContext, useEffect, useState } from "react";
import { loginContext } from "../../context/LoginContext";
import { api } from "../../api";
import { toast } from "react-toastify";

export function AdminDashboard() {
  const { user } = useContext(loginContext);

  const [requests, setRequests] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Workshop Form State
  const [workshopForm, setWorkshopForm] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    startDate: "",
  });
  const [workshopImage, setWorkshopImage] = useState(null);

  const fetchRequests = async () => {
    try {
      const response = await api.get("/requests");
      setRequests(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log("Error fetching admin requests:", error);
    }
  };

  const fetchWorkshops = async () => {
    try {
      const response = await api.get("/workshops");
      setWorkshops(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log("Error fetching workshops:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchWorkshops();
  }, []);

  // Approve request
  const handleApprove = async (id) => {
    try {
      await api.put(`/requests/${id}/approve`);
      fetchRequests();
      toast.success("Request approved");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  // Reject request
  const handleReject = async (id) => {
    try {
      await api.put(`/requests/${id}/reject`);
      fetchRequests();
      toast.success("Request rejected");
    } catch (error) {
      toast.error("Request rejection failed");
    }
  };

  // Delete Workshop
  const handleDeleteWorkshop = async (id) => {
    if (!window.confirm("Are you sure you want to delete this workshop?")) return;
    try {
      await api.delete(`/workshops/${id}`);
      fetchWorkshops();
      toast.success("Workshop deleted successfully");
    } catch (error) {
      toast.error("Failed to delete workshop");
    }
  };

  // Handle Add Workshop Submit
  const handleAddWorkshop = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        name: workshopForm.name,
        description: workshopForm.description,
        price: Number(workshopForm.price),
        duration: Number(workshopForm.duration),
        startDate: workshopForm.startDate ? `${workshopForm.startDate}T10:00:00` : null,
      };

      // 1. Create Workshop
      const res = await api.post("/workshops", payload);
      const createdWorkshop = res.data;

      // 2. Upload image if selected
      if (workshopImage && createdWorkshop?.id) {
        const formData = new FormData();
        formData.append("workshopImage", workshopImage);
        await api.put(`/workshops/${createdWorkshop.id}/upload-image`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      toast.success("Workshop added successfully 🌱");
      setShowAddModal(false);
      setWorkshopForm({ name: "", description: "", price: "", duration: "", startDate: "" });
      setWorkshopImage(null);
      fetchWorkshops();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add workshop");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow rounded-4 p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="fw-bold text-success mb-0">Admin Dashboard</h2>
          <button
            className="btn btn-success fw-semibold shadow-sm"
            onClick={() => setShowAddModal(true)}
          >
            + Add New Workshop
          </button>
        </div>

        <p className="mb-4">
          Welcome, <strong>{user?.firstName || user?.name || "Admin"}</strong>
        </p>

        {/* Top Cards */}
        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm p-4 text-center hover-card" style={{ background: "linear-gradient(135deg, #e0f7e9, #a3e4d7)" }}>
              <div className="mb-3">
                <i className="bi bi-people-fill text-success fs-2"></i>
              </div>
              <h5 className="fw-bold">Total Users</h5>
              <p className="fs-2 fw-bold text-success">120</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm p-4 text-center hover-card" style={{ background: "linear-gradient(135deg, #d0e9ff, #7ec0ee)" }}>
              <div className="mb-3">
                <i className="bi bi-gear-fill text-primary fs-2"></i>
              </div>
              <h5 className="fw-bold">Total Workshops</h5>
              <p className="fs-2 fw-bold text-primary">{workshops.length}</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm p-4 text-center hover-card" style={{ background: "linear-gradient(135deg, #fff4d0, #ffc107)" }}>
              <div className="mb-3">
                <i className="bi bi-clock-history text-warning fs-2"></i>
              </div>
              <h5 className="fw-bold">Pending Requests</h5>
              <p className="fs-2 fw-bold text-warning">
                {requests.filter((r) => r.status === "PENDING").length}
              </p>
            </div>
          </div>
        </div>

        {/* Manage Workshops Table */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold text-success mb-0">Active Workshops</h4>
        </div>
        <div className="table-responsive mb-5">
          <table className="table table-bordered align-middle text-center">
            <thead className="table-success">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Price (₹)</th>
                <th>Duration (Days)</th>
                <th>Start Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {workshops.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-muted py-3">No workshops created yet. Click "+ Add New Workshop" to create one.</td>
                </tr>
              ) : (
                workshops.map((w, index) => (
                  <tr key={w.id}>
                    <td>{index + 1}</td>
                    <td className="fw-semibold">{w.name}</td>
                    <td>₹{w.price}</td>
                    <td>{w.duration}</td>
                    <td>{w.startDate ? new Date(w.startDate).toLocaleDateString() : "N/A"}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteWorkshop(w.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Requests Table */}
        <h4 className="fw-bold mb-3 text-success">Recent Recycle Requests</h4>
        <div className="table-responsive">
          <table className="table table-bordered align-middle text-center">
            <thead className="table-success">
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Item Type</th>
                <th>Quantity (kg)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-muted py-3">No requests found</td>
                </tr>
              ) : (
                requests.map((r, index) => (
                  <tr key={r.id}>
                    <td>{index + 1}</td>
                    <td>{r.user?.firstName || r.user?.email || r.user || "N/A"}</td>
                    <td>{r.itemType}</td>
                    <td>{r.quantity}</td>
                    <td>
                      <span
                        className={`badge ${
                          r.status === "PENDING"
                            ? "bg-warning text-dark"
                            : r.status === "APPROVED"
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td>
                      {r.status === "PENDING" ? (
                        <>
                          <button
                            className="btn btn-sm btn-success me-2"
                            onClick={() => handleApprove(r.id)}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleReject(r.id)}
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <em>No actions</em>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Workshop Modal */}
      {showAddModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow rounded-4">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title fw-bold">Add New Workshop 🌱</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <form onSubmit={handleAddWorkshop}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Workshop Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Zero-Waste Living"
                      required
                      value={workshopForm.name}
                      onChange={(e) =>
                        setWorkshopForm({ ...workshopForm, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Enter workshop details"
                      required
                      value={workshopForm.description}
                      onChange={(e) =>
                        setWorkshopForm({ ...workshopForm, description: e.target.value })
                      }
                    ></textarea>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Price (₹)</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="e.g. 499"
                        required
                        value={workshopForm.price}
                        onChange={(e) =>
                          setWorkshopForm({ ...workshopForm, price: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Duration (Days)</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="e.g. 2"
                        required
                        value={workshopForm.duration}
                        onChange={(e) =>
                          setWorkshopForm({ ...workshopForm, duration: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Start Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={workshopForm.startDate}
                      onChange={(e) =>
                        setWorkshopForm({ ...workshopForm, startDate: e.target.value })
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Workshop Image (Optional)</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => setWorkshopImage(e.target.files[0])}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success fw-semibold"
                    disabled={submitting}
                  >
                    {submitting ? "Adding..." : "Add Workshop"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Hover card CSS */}
      <style>
        {`
          .hover-card {
            transition: transform 0.3s, box-shadow 0.3s;
            border-radius: 15px;
          }
          .hover-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.15);
          }
        `}
      </style>
    </div>
  );
}

export default AdminDashboard;
