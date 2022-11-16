export const validatePassword = (password: string) => {
  const regex = /^(?=.*\d)(?=.*[A-Z])[0-9a-zA-Z$*&@#]{8,}/;

  const test = regex.test(password);

  return test;
};
