import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import InputField from '../components/form/InputField';
import AuthLayout from '../components/layouts/AuthLayout';
import { validateEmail } from '../utils/validators';
import { useToast } from '../hooks/useToast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loadingS, setLoadingS] = useState(false);

  const { login, loading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
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
    
    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Ingrese un email válido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoadingS(true);
      await login(formData.email, formData.password);
      showToast('¡Bienvenido de nuevo!', 'success');
      navigate('/dashboard');
    } catch (error) {
      const serverMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Error al iniciar sesión';
      setErrors(prev => ({ ...prev, session: serverMessage }));
      showToast(serverMessage, 'error');
    } finally {
      setLoadingS(false);
    }
  };

  return (
    <AuthLayout title="Iniciar Sesión">
      <form onSubmit={handleSubmit} className="space-y-6">
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
          label="Contraseña"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="********"
          required
        />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
          </div>
          
          <div className="text-sm">
            <Link to="/forgot-password" className="font-medium text-primary hover:text-primary-dark">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>
        
        {errors.session && <p  className="text-red-500 text-sm text-center mt-2">{errors.session}</p>}
        <Button
          type="submit"
          className="font-medium text-primary hover:text-primary-dark"
          variant='secondary'
          fullWidth
          loading={loadingS}
        >
          Iniciar Sesión
        </Button>
        <div className="text-center text-sm">
          ¿No tienes una cuenta?{' '}
          <Link to="/register" className="font-medium text-primary hover:text-primary-dark">
            Regístrate
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;
