'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  EyeOff,
  Info
} from 'lucide-react';

interface ValidationRule {
  test: (value: string) => boolean;
  message: string;
  type: 'error' | 'warning' | 'info';
}

interface InputValidationProps {
  value: string;
  rules: ValidationRule[];
  showValidation?: boolean;
  className?: string;
}

export function InputValidation({
  value,
  rules,
  showValidation = true,
  className = ''
}: InputValidationProps) {
  const [validationResults, setValidationResults] = useState<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
    infos: string[];
  }>({
    isValid: true,
    errors: [],
    warnings: [],
    infos: []
  });

  useEffect(() => {
    if (!showValidation || !value) {
      setValidationResults({
        isValid: true,
        errors: [],
        warnings: [],
        infos: []
      });
      return;
    }

    const errors: string[] = [];
    const warnings: string[] = [];
    const infos: string[] = [];

    rules.forEach(rule => {
      if (!rule.test(value)) {
        switch (rule.type) {
          case 'error':
            errors.push(rule.message);
            break;
          case 'warning':
            warnings.push(rule.message);
            break;
          case 'info':
            infos.push(rule.message);
            break;
        }
      }
    });

    setValidationResults({
      isValid: errors.length === 0,
      errors,
      warnings,
      infos
    });
  }, [value, rules, showValidation]);

  if (!showValidation || (!validationResults.errors.length && !validationResults.warnings.length && !validationResults.infos.length)) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className={cn("space-y-1", className)}
    >
      {validationResults.errors.map((error, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: index * 0.1 }}
          className="flex items-center space-x-2 text-sm text-red-600"
        >
          <XCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      ))}
      
      {validationResults.warnings.map((warning, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: index * 0.1 }}
          className="flex items-center space-x-2 text-sm text-yellow-600"
        >
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{warning}</span>
        </motion.div>
      ))}
      
      {validationResults.infos.map((info, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: index * 0.1 }}
          className="flex items-center space-x-2 text-sm text-blue-600"
        >
          <Info className="w-4 h-4 flex-shrink-0" />
          <span>{info}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}

// Password strength indicator
interface PasswordStrengthProps {
  password: string;
  className?: string;
}

export function PasswordStrength({ password, className = '' }: PasswordStrengthProps) {
  const [strength, setStrength] = useState<{
    score: number;
    label: string;
    color: string;
  }>({
    score: 0,
    label: 'Very Weak',
    color: 'bg-red-500'
  });

  useEffect(() => {
    if (!password) {
      setStrength({
        score: 0,
        label: 'Very Weak',
        color: 'bg-red-500'
      });
      return;
    }

    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      symbols: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    Object.values(checks).forEach(check => {
      if (check) score++;
    });

    let label: string;
    let color: string;

    if (score <= 1) {
      label = 'Very Weak';
      color = 'bg-red-500';
    } else if (score <= 2) {
      label = 'Weak';
      color = 'bg-orange-500';
    } else if (score <= 3) {
      label = 'Fair';
      color = 'bg-yellow-500';
    } else if (score <= 4) {
      label = 'Good';
      color = 'bg-blue-500';
    } else {
      label = 'Strong';
      color = 'bg-green-500';
    }

    setStrength({ score, label, color });
  }, [password]);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span>Password Strength</span>
        <span className="font-medium">{strength.label}</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          className={cn("h-2 rounded-full transition-colors", strength.color)}
          initial={{ width: 0 }}
          animate={{ width: `${(strength.score / 5) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      <div className="grid grid-cols-5 gap-1 text-xs">
        {[
          { label: 'Length', met: password.length >= 8 },
          { label: 'Lowercase', met: /[a-z]/.test(password) },
          { label: 'Uppercase', met: /[A-Z]/.test(password) },
          { label: 'Numbers', met: /\d/.test(password) },
          { label: 'Symbols', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) }
        ].map((check, index) => (
          <div key={index} className="text-center">
            <div className={cn(
              "w-2 h-2 rounded-full mx-auto mb-1",
              check.met ? "bg-green-500" : "bg-gray-300"
            )} />
            <span className={cn(
              "text-xs",
              check.met ? "text-green-600" : "text-gray-500"
            )}>
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Secure input component
interface SecureInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  showPasswordToggle?: boolean;
  validationRules?: ValidationRule[];
  showValidation?: boolean;
}

export function SecureInput({
  showPasswordToggle = false,
  validationRules = [],
  showValidation = true,
  type,
  className = '',
  ...props
}: SecureInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [value, setValue] = useState(props.value as string || '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    props.onChange?.(e);
  };

  const inputType = showPasswordToggle && type === 'password' 
    ? (showPassword ? 'text' : 'password')
    : type;

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          {...props}
          type={inputType}
          value={value}
          onChange={handleChange}
          className={cn(
            "w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring",
            className
          )}
        />
        
        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
      
      {validationRules.length > 0 && (
        <InputValidation
          value={value}
          rules={validationRules}
          showValidation={showValidation}
        />
      )}
    </div>
  );
}

// Common validation rules
export const ValidationRules = {
  required: (message: string = 'This field is required'): ValidationRule => ({
    test: (value: string) => value.trim().length > 0,
    message,
    type: 'error'
  }),

  minLength: (min: number, message?: string): ValidationRule => ({
    test: (value: string) => value.length >= min,
    message: message || `Must be at least ${min} characters long`,
    type: 'error'
  }),

  maxLength: (max: number, message?: string): ValidationRule => ({
    test: (value: string) => value.length <= max,
    message: message || `Must be no more than ${max} characters long`,
    type: 'error'
  }),

  email: (message: string = 'Please enter a valid email address'): ValidationRule => ({
    test: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message,
    type: 'error'
  }),

  phone: (message: string = 'Please enter a valid phone number'): ValidationRule => ({
    test: (value: string) => /^\+?[\d\s\-\(\)]{10,}$/.test(value),
    message,
    type: 'error'
  }),

  password: (message: string = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'): ValidationRule => ({
    test: (value: string) => {
      return value.length >= 8 &&
             /[A-Z]/.test(value) &&
             /[a-z]/.test(value) &&
             /\d/.test(value) &&
             /[!@#$%^&*(),.?":{}|<>]/.test(value);
    },
    message,
    type: 'error'
  }),

  confirmPassword: (originalPassword: string, message: string = 'Passwords do not match'): ValidationRule => ({
    test: (value: string) => value === originalPassword,
    message,
    type: 'error'
  }),

  noSpaces: (message: string = 'Spaces are not allowed'): ValidationRule => ({
    test: (value: string) => !/\s/.test(value),
    message,
    type: 'error'
  }),

  alphanumeric: (message: string = 'Only letters and numbers are allowed'): ValidationRule => ({
    test: (value: string) => /^[a-zA-Z0-9]+$/.test(value),
    message,
    type: 'error'
  }),

  url: (message: string = 'Please enter a valid URL'): ValidationRule => ({
    test: (value: string) => {
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    message,
    type: 'error'
  }),

  number: (message: string = 'Please enter a valid number'): ValidationRule => ({
    test: (value: string) => !isNaN(Number(value)) && isFinite(Number(value)),
    message,
    type: 'error'
  }),

  positiveNumber: (message: string = 'Please enter a positive number'): ValidationRule => ({
    test: (value: string) => {
      const num = Number(value);
      return !isNaN(num) && isFinite(num) && num > 0;
    },
    message,
    type: 'error'
  }),

  integer: (message: string = 'Please enter a whole number'): ValidationRule => ({
    test: (value: string) => Number.isInteger(Number(value)),
    message,
    type: 'error'
  }),

  noSpecialChars: (message: string = 'Special characters are not allowed'): ValidationRule => ({
    test: (value: string) => /^[a-zA-Z0-9\s]+$/.test(value),
    message,
    type: 'error'
  }),

  startsWithLetter: (message: string = 'Must start with a letter'): ValidationRule => ({
    test: (value: string) => /^[a-zA-Z]/.test(value),
    message,
    type: 'error'
  }),

  noConsecutiveSpaces: (message: string = 'Consecutive spaces are not allowed'): ValidationRule => ({
    test: (value: string) => !/\s{2,}/.test(value),
    message,
    type: 'warning'
  }),

  noLeadingTrailingSpaces: (message: string = 'Leading and trailing spaces are not allowed'): ValidationRule => ({
    test: (value: string) => value === value.trim(),
    message,
    type: 'warning'
  })
};

// Form validation hook
export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationSchema: Record<keyof T, ValidationRule[]>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string[]>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const validateField = (field: keyof T, value: any) => {
    const rules = validationSchema[field] || [];
    const fieldErrors: string[] = [];

    rules.forEach(rule => {
      if (!rule.test(String(value))) {
        fieldErrors.push(rule.message);
      }
    });

    return fieldErrors;
  };

  const validateAll = () => {
    const newErrors: Partial<Record<keyof T, string[]>> = {};

    Object.keys(validationSchema).forEach(field => {
      const fieldErrors = validateField(field as keyof T, values[field as keyof T]);
      if (fieldErrors.length > 0) {
        newErrors[field as keyof T] = fieldErrors;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const setValue = (field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    // Validate field if it's been touched
    if (touched[field]) {
      const fieldErrors = validateField(field, value);
      setErrors(prev => ({
        ...prev,
        [field]: fieldErrors.length > 0 ? fieldErrors : undefined
      }));
    }
  };

  const setFieldTouched = (field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Validate field when touched
    const fieldErrors = validateField(field, values[field]);
    setErrors(prev => ({
      ...prev,
      [field]: fieldErrors.length > 0 ? fieldErrors : undefined
    }));
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  const isValid = Object.keys(errors).length === 0;

  return {
    values,
    errors,
    touched,
    isValid,
    setValue,
    setFieldTouched,
    validateAll,
    reset
  };
}
