import { z } from 'zod';

export const profileSchema = z.object({
  username: z
    .string()
    .min(3, 'At least 3 characters for username is required')
    .max(20, 'Username too long'),
  name_first: z
    .string()
    .min(2, 'At least 2 characters for first name is required')
    .max(30, 'First name too long')
    .regex(/^[A-Za-z]+$/, 'Only letters allowed'),
  name_last: z
    .string()
    .min(2, 'At least 2 characters for last name is required')
    .max(30, 'Last name too long')
    .regex(/^[A-Za-z]+$/, 'Only letters allowed'),
});

export const profileSetupSchema = z.object({
  username: z
    .string()
    .min(3, 'At least 3 characters for username is required')
    .max(20, 'Username too long'),
  name_first: z
    .string()
    .min(2, 'At least 2 characters for first name is required')
    .max(30, 'First name too long')
    .regex(/^[A-Za-z]+$/, 'Only letters allowed'),
  name_last: z
    .string()
    .min(2, 'At least 2 characters for last name is required')
    .max(30, 'Last name too long')
    .regex(/^[A-Za-z]+$/, 'Only letters allowed'),
  avatar_url: z.any().refine((file) => file && file instanceof File, {
    message: 'Please upload a profile picture',
  }),
});

export const addressSchema = z.object({
  full_name: z
    .string()
    .min(1, 'Full name is required')
    .max(70, 'Full name too long')
    .regex(/^[A-Za-z\s.]+$/, 'Only letters, spaces, and periods allowed'),
  phone_number: z
    .string()
    .min(1, 'Phone number is required')
    .regex(
      /^(09|\+639)\d{9}$/,
      'Please enter a valid Philippine mobile number (09XXXXXXXXX)',
    ),
  country: z.enum(['Philippines'], { message: 'Only Philippines is allowed' }),
  region: z.enum(['NCR'], {
    message: 'Only NCR is allowed',
  }),
  province: z.enum(['Metro Manila'], {
    message: 'Only Metro Manila is allowed',
  }),
  city: z
    .string()
    .min(1, 'City is required')
    .max(30, 'City name too long')
    .regex(/^[A-Za-z\s]+$/, 'Only letters allowed'),
  barangay: z
    .string()
    .min(1, 'Barangay is required')
    .max(50, 'Barangay name too long'),
  postal_code: z
    .string()
    .length(4, 'Philippine postal code must be exactly 4 digits')
    .regex(/^\d{4}$/, 'Postal code must contain only numbers'),
  street_name: z
    .string()
    .min(1, 'Street name is required')
    .max(80, 'Street name too long'),
  building_name: z.string().max(80, 'Building name too long').optional(),
  house_number: z
    .string()
    .min(1, 'House number is required')
    .max(15, 'House number too long'),
  address_label: z
    .string()
    .min(1, 'Address label is required')
    .max(20, 'Address label too long'),
});
