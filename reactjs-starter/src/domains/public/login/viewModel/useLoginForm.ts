import { useState } from 'react';
import { loginUser } from '../api/authApi';
import { LoginRequest } from '../model/Auth';
import { authService } from '../../../../services/authService';
import { useNavigate } from 'react-router-dom';

export const useLoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const payload: LoginRequest = {
        email: formData.email,
        password: formData.password,
      };
      
      const response = await loginUser(payload);
      authService.saveSession(response);
      
      if (response.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/member/home');
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Login failed';
      setErrors({ form: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return { formData, errors, isLoading, handleChange, handleSubmit };
};
