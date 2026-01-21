export const saveTreatmentId = (id: number) => {
  const key = "activeTreatmentIds";

  const stored = localStorage.getItem(key);
  const ids: number[] = stored ? JSON.parse(stored) : [];

  if (!ids.includes(id)) {
    ids.push(id);
  }

  localStorage.setItem(key, JSON.stringify(ids));
};