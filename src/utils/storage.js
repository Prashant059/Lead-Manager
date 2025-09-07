export const load = (key, defaultValue = null) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch (e) {
    console.error("load error", e);
    return defaultValue;
  }
};
export const save = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("save error", e);
  }
};
export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2,8);
