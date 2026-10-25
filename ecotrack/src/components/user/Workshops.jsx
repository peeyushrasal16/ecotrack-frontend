import React, { useContext, useEffect, useState } from "react";
import { api } from "../../api";
import { loginContext } from "../../context/LoginContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export function Workshops() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState(null);

  const { user, isAuthenticated } = useContext(loginContext);
  const navigate = useNavigate();

  const fetchWorkshops = async () => {
    try {
      setLoading(true);
      const res = await api.get("/workshops");
      setWorkshops(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching workshops:", err);
      toast.error("Failed to load workshops");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const handleEnroll = async (workshop) => {
    if (!isAuthenticated || !user?.email) {
      toast.info("Please login to enroll in this workshop");
      navigate("/login");
      return;
    }

    try {
      setEnrollingId(workshop.id);

      // 1. Call Backend to create order & enrollment record
      const res = await api.post(`/enroll/${user.email}/${workshop.id}`);
      const enrollment = res.data;

      if (!enrollment || !enrollment.orderId) {
        toast.error("Failed to generate payment order");
        setEnrollingId(null);
        return;
      }

      // 2. Open Razorpay Checkout modal
      const options = {
        key: "rzp_test_S060WMnc2eFoWe", // Test Razorpay Key
        amount: enrollment.amount * 100, // in paisa
        currency: "INR",
        name: "EcoTrack",
        description: `Enrollment for ${workshop.name}`,
        order_id: enrollment.orderId,
        handler: async function (response) {
          try {
            // 3. Confirm Payment on backend
            await api.post("/enroll/confirm", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            toast.success("Payment Successful! Enrolled successfully 🌱");
          } catch (err) {
            console.error("Payment confirmation failed:", err);
            toast.error("Payment verification failed on server");
          }
        },
        prefill: {
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          email: user.email,
        },
        theme: {
          color: "#198754",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", function (response) {
        toast.error(response.error.description || "Payment Failed");
      });
      razorpay.open();
    } catch (err) {
      console.error("Enrollment error:", err);
      toast.error(err.response?.data?.message || "Failed to initiate enrollment");
    } finally {
      setEnrollingId(null);
    }
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold text-success">Upcoming Green Workshops 🌱</h2>
        <p className="text-muted">
          Learn sustainable living, waste management, and eco-friendly practices.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : workshops.length === 0 ? (
        <div className="text-center py-5">
          <p className="fs-5 text-muted">No workshops available at the moment.</p>
        </div>
      ) : (
        <div className="row g-4">
          {workshops.map((w) => (
            <div className="col-md-6 col-lg-4" key={w.id}>
              <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                <img
                  src={
                    w.image
                      ? `http://localhost:8080/workshops/image/${w.image}`
                      : "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=60"
                  }
                  className="card-img-top"
                  alt={w.name}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="badge bg-success">₹{w.price}</span>
                    <span className="text-muted small">
                      ⏱ {w.duration} {w.duration > 1 ? "Days" : "Day"}
                    </span>
                  </div>
                  <h5 className="card-title fw-bold text-dark">{w.name}</h5>
                  <p className="card-text text-muted flex-grow-1">
                    {w.description}
                  </p>
                  {w.startDate && (
                    <small className="text-muted mb-3">
                      📅 Starts: {new Date(w.startDate).toLocaleDateString()}
                    </small>
                  )}
                  <button
                    className="btn btn-success w-100 fw-semibold rounded-3 mt-auto"
                    onClick={() => handleEnroll(w)}
                    disabled={enrollingId === w.id}
                  >
                    {enrollingId === w.id ? "Processing..." : `Enroll Now (₹${w.price})`}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Workshops;
