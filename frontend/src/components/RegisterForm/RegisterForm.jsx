import React from 'react';
import { useState, useEffect } from 'react';
import styles from './RegisterForm.module.css';
import Logo from '../../assets/images/postswap.png';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../redux/slices/authSlice';
import ModalToLogin from '../ModalToLogin/ModalToLogin';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

function RegisterForm() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { loading, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [form, setForm] = useState({
    fullName: '',
    userName: '',
    email: '',
    password: '',
  });

  const [showModal, setShowModal] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // при вводе в поле удаляем его ошибку
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleRegister = async (e) => {
  e.preventDefault();
  setFieldErrors({});
  setGeneralError(null);

  try {
    await dispatch(registerUser(form)).unwrap();
  } catch (err) {
    if (err?.fields) setFieldErrors(err.fields);
    if (err?.general) setGeneralError(err.general);
  }
};

  useEffect(() => {
    if (isAuthenticated) {
      setShowModal(true);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    setShowModal(false);
  }, [location.pathname]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.containerOne}>
        <img className={styles.logo} src={Logo} alt="LogoApp" />
        <h3>Sign up to see photos and video from your friends.</h3>
        <form className={styles.form} onSubmit={handleRegister}>
          <div className={styles.inputField}>
            <div className={styles.inputDiv}>
              <input
                className={styles.input}
                type="email"
                value={form.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Email"
                required
              />
              <ErrorMessage error={fieldErrors.email} />
            </div>
            <div className={styles.inputDiv}>
              <input
                className={styles.input}
                type="text"
                value={form.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Full name"
                required
              />
            </div>
            <div className={styles.inputDiv}>
              <input
                className={styles.input}
                type="text"
                value={form.userName}
                onChange={(e) => handleInputChange('userName', e.target.value)}
                placeholder="UserName"
                required
              />
              <ErrorMessage error={fieldErrors.userName} />
            </div>
            <div className={styles.inputDiv}>
              <input
                className={styles.input}
                type="password"
                value={form.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Password"
                required
              />
              <ErrorMessage error={fieldErrors.password} />
            </div>
          </div>
          <div className={styles.parField}>
            <p className={styles.par}>
              People who use our service may have uploaded your contact
              information to Instagram. <a href="*">Learn More</a>
            </p>
            <p className={styles.par}>
              By signing up, you agree to our <a href="*">Terms</a>,{' '}
              <a href="*">Privacy</a>
              <a href="*">Policy</a> and <a href="*">Cookie Policy</a>
            </p>
          </div>

          <button className={styles.button} type="submit" disabled={loading}>
            Sign up
          </button>
          <ErrorMessage error={generalError} />
        </form>

        {showModal && (
          <ModalToLogin
            message="You have successfully registered! ✅"
            buttonName="Please log in to continue !"
            showLoginButton={true}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
      <div className={styles.containerTwo}>
        <p className={styles.parTwo}>
          Have an account?{' '}
          <Link style={{ color: 'rgba(0, 149, 246, 1)' }} to="/login">
            Log in
          </Link>{' '}
        </p>
      </div>
    </div>
  );
}

export default RegisterForm;
