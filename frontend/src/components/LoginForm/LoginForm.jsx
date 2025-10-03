import React, {useState, useEffect} from 'react';
import styles from './LoginForm.module.css';
import Phones from '../../assets/images/phone.png';
import Logo from '../../assets/images/postswap.png';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/slices/authSlice';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user } = useSelector(
    (state) => state.auth
  );
  const [form, setForm] = useState({
      
      email: '',
      password: '',
    });
  
    const handleLogin = (e) => {
      e.preventDefault();
      dispatch(loginUser(form));
    };

    useEffect(() => {
    if (isAuthenticated && user?._id) {
      navigate(`/profile/${user._id}`);
    }
  }, [isAuthenticated, user, navigate]);
 

  return (
    <div className={styles.wrapper}>
      <div className={styles.phones}>
        <img src={Phones} alt="Phones" />
      </div>
      <div className={styles.authForm}>
        <div className={styles.containerOne}>
          <img className={styles.logo} src={Logo} alt="LogoApp" />

          <form className={styles.form} onSubmit={handleLogin}>
            <div className={styles.inputField}>
              <input
                className={styles.input}
                type="text"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Username or email"
              />
              <input
                className={styles.input}
                type="password"
                value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Password"
              />
            </div>
            <button className={styles.button} type='submit' disabled={loading}>Log in</button>
            <ErrorMessage error={error}/>
            <div className={styles.or}>
              <div className={styles.line}></div>
              <span style={{ padding: '0 10px' }}>Or</span>
              <div className={styles.line}></div>
            </div>
            <Link
              className={styles.link}
              to='/reset'
            >
              Forgot password?
            </Link>
          </form>
        </div>
        <div className={styles.containerTwo}>
          <p className={styles.parTwo}>
            Don't have an account?{' '}
            <Link style={{ color: 'rgba(0, 149, 246, 1)' }} to='/register'>
              Sing up
            </Link>{' '}
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
