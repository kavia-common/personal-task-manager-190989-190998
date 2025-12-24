export function generateId() {
  // Simple nanoid-like generator
  const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let id = '';
  for (let i = 0; i < 12; i += 1) {
    id += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return id;
}

export function nowISOString() {
  return new Date().toISOString();
}
