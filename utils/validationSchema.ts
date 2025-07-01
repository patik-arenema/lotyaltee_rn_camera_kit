import * as yup from "yup";

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .test("valid-email-format", "Enter a valid email", (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || "")
    )
    .email("Invalid email")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6)
    .matches(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      "Password must contain at least 1 uppercase letter, 1 number, and 1 special character"
    ).matches(/^\S*$/, "Password must not contain spaces"),
});

export const registerSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .matches(/^[a-zA-Z\s'-]+$/, "Invalid Name"),
  email: yup
    .string()
    .trim()
    .test("valid-email-format", "Enter a valid email", (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || "")
    )
    .email("Invalid email")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      "Password must contain at least 1 uppercase letter, 1 number, and 1 special character"
    )
    .matches(/^\S*$/, "Password must not contain spaces"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required")
    .matches(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      "Password must contain at least 1 uppercase letter, 1 number, and 1 special character"
    ),
  store_name: yup.string().required('Store name is required'),
  contact: yup
    .string()
    .matches(/^\d+$/, "Contact must contain only digits")
    .max(16, "Contact must be at most 16 digits")
    .required("Contact is required"),
  email_store: yup
    .string()
    .trim()
    .test("valid-email-format", "Enter a valid email", (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || "")
    )
    .email("Invalid email")
    .required("Email is required"),
  store_url: yup
    .string()
    .matches(
      /^(?!https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
      "Store URL must be a valid domain like example.com"
    )
    .required("Store URL is required"),
  country: yup.string().required('Country is required'),
  state: yup.string().required('State is required'),
  city: yup.string().required('City is required'),
  address: yup.string().required('Address is required'),
});

export const updatePasswordSchema = yup.object().shape({
  old_password: yup
    .string()
    .required("Old password is required")
    .matches(/^\S*$/, "Password must not contain spaces"),
  new_password: yup
    .string()
    .required("New password is required")
    .min(6, "New password must be at least 6 characters")
    .matches(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      "Password must contain at least 1 uppercase letter, 1 number, and 1 special character"
    )
    .matches(/^\S*$/, "Password must not contain spaces"),
  confirm_password: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("new_password")], "Passwords must match")
    .matches(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      "Password must contain at least 1 uppercase letter, 1 number, and 1 special character"
    )
    .matches(/^\S*$/, "Password must not contain spaces"),
});

export const forgotEmailSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .trim("No Spaces allowed")
    .strict(true)
    .test("valid-email-format", "Enter a valid email", (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || "")
    )
    .test(
      "no-spaces",
      "Email cannot contain spaces",
      (value) => !/\s/.test(value)
    ),
});

export const forgotPasswordSchema = yup.object().shape({
  new_password: yup
    .string()
    .required("Password is required")
    .matches(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      "Password must contain at least 1 uppercase letter, 1 number, and 1 special character"
    )
    .min(6, "Password must be at least 6 characters")
    .test(
      "no-spaces",
      "Password cannot contain spaces",
      (value) => !/\s/.test(value)
    ),
});
