import { useState, ReactNode, createContext, useEffect } from 'react';

import { auth, db } from '../services/firebaseConnection';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth';
import { setDoc, doc, getDoc } from 'firebase/firestore';

import { toast } from 'react-toastify';

import { useNavigate } from 'react-router-dom';

import { UserProps } from '../types/Card.type';

interface AuthProviderProps {
    children: ReactNode
}

type AuthContextData = {
    user: UserProps | null;
    signed: boolean;
    loadingAuth: boolean;
    setUser: (user: UserProps) => void;
    storageUser: (data: UserProps) => void;
    signUp: (email: string, password: string, name: string) => void;
    signIn: (email: string, password: string) => void;
    logOut: () => void;
}


export const AuthContext = createContext({} as AuthContextData);

export default function AuthProvider({ children }: AuthProviderProps) {

    const [user, setUser] = useState<UserProps | null>(null);
    const [loadingAuth, setLoadingAuth] = useState<boolean>(false);

    const navigate = useNavigate();

    useEffect(() => {
        async function loadUser() {

            const storageUser = localStorage.getItem('@userData');
            if (storageUser) {
                setUser(JSON.parse(storageUser));
            } else {
                setUser(null);
            }
        }

        loadUser();

    }, []);


    // Cadastrar
    async function signUp(email: string, password: string, name = '') {
        setLoadingAuth(true);

        createUserWithEmailAndPassword(auth, email, password)
            .then(async (value) => {
                let uid = value.user.uid;

                await updateProfile(value.user, { displayName: name });

                let data = {
                    name: name || '',
                    uid: uid,
                    image: '',
                }

                await setDoc(doc(db, 'users', uid), data)
                setUser(data);
                storageUser(data);
                setLoadingAuth(false)
                navigate('/', { replace: true });
            })
            .catch(error => {
                setLoadingAuth(false);
                let message = error.code;
                switch (message) {
                    case "auth/email-already-exists":
                        message = 'Este e-mail já pertence a um usuário'
                        break;
                    case "auth/invalid-email":
                        message = 'Digite um e-mail válido!';
                        break;
                    case "auth/user-disabled":
                        message = 'A conta deste usuário foi desativada pelo administrador';
                        break;
                    case "auth/wrong-password":
                        message = 'Senha incorreta';
                        break;
                    case "auth/email-already-in-use":
                        message = 'Endereço de e-mail já está em uso, tente outro.';
                        break;
                    case "auth/weak-password":
                        message = 'Senha muito fraca, tente criar uma mais forte';
                        break;
                    case "auth/too-many-requests":
                        message = 'Muitos usuários ativos no momento, espere um tempo e tente novamente';
                        break;
                    case "auth/invalid-login-credentials":
                        message = 'Credenciais de login inválidas. Verifique seu e-mail e senha.';
                        break;
                }

                toast.error(`${message}`, { theme: 'dark' });
            })
    }

    // Logar 
    async function signIn(email: string, password: string): Promise<void> {
        setLoadingAuth(true);

        signInWithEmailAndPassword(auth, email, password)
            .then(async (value) => {
                let uid = value.user.uid;
                let name = value.user.displayName;

                const docRef = doc(db, 'users', uid);
                const docSnap = await getDoc(docRef)

                let data = {
                    name: name || '',
                    image: docSnap.data()?.image,
                    uid: uid
                }

                setUser(data);
                storageUser(data);
                setLoadingAuth(false);
                navigate('/', { replace: true });

            })
            .catch(() => {
                toast.error(`E-mail ou senha incorretos! Verifique novamente!`, { theme: 'dark' });
                setLoadingAuth(false);
            })
    }

    // Permanecer Logado

    async function storageUser(data: UserProps) {
        localStorage.setItem('@userData', JSON.stringify(data));
    }

    // Deslogar
    async function logOut() {
        await signOut(auth);
        setUser(null);
        localStorage.removeItem('@userData');
        navigate('/login', { replace: true });
        toast.success('Usuário Deslogado', { theme: 'dark' });

    }

    return (
        <AuthContext.Provider
            value={{
                user,
                signed: !!user,
                loadingAuth,
                signUp,
                signIn,
                logOut,
                setUser,
                storageUser
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}