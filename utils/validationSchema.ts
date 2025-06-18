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
    .matches(/^\S*$/, "Password must not contain spaces"),
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
    .min(6, "Password must be at least 6 characters")
    .required("Password is required")
    .matches(/^\S*$/, "Password must not contain spaces"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
    store_name: yup.string().required('Store name is required'),
  contact: yup.string().required('Contact is required'),
  email_store: yup
    .string()
    .email('Invalid email')
    .required('Store email is required'),
  store_url: yup
    .string()
    .url('Store URL is Must be Valid')
    .required('Store URL is required'),
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
    .matches(/^\S*$/, "Password must not contain spaces"),
  confirm_password: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("new_password")], "Passwords must match")
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
    .min(6, "Password must be at least 6 characters")
    .test(
      "no-spaces",
      "Password cannot contain spaces",
      (value) => !/\s/.test(value)
    ),
});
