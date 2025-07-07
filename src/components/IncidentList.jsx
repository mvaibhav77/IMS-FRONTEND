const IncidentList = ({
  incidents,
  loading,
  onSearch,
  search,
  onAction,
  onCreateNew,
}) => {
  const handleSearchChange = (e) => {
    onSearch(e.target.value);
  };

  return (
    <>
      <div className="header flex justify-between items-center pb-6">
        <h2 className="text-2xl text-gray-600 font-bold">
          My Reported Incidents
        </h2>

        <button
          onClick={onCreateNew}
          className="bg-blue-500 text-white px-4 py-2 rounded font-semibold hover:bg-blue-600"
        >
          Create New
        </button>
      </div>
      {/* Search input */}
      <input
        type="text"
        placeholder="Search by Incident ID..."
        value={search}
        onChange={handleSearchChange}
        className="mb-4 w-full px-4 py-2 border rounded"
      />

      <div className="overflow-x-auto">
        {!loading ? (
          incidents.length === 0 ? (
            <p className="py-4 text-center">No incidents found.</p>
          ) : (
            <table className="w-full table-auto border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-2 py-2 border">ID</th>
                  <th className="px-2 py-2 border">Type</th>
                  <th className="px-2 py-2 border">Priority</th>
                  <th className="px-2 py-2 border">Status</th>
                  <th className="px-2 py-2 border">Reported On</th>
                  <th className="px-2 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((incident) => (
                  <tr key={incident.incident_id} className="text-center">
                    <td className="border px-2 py-1">{incident.incident_id}</td>
                    <td className="border px-2 py-1">
                      {incident.incident_type}
                    </td>
                    <td className="border px-2 py-1">{incident.priority}</td>
                    <td className="border px-2 py-1">{incident.status}</td>
                    <td className="border px-2 py-1">
                      {new Date(incident.reported_datetime).toLocaleString()}
                    </td>
                    <td className="border px-2 py-1">
                      <button
                        onClick={() =>
                          onAction(
                            incident.status === "Closed" ? "view" : "edit",
                            incident
                          )
                        }
                        className="text-blue-600 hover:underline cursor-pointer"
                      >
                        {incident.status === "Closed" ? "View" : "View/Edit"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        ) : (
          <p className="py-4 text-center">Loading your incidents...</p>
        )}
      </div>
    </>
  );
};

export default IncidentList;
