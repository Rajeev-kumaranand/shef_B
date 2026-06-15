import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useCustomerAuth } from '../../context/CustomerAuthContext.jsx';
import Container from '../../components/common/Container.jsx';
import Section from '../../components/common/Section.jsx';
import styles from './AuthPages.module.css';

export default function Register() {
  const navigate = useNavigate();
  const { register: registerCustomer } = useCustomerAuth();
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    const success = await registerCustomer(data);
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
            <h1 className={styles.title}>Create Account</h1>
            <p className={styles.subtitle}>Join shef&B for an exclusive experience.</p>

            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Full Name</label>
                <input 
                  type="text" 
                  {...register('name', { required: 'Name is required' })}
                  className={errors.name ? styles.inputError : ''}
                />
                {errors.name && <span className={styles.errorText}>{errors.name.message}</span>}
              </div>

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
                <label>Phone Number (Optional)</label>
                <input 
                  type="tel" 
                  {...register('phone')}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Password</label>
                <input 
                  type="password" 
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                  })}
                  className={errors.password ? styles.inputError : ''}
                />
                {errors.password && <span className={styles.errorText}>{errors.password.message}</span>}
              </div>

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <p className={styles.footerText}>
              Already have an account? <Link to="/account/login">Sign in</Link>
            </p>
          </div>
        </Container>
      </Section>
    </div>
  );
}
