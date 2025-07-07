import { useState } from "react";
import { Link } from "react-router-dom";
import { COUNTRIES, ISD_CODES } from "../utils/constants";

const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

const countries = COUNTRIES;
const isdCodes = ISD_CODES;

const Register = () => {
  const [form, setForm] = useState({
    user_type: "individual",
    first_name: "",
    last_name: "",
    email: "",
    address: "",
    country: "India",
    state: "",
    city: "",
    pin_code: "",
    isd_code: "+91",
    mobile_number: "",
    fax: "",
    phone: "",
    password: "",
    confirm_password: "",
  });

  const [locationWaiting, setLocationWaiting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "radio" ? String(value).toLowerCase() : value,
    }));

    if (name === "pin_code" && value.length >= 4) {
      fetchLocationFromPin(value, form.country);
    }

    if (name === "country") {
      setForm((prev) => ({
        ...prev,
        country: value,
        isd_code: isdCodes[value] || "",
        city: "",
        state: "",
      }));
    }
  };

  const fetchLocationFromPin = async (pin, country) => {
    try {
      const query = `${pin} ${country}`;
      const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
        query
      )}&apiKey=${GEOAPIFY_API_KEY}`;

      setLocationWaiting(true);

      const res = await fetch(url);
      const data = await res.json();

      if (data.features.length > 0) {
        const props = data.features[0].properties;
        setForm((prev) => ({
          ...prev,
          city: props.city || props.county || "",
          state: props.state || "",
        }));
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    } finally {
      setLocationWaiting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirm_password) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/register/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Registration failed");
      }

      alert("Registration successful. Please log in.");
      window.location.href = "/";
    } catch (err) {
      console.error("Registration error:", err.message);
      alert(err.message || "Something went wrong");
    }
  };

  return (
    <div className="w-full max-w-4xl p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-600">
        USER REGISTRATION
      </h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:grid grid-cols-2 gap-4"
      >
        {/* User Type */}
        <div className="col-span-2">
          <label className="font-medium block mb-2">
            Type of User <span className="text-red-600">*</span>
          </label>
          <div className="flex justify-between">
            {["Individual", "Enterprise", "Government"].map((user_type) => (
              <label key={user_type} className="flex items-center gap-1">
                <input
                  type="radio"
                  name="user_type"
                  value={user_type}
                  checked={form.user_type === user_type}
                  onChange={handleChange}
                />
                {user_type}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-1">
            First Name <span className="text-red-600">*</span>
          </label>
          <input
            name="first_name"
            placeholder="First Name"
            value={form.first_name}
            onChange={handleChange}
            className="px-4 py-2 border rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-1">
            Last Name <span className="text-red-600">*</span>
          </label>
          <input
            name="last_name"
            placeholder="Last Name"
            value={form.last_name}
            onChange={handleChange}
            className="px-4 py-2 border rounded w-full"
          />
        </div>

        <div className="col-span-2">
          <label className="block mb-1">
            Email <span className="text-red-600">*</span>
          </label>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="px-4 py-2 border rounded w-full"
            required
          />
        </div>

        <div className="col-span-2">
          <label className="block mb-1">Address</label>
          <textarea
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="px-4 py-2 border rounded w-full"
          />
        </div>

        <div>
          <label className="block mb-1">
            Country <span className="text-red-600">*</span>
          </label>
          <select
            name="country"
            value={form.country}
            onChange={handleChange}
            className="px-4 py-2 border rounded w-full"
            required
          >
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1">
            PIN Code <span className="text-red-600">*</span>
          </label>
          <input
            name="pin_code"
            placeholder="PIN Code"
            value={form.pin_code}
            onChange={handleChange}
            className="px-4 py-2 border rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-1">City</label>
          <input
            name="city"
            placeholder="City"
            value={locationWaiting ? "Loading..." : form.city}
            onChange={handleChange}
            disabled={locationWaiting}
            className="px-4 py-2 border rounded w-full"
            readOnly
          />
        </div>

        <div>
          <label className="block mb-1">State</label>
          <input
            name="state"
            placeholder="State"
            value={locationWaiting ? "Loading..." : form.state}
            onChange={handleChange}
            disabled={locationWaiting}
            className="px-4 py-2 border rounded w-full"
            readOnly
          />
        </div>

        <div className="col-span-2">
          <label className="block mb-1">
            Mobile Number <span className="text-red-600">*</span>
          </label>
          <div className="flex gap-2">
            <select
              name="isd_code"
              value={form.isd_code}
              onChange={handleChange}
              className="px-4 py-2 border rounded w-1/4"
            >
              {Object.entries(isdCodes).map(([country, code]) => (
                <option key={country} value={code}>
                  {country} ({code})
                </option>
              ))}
            </select>
            <input
              name="mobile_number"
              placeholder="Mobile Number"
              value={form.mobile_number}
              onChange={handleChange}
              className="flex-1 px-4 py-2 border rounded"
              required
            />
          </div>
        </div>

        <div>
          <label className="block mb-1">Fax</label>
          <input
            name="fax"
            placeholder="Fax"
            value={form.fax}
            onChange={handleChange}
            className="px-4 py-2 border rounded w-full"
          />
        </div>

        <div>
          <label className="block mb-1">Phone</label>
          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="px-4 py-2 border rounded w-full"
          />
        </div>

        <div>
          <label className="block mb-1">
            Password <span className="text-red-600">*</span>
          </label>
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="px-4 py-2 border rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-1">
            Confirm Password <span className="text-red-600">*</span>
          </label>
          <input
            name="confirm_password"
            type="password"
            placeholder="Confirm Password"
            value={form.confirm_password}
            onChange={handleChange}
            className="px-4 py-2 border rounded w-full"
            required
          />
        </div>

        <button
          type="submit"
          className="col-span-2 bg-teal-500 text-white py-2 rounded hover:bg-teal-600 mt-4"
        >
          Register
        </button>
      </form>

      <p className="text-sm text-center mt-4">
        Already have an account?{" "}
        <Link to="/" className="text-blue-600">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;
