export function readStorage(key, fallbackValue) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) {
      return fallbackValue;
    }
    return JSON.parse(raw);
  } catch (error) {
    return fallbackValue;
  }
}

export function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // Ignore storage write failures.
  }
}

export function removeStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    // Ignore storage delete failures.
  }
}

export function readString(key, fallbackValue) {
  try {
    return localStorage.getItem(key) || fallbackValue;
  } catch (error) {
    return fallbackValue;
  }
}

export function writeString(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    // Ignore storage write failures.
  }
}