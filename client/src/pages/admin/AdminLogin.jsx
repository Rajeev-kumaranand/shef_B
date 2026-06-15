import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import styles from './AdminLogin.module.css';
import AdminCard from '../../components/admin/AdminCard.jsx';
import AdminFormField from '../../components/admin/AdminFormField.jsx';

export default function AdminLogin() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const success = await login(data);
    if (success) {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <div className={styles.logo}>shef&B CMS</div>
        <AdminCard>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.fieldWrapper}>
              <AdminFormField 
                label="Email" 
                type="email" 
                {...register('email', { required: 'Email is required' })} 
              />
              {errors.email && <span className={styles.error}>{errors.email.message}</span>}
            </div>
            <div className={styles.fieldWrapper}>
              <AdminFormField 
                label="Password" 
                type="password" 
                {...register('password', { required: 'Password is required' })} 
              />
              {errors.password && <span className={styles.error}>{errors.password.message}</span>}
            </div>
            <button type="submit" className={styles.loginBtn} disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Sign In'}
            </button>
          </form>
        </AdminCard>
      </div>
    </div>
  );
}
