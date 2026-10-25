import React, { useContext } from 'react';
import { loginContext } from '../../context/LoginContext';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { api } from '../../api';
import { Link, useNavigate } from 'react-router-dom';

function RaiseRequest() {
  const {user}=useContext(loginContext);
  const navigate = useNavigate();
  const {register,handleSubmit,formState:{errors},reset}=useForm();

  const onSubmit=async(data)=>{
    try{
      const payload = {
        itemType: data.itemType,
        quantity: Number(data.quantity),
        address: data.pickupAddress,
      };

      const userEmail = user?.email || JSON.parse(localStorage.getItem("user") || "{}")?.email;

      if (!userEmail) {
        toast.error("Please login to raise a request");
        navigate("/login");
        return;
      }

      await api.post(`/requests/${userEmail}`, payload);
      toast.success("Request Raised successfully");
      reset();
      navigate("/user/dashboard");
    }
    catch(error)
    {
      console.log(error);
      toast.error(error.response?.data?.message || "Something Went Wrong");
    }
  };

  return (
    <section className="bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">

          <div className="col-md-8 col-lg-6">
            <div className="card border-0 shadow-lg rounded-4">

              {/* Header */}
              <div className="card-header bg-success text-white text-center py-4 rounded-top-4">
                <h3 className="fw-bold mb-0">Raise Recycle Request 🌱</h3>
                <p className="mb-0 small">
                  Help us recycle responsibly
                </p>
              </div>

              {/* Body */}
              <div className="card-body p-4">

                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Item Type */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Item Type
                    </label>
                    <select className="form-select" 
                    {...register("itemType", { required: "Item type is required" })}>
                      <option value="">Select item type</option>
                      <option value="Plastic">Plastic</option>
                      <option value="Paper">Paper</option>
                      <option value="E-Waste">E-Waste</option>
                      <option value="Metal">Metal</option>
                      <option value="Glass">Glass</option>
                    </select>
                    {errors.itemType && <small className='text-danger'>{errors.itemType.message}</small>}
                  </div>

                  {/* Quantity */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Quantity (in Kg)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter quantity"
                      {...register("quantity",{required:"Quantity is required"})}
                    />
                    {errors.quantity && <small className='text-danger'>{errors.quantity.message}</small>}
                  </div>

                  {/* Pickup Address */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      Pickup Address
                    </label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Enter pickup address"
                        {...register("pickupAddress",{required:"Pickup address is required"})}
                    ></textarea>
                        {errors.pickupAddress && <small className='text-danger'>{errors.pickupAddress.message}</small>}

                  </div>

                  {/* Submit */}
                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-success btn-lg fw-semibold"
                    >
                      Submit Request
                    </button>
                  </div>
                </form>

                {/* Info */}
                <div className="text-center mt-4">
                  <small className="text-muted">
                    Your request will be reviewed by admin{" "}
                    <Link to={"/user/dashboard"}>dashboard</Link>
                  </small>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default RaiseRequest;
