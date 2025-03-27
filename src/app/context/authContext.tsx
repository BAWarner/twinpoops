import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType } from '../types/auth.types';

const AuthContext = createContext<AuthContextType | undefined>( undefined );

export const AuthProvider: React.FC<{children: ReactNode}> = ({children}) => {

    const [user, setUser] = useState<{name: string} | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if( storedUser ) setUser( JSON.parse(storedUser) );
    }, []);

    const login = ( username: string ) => {
        const newUser = {name: username};
        setUser( newUser );
        localStorage.setItem('user', JSON.stringify(newUser));
    }

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    }

    return <AuthContext.Provider value={{ user, login, logout }}>
        {children}
    </AuthContext.Provider>
}

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if( !context ) throw new Error( 'useAuth must be used within an AuthProvider' )
    return context;
}
