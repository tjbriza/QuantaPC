import { z } from 'zod';

export const profileSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  name_first: z.string().min(1, 'First name is required'),
  name_last: z.string().min(1, 'Last name is required'),
});

export const addressSchema = z.object({
  full_name: z
    .string()
    .min(1, 'Full name is required')
    .max(100, 'Full Name is too long'),
  phone_number: z
    .string()
    .min(1, 'Phone number is required')
    .regex(
      /^(09|\+639)\d{9}$/,
      'Please enter a valid Philippine mobile number (09XXXXXXXXX)'
    ),
  country: z
    .string()
    .min(1, 'Country is required')
    .max(50, 'Country name too long'),
  region: z
    .string()
    .min(1, 'Region is required')
    .max(50, 'Region name too long'),
  province: z
    .string()
    .min(1, 'Province is required')
    .max(50, 'Province name too long'),
  city: z.string().min(1, 'City is required').max(50, 'City name too long'),
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
    .max(100, 'Street name too long'),
  building_name: z.string().max(100, 'Building name too long').optional(),
  house_number: z
    .string()
    .min(1, 'House number is required')
    .max(20, 'House number too long'),
  address_label: z
    .string()
    .min(1, 'Address label is required')
    .max(20, 'Address label too long'),
});
