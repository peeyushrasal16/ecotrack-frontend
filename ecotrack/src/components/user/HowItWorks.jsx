import React from "react";

function HowItWorks() {
  return (
    <div className="container py-5">
      <h2 className="text-center text-success mb-4">How EcoTrack Works</h2>

      <div className="row g-4">

        <div className="col-md-4">
          <div className="card shadow h-100 text-center">
            <div className="card-body">
              <h1>📝</h1>
              <h4>1. Raise a Request</h4>
              <p>
                Register or login and submit a waste collection request with
                your location and details.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow h-100 text-center">
            <div className="card-body">
              <h1>🚛</h1>
              <h4>2. Request Processing</h4>
              <p>
                Our team reviews your request and assigns it to the nearest
                collection partner.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow h-100 text-center">
            <div className="card-body">
              <h1>♻️</h1>
              <h4>3. Waste Collection</h4>
              <p>
                The waste is collected and sent for recycling to help keep the
                environment clean.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default HowItWorks;