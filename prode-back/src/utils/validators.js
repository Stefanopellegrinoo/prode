export const isValidId = (id) => {
  const num = Number(id);
  return Number.isInteger(num) && num > 0;
};

export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
