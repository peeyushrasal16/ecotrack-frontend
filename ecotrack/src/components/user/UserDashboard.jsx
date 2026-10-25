import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginContext } from "../../context/LoginContext";
import { api } from "../../api";

export function UserDashboard() {

  const {user}=useContext(loginContext);

  const [requests,setRequests]=useState([]);
  const fetchRequests= async()=>{

  try {
   const response= await api.get(`/requests/${user?.email}`);
   setRequests(Array.isArray(response.data) ? response.data : []);
  } catch (error) {
    console.log(error);
  }
  }
  useEffect(()=>{
    if(user?.email)
    fetchRequests();
  },[user])
  const navigate=useNavigate();
  // Static array of requests
  // const requests = [
  //   { id: 1, itemType: "Plastic", quantity: 5, status: "PENDING" },
  //   { id: 2, itemType: "Paper", quantity: 10, status: "APPROVED" },
  //   { id: 3, itemType: "Glass", quantity: 7, status: "REJECTED" },
  //   { id: 4, itemType: "Metal", quantity: 3, status: "PENDING" },
  // ];

  // Count by status
  const pendingCount = requests.filter(r => r.status === "PENDING").length;
  const approvedCount = requests.filter(r => r.status === "APPROVED").length;
  const rejectedCount = requests.filter(r => r.status === "REJECTED").length;

  return (
    <div className="container mt-5">
      <div className="card shadow rounded-4 p-4 border-success">
        <h2 className="fw-bold text-success mb-3">User Dashboard</h2>
        <p className="mb-4">
          Welcome, <strong>{user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || "User"}</strong>
        </p>

        {/* Summary Cards */}
        <div className="d-flex gap-3 mb-4">
          <div className="card text-center flex-fill shadow-sm p-3 border-success">
            <h5 className="text-success">Pending</h5>
            <p className="fs-4 text-success">{pendingCount}</p>
          </div>
          <div className="card text-center flex-fill shadow-sm p-3 border-success">
            <h5 className="text-success">Approved</h5>
            <p className="fs-4 text-success">{approvedCount}</p>
          </div>
          <div className="card text-center flex-fill shadow-sm p-3 border-success">
            <h5 className="text-success">Rejected</h5>
            <p className="fs-4 text-success">{rejectedCount}</p>
          </div>
        </div>

        {/* Raise Request Button */}
        <button className="btn btn-success mb-4" onClick={()=>navigate("/raise-request")}>
          Raise New Request
        </button>

        {/* Requests Table */}
        <h4 className="fw-bold mb-3 text-success">Your Requests</h4>
        <div className="table-responsive">
          <table className="table table-bordered align-middle text-center">
            <thead className="table-success">
              <tr>
                <th>#</th>
                <th>Item Type</th>
                <th>Quantity (kg)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r, index) => (
                <tr key={r.id}>
                  <td>{index + 1}</td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
