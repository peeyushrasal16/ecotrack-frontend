import React from "react";

function Contact() {
  return (
    <div className="container py-5">
      <h2 className="text-center text-success mb-4">Contact Us</h2>

      <div className="row justify-content-center">
        <div className="col-md-6">

          <div className="card shadow">
            <div className="card-body">

              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your name"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Message</label>
                <textarea
                  className="form-control"
                  rows="5"
                  placeholder="Write your message"
                ></textarea>
              </div>

              <button className="btn btn-success w-100">
                Send Message
              </button>

            </div>
          </div>

          <div className="text-center mt-4">
            <h5>📞 Phone</h5>
            <p>+91 9876543210</p>

            <h5>📧 Email</h5>
            <p>support@ecotrack.com</p>

            <h5>📍 Address</h5>
            <p>Mumbai, Maharashtra, India</p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Contact;