import { useState, useEffect } from "react";
import axios from "axios";
import Toaster from "./Toaster";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, title: "", type: "" });

  const showToast = (title, type) => {
    setToast({ show: true, title, type });
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:3508/api/allcustomer");
      setCustomers(response.data.data);
    } catch (error) {
      showToast("Failed to fetch customers", "error");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {toast.show && (
        <Toaster
          title={toast.title}
          type={toast.type}
          onClose={() => setToast({ show: false })}
        />
      )}

      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Registered Customers
      </h2>

      {customers.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No customers found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by registering a new customer.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {customers.map((customer) => (
            <div
              key={customer.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {customer.full_name}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      customer.device_type === "Desktop"
                        ? "bg-blue-100 text-blue-800"
                        : customer.device_type === "Mobile"
                        ? "bg-green-100 text-green-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {customer.device_type}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Email:</span> {customer.email}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {customer.phone_number}
                  </p>
                  <p>
                    <span className="font-medium">Gender:</span>{" "}
                    {customer.gender}
                  </p>
                  <p>
                    <span className="font-medium">DOB:</span>{" "}
                    {formatDate(customer.date_of_birth)}
                  </p>
                  <p>
                    <span className="font-medium">Address:</span>{" "}
                    {customer.address}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>
                      <span className="font-medium">Browser:</span>{" "}
                      {customer.browser}
                    </p>
                    <p>
                      <span className="font-medium">OS:</span> {customer.os}
                    </p>
                    <p>
                      <span className="font-medium">Registered:</span>{" "}
                      {formatDate(customer.created_at)}
                    </p>
                    <p className="flex items-center gap-1">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {customer.latitude}, {customer.longitude}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerList;
