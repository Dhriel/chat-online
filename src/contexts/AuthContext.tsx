import {useState, ReactNode, createContext} from 'react';


type AuthProviderProps = {
    children: ReactNode
}

type AuthContextData = {
    user: UserProps | null;
    signed: boolean;
}

interface UserProps {
    id: string;
    email: string | null;
    uid: string | null;
}

export const AuthContext = createContext({} as AuthContextData);

export default function AuthProvider({children}: AuthProviderProps){
    const [user, setUser] = useState<UserProps | null>(null);

    function signUp(){

    }
    
    return(
        <AuthContext.Provider
            value={{
                user,
                signed: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}