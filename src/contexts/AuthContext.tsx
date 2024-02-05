import {useState, ReactNode, createContext, useEffect} from 'react';

import { auth, db } from '../services/firebaseConnection';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signOut, onAuthStateChanged, User} from 'firebase/auth';
import {setDoc, doc, getDoc} from 'firebase/firestore';

import { toast } from 'react-toastify';

import { useNavigate } from 'react-router-dom';

import {UserProps} from './../pages/types/Card.type';

interface AuthProviderProps  {
    children: ReactNode
}

type AuthContextData = {
    user: UserProps | null;
    signed: boolean;
    loadingAuth: boolean;
    setUser: (user: UserProps) => void;
    signUp: (email:string, password:string, name:string) => void;
    signIn: (email:string, password:string) => void;
    logOut: () => void;
}


export const AuthContext = createContext({} as AuthContextData);

export default function AuthProvider({children}: AuthProviderProps){

    const [user, setUser] = useState<UserProps | null>(null);
    const [loadingAuth, setLoadingAuth] = useState<boolean>(false);

    const navigate = useNavigate();

    useEffect(()=>{
        async function loadUser(){
            onAuthStateChanged(auth, (user) =>{
                if(user){

                    let uid = user.uid;

                    const docRef = doc(db, 'user', uid);
                    getDoc(docRef)
                    .then((snapshot)=>{

                        let data : UserProps = {
                            uid,
                            name: snapshot.data()?.name,
                            image: snapshot.data()?.image,
                        }

                        setUser(data);
                    }).catch((err) =>{
                        setUser(null);
                    })

                }else{
                    setUser(null);
                }
            })

        }

        loadUser();

    }, []);


    // Cadastrar
    async function signUp(email: string, password: string, name = ''){
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
            setLoadingAuth(false)
            navigate('/', {replace: true});
        })
        .catch(error => {
            setLoadingAuth(false);
            let message = error.code;
                switch (message){
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
            
                toast.error(`${message}`, {theme: 'dark'});
        })
    }
    
    // Logar 
    async function signIn(email: string, password: string) : Promise<void> {
        setLoadingAuth(true);

        signInWithEmailAndPassword(auth, email, password)
        .then(async (value) =>{
            let uid = value.user.uid;
            let name =  value.user.displayName;

            const docRef = doc(db, 'users', uid);
            const docSnap = await getDoc(docRef)

            let data = {
                name: name || '',
                image: docSnap.data()?.image,
                uid: uid
            }

            setUser(data);
            setLoadingAuth(false);
            navigate('/', {replace: true});

        })
        .catch(() => {
            toast.error(`E-mail ou senha incorretos! Verifique novamente!`, {theme: 'dark'});
            setLoadingAuth(false);
        })
    }

    // Permanecer Logado

        // Deslogar
    async function logOut(){
        await signOut(auth);
        setUser(null);
        navigate('/login', {replace: true});
        toast.success('Usuário Deslogado', {theme: 'dark'});

    }

    return(
        <AuthContext.Provider
            value={{
                user,
                signed: !!user,
                loadingAuth,
                signUp,
                signIn,
                logOut,
                setUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}