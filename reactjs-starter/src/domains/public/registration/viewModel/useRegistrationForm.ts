import { useState } from 'react';
import { registerUser } from '../api/registrationApi';
import { RegistrationRequest } from '../model/Registration';
import { useNavigate } from 'react-router-dom';

export const useRegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'MEMBER' as 'MEMBER' | 'ADMIN',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const payload: RegistrationRequest = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
      };
      await registerUser(payload);
      setIsSuccess(true);
      alert('Registration successful!');
      navigate('/login');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Registration failed';
      setErrors({ form: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return { formData, errors, isLoading, isSuccess, handleChange, handleSubmit };
};
