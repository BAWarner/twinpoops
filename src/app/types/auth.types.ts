export interface AuthContextType{
    user: { name: string } | null;
    login: ( username: string ) => void;
    logout: () => void;
}