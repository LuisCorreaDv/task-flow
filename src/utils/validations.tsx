import * as Yup from 'yup';

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Pleaase enter a valid email')
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Please enter a password'),
});

// Validation for task content
export function validateTaskContent(content: string): boolean {
  const trimmedContent = content.trim();
  const regex = /^[a-zA-Z0-9\sáéíóúüñÁÉÍÓÚÜÑ.,;:!?()'"-]{3,50}$/;
  return regex.test(trimmedContent);
}
