import { useEffect, useState, useMemo } from "react";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import { useIncidentStore } from "../store/useIncidentStore";
import IncidentList from "../components/IncidentList";
import IncidentForm from "../components/IncidentForm";

const Dashboard = () => {
  const incidents = useIncidentStore((state) => state.incidents);
  const setIncidents = useIncidentStore((state) => state.setIncidents);

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [activeView, setActiveView] = useState("list"); // 'list' | 'view' | 'edit' | 'create'
  const [selectedIncident, setSelectedIncident] = useState(null);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const res = await fetchWithAuth(
        `${import.meta.env.VITE_API_BASE_URL}/incidents/`
      );
      if (!res.ok) throw new Error("Failed to fetch incidents");
      const data = await res.json();
      setIncidents(data);
    } catch (err) {
      console.error(err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (incidents.length === 0) fetchIncidents();
  }, []);

  const filteredIncidents = useMemo(() => {
    return incidents.filter((i) =>
      i.incident_id.toLowerCase().includes(search.toLowerCase())
    );
  }, [incidents, search]);

  const handleListAction = (mode, incident) => {
    setSelectedIncident(incident);
    setActiveView(mode); // 'view' or 'edit'
  };

  const handleCreateNew = () => {
    setSelectedIncident(null);
    setActiveView("create");
  };

  const handleBack = () => {
    setSelectedIncident(null);
    setActiveView("list");
  };

  return (
    <div className="card md:min-w-[600px] w-full max-w-4xl mx-auto p-6 bg-white shadow rounded">
      {activeView === "list" ? (
          <IncidentList
            incidents={filteredIncidents}
            loading={loading}
            search={search}
            onSearch={setSearch}
            onAction={handleListAction}
            onCreateNew={handleCreateNew}
          />
      ) : (
        <IncidentForm
          mode={activeView}
          incident={selectedIncident}
          onBack={handleBack}
          onSuccess={fetchIncidents}
        />
      )}
    </div>
  );
};

export default Dashboard;
