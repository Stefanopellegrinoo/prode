import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import InputField from '../components/form/InputField';
import AuthLayout from '../components/layouts/AuthLayout';
import { validateEmail, validatePassword, validateUsername } from '../utils/validators';
import { useToast } from '../hooks/useToast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const { register, loading } = useAuth();
  const { showToast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const newErrors = {};
  const validateForm = () => {
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    
    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Ingrese un email válido';
    }

        
    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    }else if(!validateUsername(formData.username)){
      newErrors.username = 'El nombre de usuario debe tener mas de 5 caracteres';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres, una letra y un número';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await register({
        name: formData.name,
        email: formData.email,
        username: formData.username,
        password: formData.password,
      });
      showToast('¡Registro exitoso!', 'success');
    } catch (error) {
      console.error('Error al registrarse:', error.response.data.error);
      newErrors.session = error.response.data.error;
      setErrors(newErrors);

      showToast(error.message || 'Error al registrarse', 'error');
    }
  };

  return (
    <AuthLayout title="Crear Cuenta">
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Nombre"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="Nombre completo"
          required
        />
        
        <InputField
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="tu@email.com"
          required
        />

        <InputField
          label="Nombre de Usuario"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
          placeholder="Nombre de usuario"
          required
        />
        
        <InputField
          label="Contraseña"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="********"
          required
        />
        
        <InputField
          label="Confirmar Contraseña"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          placeholder="********"
          required
        />
        
        <Button
        variant='secondary'
          type="submit"
          fullWidth
          loading={loading}
        >
          Registrarse
        </Button>
        {errors.session && (
          <div className="text-red-500 text-sm text-center mt-2">{errors.session}</div>
        )}
        <div className="text-center text-sm">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
            Inicia Sesión
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Register;
