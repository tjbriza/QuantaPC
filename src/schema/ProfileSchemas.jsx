import { z } from 'zod';

export const profileSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  name_first: z.string().min(1, 'First name is required'),
  name_last: z.string().min(1, 'Last name is required'),
});

export const addressSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  phone_number: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[\d\s\-\+\(\)]+$/, 'Invalid phone number format'),
  country: z.string().min(1, 'Country is required'),
  region: z.string().min(1, 'Region is required'),
  province: z.string().min(1, 'Province is required'),
  city: z.string().min(1, 'City is required'),
  barangay: z.string().min(1, 'Barangay is required'),
  postal_code: z.string().min(4, 'Postal code must be at least 4 digits'),
  street_name: z.string().min(1, 'Street name is required'),
  building_name: z.string().optional(),
  house_number: z.string().min(1, 'House number is required'),
  address_label: z.string().min(1, 'Address label is required'),
});
