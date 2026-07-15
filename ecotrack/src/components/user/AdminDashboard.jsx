import { useContext, useEffect, useState } from "react";
import { loginContext } from "../../context/LoginContext";
import { api } from "../../api";
import { toast } from "react-toastify";


export function AdminDashboard() {
  const { user } = useContext(loginContext);

  // Dummy requests (replace with API fetch later)
  const [requests, setRequests] = useState([
    // { id: 1, itemType: "Plastic", quantity: 5, status: "PENDING", user: "Rohit" },
    // { id: 2, itemType: "E-Waste", quantity: 2, status: "APPROVED", user: "Anita" },
    // { id: 3, itemType: "Paper", quantity: 10, status: "PENDING", user: "Aman" },
  ]);

  const fetchRequests=async ()=>{
    try {
      const response =await api.get("/requests")

    } catch (error) {
      
    }
  }

  useEffect(()=>{
    fetchRequests()
  },[])

  // Approve request
  const handleApprove = async (id) => {
    try {
      const response=await api.put(`requests/${id}/approve`)
      fetchRequests()
      toast.success("request approved")
      
    } catch (error) {
      toast.error("Something went wrong")
      
    }
    // TODO: Call API to approve request
  };

  // Reject request
  const handleReject = async (id) => {
    try {
      const response=await api.put(`requests/${id}/reject?reason="admin reject"`)
      fetchRequests()
      toast.success("request reject")
      
    } catch (error) {
      toast.error("request rejection failed")
      
    }
    
    // TODO: Call API to reject request
  };

  return (
    <div className="container mt-5">
      <div className="card shadow rounded-4 p-4">
        <h2 className="fw-bold text-success mb-3">Admin Dashboard</h2>
        <p className="mb-4">
          Welcome, <strong>{user?.name}</strong>
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
              <p className="fs-2 fw-bold text-primary">15</p>
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

        {/* Requests Table */}
        <h4 className="fw-bold mb-3">Recent Requests</h4>
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
              {requests.map((r, index) => (
                <tr key={r.id}>
                  <td>{index + 1}</td>
                  <td>{r.user}</td>
                  <td>{r.itemType}</td>
                  <td>{r.quantity}</td>
                  <td>
                    <span
                      className={`badge ${
                        r.status === "PENDING"
                          ? "bg-warning"
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
