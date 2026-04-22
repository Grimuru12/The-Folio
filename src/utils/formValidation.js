/**
 * Form Validation Utilities
 */

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRegistrationForm = (formData) => {
  const errors = {};

  // Name validation
  if (!formData.fullname || formData.fullname.trim() === '') {
    errors.fullname = '*Name is required';
  }

  // Password validation
  if (!formData.password || formData.password === '') {
    errors.password = '*Password is required';
  }

  // Confirm password validation
  if (!formData.cpassword || formData.cpassword === '') {
    errors.cpassword = '*Confirm password is required';
  } else if (formData.cpassword !== formData.password) {
    errors.cpassword = '*Passwords do not match';
  }

  // Date of Birth validation
  if (!formData.dob || formData.dob === '') {
    errors.dob = '*Date of Birth is required';
  } else {
    const birthDate = new Date(formData.dob);
    if (isNaN(birthDate.getTime())) {
      errors.dob = '*Invalid date';
    } else {
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 18) {
        errors.dob = '*User should be 18 years old or older';
      }
    }
  }

  // Interest validation
  if (!formData.interest) {
    errors.interest = '*Please select an interest level';
  }

  // Terms validation
  if (!formData.terms) {
    errors.terms = '*You must agree to the terms and conditions';
  }

  return errors;
};

export const validateContactForm = (formData) => {
  const errors = {};

  if (!formData.username || formData.username.trim() === '') {
    errors.username = '*Name is required';
  }

  if (!formData.email || formData.email.trim() === '') {
    errors.email = '*Email is required';
  } else if (!isValidEmail(formData.email)) {
    errors.email = '*Invalid email format';
  }

  if (!formData.message || formData.message.trim() === '') {
    errors.message = '*Message is required';
  }

  return errors;
};

export const validateLoginForm = (formData) => {
  const errors = {};

  if (!formData.username || formData.username.trim() === '') {
    errors.username = '*Username is required';
  }

  if (!formData.password || formData.password === '') {
    errors.password = '*Password is required';
  }

  return errors;
};
