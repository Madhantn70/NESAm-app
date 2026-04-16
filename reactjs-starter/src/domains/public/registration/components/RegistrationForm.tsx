import React from 'react';

type RegistrationFormProps = {
  formData: any;
  errors: Record<string, string>;
  isLoading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
};

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  formData,
  errors,
  isLoading,
  handleChange,
  handleSubmit
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Register</h2>
      
      {errors.form && <div className="text-red-500 mb-2">{errors.form}</div>}
      
      <div>
        <label className="block mb-1">Name</label>
        <input 
          type="text" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          className="w-full border p-2 rounded" 
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>
      
      <div>
        <label className="block mb-1">Email</label>
        <input 
          type="email" 
          name="email" 
          value={formData.email} 
          onChange={handleChange} 
          className="w-full border p-2 rounded" 
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block mb-1">Phone</label>
        <input 
          type="text" 
          name="phone" 
          value={formData.phone} 
          onChange={handleChange} 
          className="w-full border p-2 rounded" 
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
      </div>

      <div>
        <label className="block mb-1">Role</label>
        <select 
          name="role" 
          value={formData.role} 
          onChange={handleChange} 
          className="w-full border p-2 rounded"
        >
          <option value="MEMBER">Member</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      <div>
        <label className="block mb-1">Password</label>
        <input 
          type="password" 
          name="password" 
          value={formData.password} 
          onChange={handleChange} 
          className="w-full border p-2 rounded" 
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
      </div>

      <div>
        <label className="block mb-1">Confirm Password</label>
        <input 
          type="password" 
          name="confirmPassword" 
          value={formData.confirmPassword} 
          onChange={handleChange} 
          className="w-full border p-2 rounded" 
        />
        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
      </div>

      <button 
        type="submit" 
        disabled={isLoading} 
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isLoading ? 'Loading...' : 'Register'}
      </button>
    </form>
  );
};
