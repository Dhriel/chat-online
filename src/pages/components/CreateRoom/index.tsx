import {ChangeEvent, useContext, useRef, useState} from 'react';
import { AuthContext } from '../../../contexts/AuthContext';

import {db, storage} from '../../../services/firebaseConnection';
import {collection, addDoc} from 'firebase/firestore';
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage';

import './createroom.scss';

import {FiUpload, FiX} from 'react-icons/fi';
import { toast } from 'react-toastify';

import loadImage from '../../../assets/images/load.svg';


interface RoomProps {
    isOpen: boolean;
    changeVisibility: () => void;
}

export  function CreateRoom({isOpen, changeVisibility} : RoomProps) {
    const {signed, user} = useContext(AuthContext);
    const roomRef = useRef<HTMLInputElement | null>(null);

    const [imageAvatar,setImageAvatar] = useState<File | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);



    async function handleSubmit(){
        if(!signed) {
            toast.error('Você precisar estar logado para criar uma sala!', {theme: 'dark'});
            return;
        } else if(roomRef.current?.value === ''){
            toast.error('O grupo precisa de um nome', {theme: 'dark'});
            return;
        }else if(!avatarUrl){
            toast.error('Adicione uma imagem ao grupo!', {theme: 'dark'});
            return;
        }

        setLoading(true);
        await handleUpload();
        setImageAvatar(null);
        setAvatarUrl(null);
        setLoading(false);
        changeVisibility()
        
    }


    async function handleCreate(url: string){

        try{

            const currentDate = new Date();
            const formattedDate = currentDate.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
            }); 

             

            const docRef =  await addDoc(collection(db, 'rooms'), {
                createdAt: formattedDate,
                roomImage: url,
                roomName: roomRef.current?.value,
                owner: user?.uid,
            })
            
            await addDoc(collection(docRef, 'messages'), {
                createdAt: new Date().toLocaleDateString(),
                name: 'Sytem',
                text: 'Seja bem-vindo!'
            })


        }catch(error){
            toast.error('Erro ao criar sala', {theme: 'dark'});
            setLoading(false);
        }

    }

    function handleFile(e : ChangeEvent<HTMLInputElement>){
        if(e.target.files && e.target.files[0] ){
            const image = e.target.files[0];
            
            try{

                setImageAvatar(image);
                setAvatarUrl(URL.createObjectURL(image));

            }catch(err){
                toast.error('Formato de imagem inválido', {theme: 'dark'});
            }
        }
    }

    async function handleUpload(){
        if(imageAvatar){

            try{
                const uploadRef = ref(storage, `rooms/${roomRef.current?.value}`);
                const snapshot = await uploadBytes(uploadRef, imageAvatar);
                await getDownloadURL(snapshot.ref).then(async (donwloadUrl)=>{
                    let urlFoto = donwloadUrl;
                    await handleCreate(urlFoto);
                })
            }catch(err){
                toast.error('Erro ao criar sala', {theme: 'dark'});
                setLoading(false);
            }
           
        }

    }


    if (isOpen){
    return (
        <div className='modal-container'>
                <div className='modal'>
                    <button className='x-btn'
                        onClick={changeVisibility}
                    ><FiX size={20} color='#ffff'/></button>
                    <label>
                        <span><FiUpload size={30} color='#ffff'/></span>
                        <input type='file' accept='image/*' onChange={handleFile} className='input-file'/>

                        {
                                avatarUrl === null ? (
                                        <div style={{width: 125, height: 125, backgroundColor: "#000000", borderRadius: 65}}></div>   

                                    ) : (
                                        <img src={avatarUrl} alt='Foto do grupo'/>
                                    
                                        )
                                    }

                    </label>
                    
                    <p>Nome do grupo</p>
                    <input
                        type='text'
                        placeholder='Digite algum nome'
                        className='input'
                        ref={roomRef}
                    />

                    { loading ? (
                         <div className='load-area'>
                            <img src={loadImage} alt='carregando' />
                        </div>
                    ) : (
                        <button className='create-btn' onClick={handleSubmit}>
                            Criar Grupo
                        </button>
                    )}


                </div>
                
        </div>
    );
    }else{
        return <></>
    }
}