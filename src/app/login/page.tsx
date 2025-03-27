import LoginForm from "../Components/LoginForm";
import styles from '../styles/login.module.css';

const Login = () => {
    return (
        <div className={styles.loginLanding}>
            <LoginForm />
        </div>
    );
}

export default Login;