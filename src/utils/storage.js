export function loadData(key, fallback) {
  const saved = localStorage.getItem(key);

  if (saved) {
    return JSON.parse(saved);
  }

  return fallback;
}

export function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function removeData(key) {
  localStorage.removeItem(key);
}
