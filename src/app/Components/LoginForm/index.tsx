"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import axios from 'axios';

import styles from '../../styles/login.module.css';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState('');

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try{
            axios.post('api/auth/login', {username, password}, { headers: {
                "Content-Type": 'application/json'
            } })
            .then( res => {
                router.refresh();
                router.push('/');
            } )
            .catch( err => {
                throw new Error( err || 'Login Failed' );
            } )
        }catch( err: any ){
            setError( err.message || 'An error occurred during login' );
        }
        finally{
            setLoading(false);
        }
    }

    return (
        <div className={styles.loginFormWrapper}>
            {error && (
                <div>
                    {error}
                </div>
            )}
            <div className={styles.loginForm}>
                <h2>Sign in</h2>
                <form onSubmit={ handleSubmit }>
                    <input 
                        type='text' 
                        value={username} 
                        placeholder="Username" 
                        name='username'
                        onChange={ e => setUsername(e.target.value) }
                    />
                    <input 
                        type='password'
                        value={password}
                        placeholder='Password'
                        name='password'
                        onChange={ e => setPassword(e.target.value) }
                    />
                    <button type='submit' disabled={loading}>{ loading ? 'Logging in...' : 'Login' }</button>
                </form>
            </div>
        </div>
    );
}

export default LoginForm;