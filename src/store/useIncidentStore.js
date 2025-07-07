import { create } from "zustand";

export const useIncidentStore = create((set) => ({
  incidents: [],
  setIncidents: (data) => set({ incidents: data }),
  updateIncident: (updatedIncident) =>
    set((state) => ({
      incidents: state.incidents.map((i) =>
        i.id === updatedIncident.id ? updatedIncident : i
      ),
    })),
  clearIncidents: () => set({ incidents: [] }),
}));
