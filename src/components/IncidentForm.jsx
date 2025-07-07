import { useState, useEffect } from "react";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { useUserStore } from "../store/useUserStore";

const INCIDENT_TYPES = ["Enterprise", "Government"];
const PRIORITIES = ["High", "Medium", "Low"];
const STATUSES = ["Open", "In Progress", "Closed"];

function IncidentForm({ mode = "create", incident = null, onBack, onSuccess }) {
  const isView = mode === "view";
  const isEdit = mode === "edit";

  const user = useUserStore((state) => state.user);

  const [form, setForm] = useState({
    incident_type: "Enterprise",
    reporter_name:
      !isView && !isEdit ? user.first_name + " " + user.last_name : "",
    incident_details: "",
    priority: "Low",
    status: "Open",
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if ((isEdit || isView) && incident) {
      setForm({
        incident_type: incident.incident_type,
        reporter_name: incident.reporter_name,
        incident_details: incident.incident_details,
        priority: incident.priority,
        status: incident.status,
      });
    }
  }, [incident, isEdit, isView]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isView) return;

    const url = isEdit
      ? `${import.meta.env.VITE_API_BASE_URL}/incidents/${
          incident.incident_id
        }/`
      : `${import.meta.env.VITE_API_BASE_URL}/incidents/`;

    const method = isEdit ? "PUT" : "POST";

    try {
      setIsLoading(true);
      const res = await fetchWithAuth(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to submit incident");

      alert(`Incident ${isEdit ? "updated" : "created"} successfully`);
      onSuccess();
      onBack();
    } catch (err) {
      console.error(err.message);
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="header flex justify-between items-center pb-6">
        <h2 className="text-2xl text-gray-600 font-bold">
          {isView
            ? "View Incident"
            : isEdit
            ? "Edit Incident"
            : "Create New Incident"}
        </h2>

        <button
          onClick={onBack}
          className="bg-yellow-500 text-white px-4 py-2 font-semibold rounded hover:bg-yellow-600"
        >
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Incident Type</label>
          <select
            name="incident_type"
            value={form.incident_type}
            onChange={handleChange}
            disabled={isView}
            className="w-full px-4 py-2 border rounded"
          >
            {INCIDENT_TYPES.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Reporter Name</label>
          <input
            name="reporter_name"
            value={form.reporter_name}
            onChange={handleChange}
            disabled={true}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Incident Details</label>
          <textarea
            name="incident_details"
            value={form.incident_details}
            onChange={handleChange}
            disabled={isView}
            className="w-full px-4 py-2 border rounded"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Priority</label>
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            disabled={isView}
            className="w-full px-4 py-2 border rounded"
          >
            {PRIORITIES.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>

        {isEdit && (
          <div>
            <label className="block font-medium mb-1">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            >
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        )}

        {!isView && (
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : isEdit ? "Update" : "Create"}
          </button>
        )}
      </form>
    </>
  );
}

export default IncidentForm;
