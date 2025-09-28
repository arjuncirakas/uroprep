import { useState, useEffect } from 'react';

// Validation rules
export const validationRules = {
  psa: {
    required: true,
    min: 0,
    max: 1000,
    pattern: /^\d+(\.\d{1,2})?$/,
    message: 'PSA value must be a number between 0 and 1000'
  },
  date: {
    required: true,
    pattern: /^\d{4}-\d{2}-\d{2}$/,
    future: false,
    message: 'Please enter a valid date in YYYY-MM-DD format'
  },
  phone: {
    pattern: /^(\+61|0)[2-9]\d{8}$/,
    message: 'Please enter a valid Australian phone number'
  },
  medicare: {
    pattern: /^\d{10}$|^\d{11}$/,
    message: 'Medicare number must be 10 or 11 digits'
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  required: {
    required: true,
    message: 'This field is required'
  }
};

// Helper function to get nested object values
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

// Main validation hook
export const useFormValidation = (formData, rules) => {
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    const validationErrors = {};
    let formValid = true;

    Object.keys(rules).forEach(field => {
      const rule = rules[field];
      const value = getNestedValue(formData, field);

      // Skip validation if field hasn't been touched and is not required
      if (!touched[field] && !rule.required) {
        return;
      }

      if (rule.required && (!value || value.toString().trim() === '')) {
        validationErrors[field] = rule.message || `${field} is required`;
        formValid = false;
      } else if (value && rule.pattern && !rule.pattern.test(value.toString())) {
        validationErrors[field] = rule.message || `${field} format is invalid`;
        formValid = false;
      } else if (value && rule.min !== undefined && parseFloat(value) < rule.min) {
        validationErrors[field] = rule.message || `${field} must be at least ${rule.min}`;
        formValid = false;
      } else if (value && rule.max !== undefined && parseFloat(value) > rule.max) {
        validationErrors[field] = rule.message || `${field} must be at most ${rule.max}`;
        formValid = false;
      } else if (value && rule.future === false && new Date(value) > new Date()) {
        validationErrors[field] = rule.message || `${field} cannot be in the future`;
        formValid = false;
      }
    });

    setErrors(validationErrors);
    setIsValid(formValid);
  }, [formData, rules, touched]);

  const validateField = (fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
  };

  const validateAll = () => {
    const allTouched = {};
    Object.keys(rules).forEach(field => {
      allTouched[field] = true;
    });
    setTouched(allTouched);
  };

  const clearErrors = () => {
    setErrors({});
  };

  const clearFieldError = (fieldName) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  return {
    errors,
    isValid,
    touched,
    validateField,
    validateAll,
    clearErrors,
    clearFieldError
  };
};

// PSA-specific validation
export const usePSAValidation = (psaData) => {
  const rules = {
    value: validationRules.psa,
    date: validationRules.date,
    labName: validationRules.required
  };

  return useFormValidation(psaData, rules);
};

// Patient validation
export const usePatientValidation = (patientData) => {
  const rules = {
    firstName: validationRules.required,
    lastName: validationRules.required,
    dateOfBirth: validationRules.date,
    medicareNumber: validationRules.medicare,
    phone: validationRules.phone,
    email: validationRules.email,
    address: validationRules.required
  };

  return useFormValidation(patientData, rules);
};

// Appointment validation
export const useAppointmentValidation = (appointmentData) => {
  const rules = {
    patientId: validationRules.required,
    date: validationRules.date,
    time: validationRules.required,
    type: validationRules.required,
    doctor: validationRules.required
  };

  return useFormValidation(appointmentData, rules);
};
