const ACTIVITY_KEY = "codexa_activity";

export function addActivity(type, title, description) {
  const stored = localStorage.getItem(ACTIVITY_KEY);

  let activities = [];

  try {
    activities = stored ? JSON.parse(stored) : [];
  } catch {
    activities = [];
  }

  const newActivity = {
    id: Date.now(),
    type,
    title,
    description,
    timestamp: new Date().toISOString(),
  };

  const updatedActivities = [
    newActivity,
    ...activities,
  ].slice(0, 50);

  localStorage.setItem(
    ACTIVITY_KEY,
    JSON.stringify(updatedActivities)
  );

  window.dispatchEvent(
    new Event("codexa-activity-updated")
  );
}