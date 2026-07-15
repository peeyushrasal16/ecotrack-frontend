import React from "react";
import { useForm } from "react-hook-form";
import { api } from "../../api";
import { toast } from "react-toastify";

function Register() {
  // useForm Hook
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  // watch
  let password= watch("password")

  // submitHandler
  const onSubmit = async (data) => {
    console.log(data);
    // api handling
    try {
      const response = await api.post("/users/register", data);
      console.log(response);
      toast.success("Registration successful")
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card border-0 shadow-lg">
              {/* Header */}
              <div className="card-header bg-success text-white text-center py-4">
                <h3 className="fw-bold mb-0">Create Your EcoTrack Account</h3>
                <p className="mb-0 small">
                  Join us in building a greener future 🌱
                </p>
              </div>

              {/* Body */}
              <div className="card-body p-4">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your full name"
                      name="name"
                      {...register("name", { required: "Name is required" })}
                    />
                    {errors.name && (
                      <small className="text-danger">
                        {errors.name.message}
                      </small>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter your email"
                      name="email"
                      {...register("email", { required: "email is required" ,
                        validate:async (value)=>{
                          try{
                             const response=await api.get(`/users/exists?email=${value}`)
                             const exists=response.data;
                             console.log(exists);
                             
                             return exists ? "email already exists": true;
                          }catch(error)
                          {
                            console.log(error);
                            
                             return "Unable to validate email"
                          }
                        }
                      })}
                    />

                    {errors.email && (
                      <small className="text-danger">
                        {errors.email.message}
                      </small>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Create a password"
                      name="password"
                      {...register("password", {
                        required: "password is required",
                        pattern: {
                          value:
                            /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/,
                          message:
                            "Checks that a password has a minimum of 6 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 number with no spaces.",
                        },
                      })}
                    />
                    {errors.password && (
                      <small className="text-danger">
                        {errors.password.message}
                      </small>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Re-enter password"
                      name="confirmPassword"
                      {...register("confirmPassword", {
                        required: "confirm password is required",
                        validate: (value) =>
                          value === password || "Passwords do not match",
                      })}
                    />

                    {errors.confirmPassword && (
                      <small className="text-danger">
                        {errors.confirmPassword.message}
                      </small>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Phoneno</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your email"
                      name="phoneNo"
                      {...register("phone_number", {
                        required: "phoneNo is required",
                      })}
                    />

                    {errors.phoneNo && (
                      <small className="text-danger">
                        {errors.phoneNo.message}
                      </small>
                    )}
                  </div>

                  <div className="d-grid">
                    <button type="submit" className="btn btn-success btn-lg">
                      Register
                    </button>
                  </div>
                </form>

                <div className="text-center mt-4">
                  <p className="mb-0">
                    Already have an account?{" "}
                    <a href="/login" className="text-success fw-semibold">
                      Login
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;