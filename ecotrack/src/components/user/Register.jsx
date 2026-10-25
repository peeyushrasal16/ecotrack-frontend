import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { api } from "../../api";
import { toast } from "react-toastify";

function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur",
  });

  const password = watch("password");

  // Check email availability
  const validateEmail = async (value) => {
    if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Please enter a valid email address";
    }

    try {
      // Must match UserController: @GetMapping("/check-email")
      const response = await api.get("/users/check-email", {
        params: {
          email: value.trim(),
        },
      });

      const exists = response.data;

      return exists
        ? "Email already exists"
        : true;
    } catch (error) {
      console.error(
        "Email validation failed:",
        error.response?.status,
        error.response?.data || error.message
      );

      return "Unable to validate email. Please try again.";
    }
  };

  // Submit registration form
  const onSubmit = async (data) => {
    try {
      const names = (data.name || '').trim().split(' ');
      const firstName = names[0] || '';
      const lastName = names.slice(1).join(' ') || '';

      const payload = {
        ...data,
        firstName,
        lastName,
        email: data.email.trim(),
      };

      // Do not send confirmPassword unless your backend requires it.
      delete payload.confirmPassword;

      const response = await api.post("/users/register", payload);

      console.log("Registration response:", response.data);
      toast.success("Registration successful! Redirecting to login...");
      navigate("/login");
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  return (
    <section className="bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card border-0 shadow-lg">
              <div className="card-header bg-success text-white text-center py-4">
                <h3 className="fw-bold mb-0">
                  Create Your EcoTrack Account
                </h3>
                <p className="mb-0 small">
                  Join us in building a greener future 🌱
                </p>
              </div>

              <div className="card-body p-4">
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  {/* Full Name */}
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.name ? "is-invalid" : ""
                      }`}
                      placeholder="Enter your full name"
                      {...register("name", {
                        required: "Name is required",
                        minLength: {
                          value: 2,
                          message: "Name must contain at least 2 characters",
                        },
                      })}
                    />
                    {errors.name && (
                      <small className="text-danger">
                        {errors.name.message}
                      </small>
                    )}
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className={`form-control ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      placeholder="Enter your email"
                      autoComplete="email"
                      {...register("email", {
                        required: "Email is required",
                        validate: validateEmail,
                      })}
                    />
                    {errors.email && (
                      <small className="text-danger">
                        {errors.email.message}
                      </small>
                    )}
                  </div>

                  {/* Password */}
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className={`form-control ${
                        errors.password ? "is-invalid" : ""
                      }`}
                      placeholder="Create a password"
                      autoComplete="new-password"
                      {...register("password", {
                        required: "Password is required",
                        pattern: {
                          value:
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)\S{6,}$/,
                          message:
                            "Password must contain at least 6 characters, one uppercase letter, one lowercase letter, and one number, without spaces.",
                        },
                      })}
                    />
                    {errors.password && (
                      <small className="text-danger">
                        {errors.password.message}
                      </small>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-4">
                    <label className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      className={`form-control ${
                        errors.confirmPassword ? "is-invalid" : ""
                      }`}
                      placeholder="Re-enter password"
                      autoComplete="new-password"
                      {...register("confirmPassword", {
                        required: "Confirm password is required",
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

                  {/* Phone Number */}
                  <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      className={`form-control ${
                        errors.phone_number ? "is-invalid" : ""
                      }`}
                      placeholder="Enter your phone number"
                      {...register("phone_number", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^\d{10}$/,
                          message: "Enter a valid 10-digit phone number",
                        },
                      })}
                    />
                    {errors.phone_number && (
                      <small className="text-danger">
                        {errors.phone_number.message}
                      </small>
                    )}
                  </div>

                  {/* Submit */}
                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-success btn-lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Please wait..." : "Register"}
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
