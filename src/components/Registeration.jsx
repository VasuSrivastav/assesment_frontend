import { useState } from "react";
import axios from "axios";
import Toaster from "./Toaster";
import { getDeviceInfo } from "../utils/deviceInfo";
import { API_BASE_URL } from "../config/config";

const Registration = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    password: "",
    confirmPassword: "",
    latitude: "",
    longitude: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, title: "", type: "" });

  const showToast = (title, type) => {
    setToast({ show: true, title, type });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits";
    }

    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.latitude || !formData.longitude) {
      newErrors.location = "Location is required. Please click 'Get Location'";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      showToast("Geolocation is not supported by your browser", "error");
      return;
    }

    setLoading(true);
    showToast("Requesting location access...", "wait");

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(8),
          longitude: position.coords.longitude.toFixed(8),
        }));
        showToast("Location fetched successfully!", "success");
        setLoading(false);
      },
      (error) => {
        let errorMessage = "Failed to get location: ";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage +=
              "Please allow location access in your browser settings.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage += "Location request timed out.";
            break;
          default:
            errorMessage += error.message;
        }
        showToast(errorMessage, "error");
        setLoading(false);
      },
      options
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const deviceInfo = getDeviceInfo();
      const response = await axios.post(`${API_BASE_URL}/api/register`, {
        ...formData,
        deviceInfo,
      });
      showToast("Registration successful!", "success");
      // Clear form
      setFormData({
        fullName: "",
        email: "",
        phoneNumber: "",
        gender: "",
        dateOfBirth: "",
        address: "",
        password: "",
        confirmPassword: "",
        latitude: "",
        longitude: "",
      });
    } catch (error) {
      showToast(
        error.response?.data?.message || "Registration failed",
        "error"
      );
      setErrors({
        submit: error.response?.data?.message || "Registration failed",
      });
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing encountrt when user want to rewritr on error  field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const getPasswordStrengthColor = (strength) => {
    switch (strength) {
      case 0:
        return "bg-gray-200";
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-orange-500";
      case 3:
        return "bg-yellow-500";
      case 4:
        return "bg-blue-500";
      case 5:
        return "bg-green-500";
      default:
        return "bg-gray-200";
    }
  };

  const getPasswordStrengthText = (strength) => {
    switch (strength) {
      case 0:
        return "Very Weak";
      case 1:
        return "Weak";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Strong";
      case 5:
        return "Very Strong";
      default:
        return "Very Weak";
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-3 sm:p-6 bg-white rounded-lg shadow-lg">
      {toast.show && (
        <Toaster
          title={toast.title}
          type={toast.type}
          onClose={() => setToast({ show: false })}
        />
      )}
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-gray-800">
        Customer Registration Form
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Full Name *
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.fullName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.fullName && (
            <span className="text-red-500 text-sm">{errors.fullName}</span>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email}</span>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Phone Number *
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.phoneNumber ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.phoneNumber && (
            <span className="text-red-500 text-sm">{errors.phoneNumber}</span>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Gender *
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.gender ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && (
            <span className="text-red-500 text-sm">{errors.gender}</span>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Date of Birth *
          </label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.dateOfBirth ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.dateOfBirth && (
            <span className="text-red-500 text-sm">{errors.dateOfBirth}</span>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Address *
            <span className="text-xs text-gray-500 ml-1">
              ({formData.address.length} characters)
            </span>
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.address ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.address && (
            <span className="text-red-500 text-sm">{errors.address}</span>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Password *
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
          />
          {formData.password && (
            <div className="mt-1">
              <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${getPasswordStrengthColor(
                    calculatePasswordStrength(formData.password)
                  )}`}
                  style={{
                    width: `${
                      (calculatePasswordStrength(formData.password) / 5) * 100
                    }%`,
                  }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Strength:{" "}
                {getPasswordStrengthText(
                  calculatePasswordStrength(formData.password)
                )}
              </p>
            </div>
          )}
          {errors.password && (
            <span className="text-red-500 text-sm">{errors.password}</span>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Confirm Password *
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.confirmPassword && (
            <span className="text-red-500 text-sm">
              {errors.confirmPassword}
            </span>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Location *
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              name="latitude"
              value={formData.latitude}
              readOnly
              placeholder="Latitude"
              className="w-full sm:flex-1 p-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
            />
            <input
              type="text"
              name="longitude"
              value={formData.longitude}
              readOnly
              placeholder="Longitude"
              className="w-full sm:flex-1 p-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
            />
            <button
              type="button"
              onClick={handleGetLocation}
              className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
            >
              Get Location
            </button>
          </div>
          {errors.location && (
            <span className="text-red-500 text-sm">{errors.location}</span>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register Customer"}
        </button>
      </form>
    </div>
  );
};

export default Registration;
//             <option value="Other">Other</option>
//           </select>
//           {errors.gender && (
//             <span className="text-red-500 text-sm">{errors.gender}</span>
//           )}
//         </div>

//         <div className="space-y-1">
//           <label className="block text-sm font-medium text-gray-700">
//             Date of Birth *
//           </label>
//           <input
//             type="date"
//             name="dateOfBirth"
//             value={formData.dateOfBirth}
//             onChange={handleChange}
//             className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//               errors.dateOfBirth ? "border-red-500" : "border-gray-300"
//             }`}
//           />
//           {errors.dateOfBirth && (
//             <span className="text-red-500 text-sm">{errors.dateOfBirth}</span>
//           )}
//         </div>

//         <div className="space-y-1">
//           <label className="block text-sm font-medium text-gray-700">
//             Address *
//           </label>
//           <textarea
//             name="address"
//             value={formData.address}
//             onChange={handleChange}
//             className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//               errors.address ? "border-red-500" : "border-gray-300"
//             }`}
//           />
//           {errors.address && (
//             <span className="text-red-500 text-sm">{errors.address}</span>
//           )}
//         </div>

//         <div className="space-y-1">
//           <label className="block text-sm font-medium text-gray-700">
//             Password *
//           </label>
//           <input
//             type="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//               errors.password ? "border-red-500" : "border-gray-300"
//             }`}
//           />
//           {errors.password && (
//             <span className="text-red-500 text-sm">{errors.password}</span>
//           )}
//         </div>

//         <div className="space-y-1">
//           <label className="block text-sm font-medium text-gray-700">
//             Confirm Password *
//           </label>
//           <input
//             type="password"
//             name="confirmPassword"
//             value={formData.confirmPassword}
//             onChange={handleChange}
//             className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//               errors.confirmPassword ? "border-red-500" : "border-gray-300"
//             }`}
//           />
//           {errors.confirmPassword && (
//             <span className="text-red-500 text-sm">
//               {errors.confirmPassword}
//             </span>
//           )}
//         </div>

//         <div className="space-y-1">
//           <label className="block text-sm font-medium text-gray-700">
//             Location *
//           </label>
//           <div className="flex gap-2">
//             <input
//               type="text"
//               name="latitude"
//               value={formData.latitude}
//               readOnly
//               placeholder="Latitude"
//               className="flex-1 p-2 border border-gray-300 rounded-md bg-gray-50"
//             />
//             <input
//               type="text"
//               name="longitude"
//               value={formData.longitude}
//               readOnly
//               placeholder="Longitude"
//               className="flex-1 p-2 border border-gray-300 rounded-md bg-gray-50"
//             />
//             <button
//               type="button"
//               onClick={handleGetLocation}
//               className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//             >
//               Get Location
//             </button>
//           </div>
//           {(locationError || errors.location) && (
//             <span className="text-red-500 text-sm">
//               {locationError || errors.location}
//             </span>
//           )}
//         </div>

//         <button
//           type="submit"
//           className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
//           disabled={loading}
//         >
//           {loading ? "Registering..." : "Register Customer"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Registration;
//     </div>
//   );
// };

// export default Registration;
