import { Pet } from '../types';

/**
 * Formats a pet's age based on their birth date
 * @param birthDate - The pet's birth date in YYYY-MM-DD format
 * @returns A formatted age string (e.g., "2 years, 3 months")
 */
export const getPetAge = (birthDate?: string): string => {
  if (!birthDate) return 'Age not specified';
  
  const birth = new Date(birthDate);
  const now = new Date();
  
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  
  if (months < 0 || (months === 0 && now.getDate() < birth.getDate())) {
    years--;
    months += 12;
  }
  
  if (years === 0) {
    return months <= 1 ? '1 month old' : `${months} months old`;
  }
  
  if (months === 0) {
    return years === 1 ? '1 year old' : `${years} years old`;
  }
  
  return `${years} year${years !== 1 ? 's' : ''}, ${months} month${months !== 1 ? 's' : ''} old`;
};

/**
 * Gets the appropriate icon for a pet based on species
 * @param species - The pet's species
 * @returns A React node with the appropriate icon
 */
export const getPetIcon = (species?: string) => {
  switch (species?.toLowerCase()) {
    case 'dog':
      return '🐶';
    case 'cat':
      return '🐱';
    case 'bird':
      return '🐦';
    case 'fish':
      return '🐠';
    case 'rabbit':
      return '🐰';
    case 'hamster':
      return '🐹';
    default:
      return '🐾';
  }
};

/**
 * Formats a pet's weight with the appropriate unit
 * @param weight - The pet's weight
 * @param unit - The unit of measurement (kg or lb)
 * @returns A formatted weight string
 */
export const formatPetWeight = (weight?: string | number, unit: 'kg' | 'lb' = 'kg'): string => {
  if (!weight) return 'Weight not specified';
  
  const weightNum = typeof weight === 'string' ? parseFloat(weight) : weight;
  
  if (isNaN(weightNum)) return 'Invalid weight';
  
  return `${weightNum} ${unit}`;
};

/**
 * Validates pet form data
 * @param data - The form data to validate
 * @returns An object with validation errors (if any)
 */
export const validatePetForm = (data: Partial<Pet>) => {
  const errors: Partial<Record<keyof Pet, string>> = {};
  
  if (!data.name?.trim()) {
    errors.name = 'Name is required';
  }
  
  if (!data.species?.trim()) {
    errors.species = 'Species is required';
  }
  
  if (data.weight !== undefined && data.weight !== '') {
    const weightNum = typeof data.weight === 'string' ? parseFloat(data.weight) : data.weight;
    if (isNaN(weightNum) || weightNum <= 0) {
      errors.weight = 'Please enter a valid weight';
    }
  }
  
  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};
