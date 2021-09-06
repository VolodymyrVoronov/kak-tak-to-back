export const validateRegistrationInput = (userLogin, password, confirmPassword) => {
  const errors = {};

  if (userLogin.trim() === "") {
    errors.userLogin = "Логин не должен быть пустым.";
  }

  if (userLogin.length < 5) {
    errors.userLoginLength = "Логин не должен быть меньше 5 символов.";
  }

  if (password === "") {
    errors.password = "Пароль не должен быть пустым.";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Пароли должны совпадать.";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

export const validateLoginInput = (userLogin, password) => {
  const errors = {};

  if (userLogin.trim() === "") {
    errors.userLogin = "Логин не должен быть пустым.";
  }

  if (password.trim() === "") {
    errors.password = "Пароль не должен быть пустым.";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
