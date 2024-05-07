interface ValidationResult {
  [key: string]: boolean | string;
}

export const isValid = (data: { [key: string]: string }): ValidationResult => {
  const result: ValidationResult = {};

  for (const key in data) {
    switch (key) {
      case "email": {
        const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        result[key] = re.test(data[key]);
        break;
      }
      case "password": {
        const re =
          /^(?=.*\d)(?=.*[^A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z])\S{8,128}$/;
        result[key] = re.test(data[key]);
        break;
      }
      case "otp": {
        const re = /^\d{6}$/;
        result[key] = re.test(data[key]);
        break;
      }
      default: {
        console.warn(`Invalid validation type specified for key: ${key}.`);
        result[key] = "Invalid field";
        break;
      }
    }
  }

  return result;
};

export const getValidationErrorMessage = (id: string): string => {
  let errorMessage = "";

  switch (id) {
    case "email": {
      errorMessage = "Invalid email address.";
      break;
    }
    case "password": {
      errorMessage =
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one special character.";
      break;
    }
    case "otp": {
      errorMessage = "The verification code must contain 6 digits.";

      break;
    }
    default: {
      console.warn(`Invalid validation type specified for key: ${id}.`);
      errorMessage =
        "There was a problem with your submission. Please check all fields and try again.";
      break;
    }
  }

  return errorMessage;
};
