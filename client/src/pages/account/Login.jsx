import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useCustomerAuth } from '../../context/CustomerAuthContext.jsx';
import Container from '../../components/common/Container.jsx';
import Section from '../../components/common/Section.jsx';
import styles from './AuthPages.module.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useCustomerAuth();
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    const success = await login(data);
    setLoading(false);
    if (success) {
      navigate('/account');
    }
  };

  return (
    <div className={styles.page}>
      <Section spacing="large">
        <Container width="narrow">
          <div className={styles.authBox}>
            <h1 className={styles.title}>Welcome Back</h1>
            <p className={styles.subtitle}>Sign in to access your account.</p>

            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Email Address</label>
                <input 
                  type="email" 
                  {...register('email', { required: 'Email is required' })}
                  className={errors.email ? styles.inputError : ''}
                />
                {errors.email && <span className={styles.errorText}>{errors.email.message}</span>}
              </div>

              <div className={styles.formGroup}>
                <label>Password</label>
                <input 
                  type="password" 
                  {...register('password', { required: 'Password is required' })}
                  className={errors.password ? styles.inputError : ''}
                />
                {errors.password && <span className={styles.errorText}>{errors.password.message}</span>}
              </div>

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className={styles.footerText}>
              Don't have an account? <Link to="/account/register">Create one</Link>
            </p>
          </div>
        </Container>
      </Section>
    </div>
  );
}
