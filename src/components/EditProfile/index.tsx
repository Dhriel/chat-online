import { ChangeEvent, useContext, useState } from 'react';
import { AuthContext } from './../../contexts/AuthContext';

import { db, storage } from './../../services/firebaseConnection';
import { doc, updateDoc} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, } from 'firebase/storage';

import './../CreateRoom/createroom.scss'

import { FiUpload, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';

import loadImage from './../../assets/images/load.svg';

import { UserProps } from '../../types/Card.type';
import { Link } from 'react-router-dom';

import imageCompression from 'browser-image-compression';




interface RoomProps {
    isOpen: boolean;
    changeVisibility: () => void;
}

export function EditProfile({ isOpen, changeVisibility }: RoomProps) {
    const { signed, user, setUser, logOut, storageUser } = useContext(AuthContext);

    const [imageAvatar, setImageAvatar] = useState<File | null>(null);
    const [nameInput, setNameInput] = useState<string>(user && user?.name || '');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);



    async function handleSubmit() {
        if (!signed) {
            toast.error('Você precisar estar logado para editar seu perfil!', { theme: 'dark' });
            return;
        } else if (nameInput.length < 3) {
            toast.error('Seu nome precisa ter pelo menos 3 caracteries. ', { theme: 'dark' });
            return;
        } else if (!avatarUrl) {
            toast.error('Adicione uma imagem ao seu perfil!', { theme: 'dark' });
            return;
        }

        setLoading(true);
        await handleUpload();
        setImageAvatar(null);
        setAvatarUrl(null);
        setLoading(false);
        changeVisibility();
        toast.success('Perfil atualizado com sucesso!', { theme: 'dark' });

    }

    async function handleFile(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
            const originalImage = e.target.files[0];

            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
                useWebWorker: true
            };

            try {
                const compressedImage = await imageCompression(originalImage, options);

                setImageAvatar(compressedImage);
                setAvatarUrl(URL.createObjectURL(compressedImage));
            } catch (err) {
                toast.error('Erro ao atualizar perfil, tente novamente!', { theme: 'dark' });


            }
        }
    }

    async function handleUpload() {
        try {

            if (imageAvatar && user && user.uid) {

                const currentUid = user.uid;
                const uploadRef = ref(storage, `users/${currentUid}`);
                const snapshot = await uploadBytes(uploadRef, imageAvatar);

                const downloadUrl = await getDownloadURL(snapshot.ref);

                const docRef = doc(db, 'users', currentUid);

                await updateDoc(docRef, {
                    name: nameInput,
                    image: downloadUrl,
                    uid: currentUid,
                })
                    .then(async () => {

                        let data: UserProps = {
                            name: nameInput,
                            image: downloadUrl,
                            uid: currentUid,
                        };

                        setUser(data);
                        storageUser(data);
                    })

            } else {
                toast.error('Erro ao atualizar Perfil do usuário', { theme: 'dark' });
            }

        } catch (err) {
            toast.error('Erro ao atualizar Perfil do usuário', { theme: 'dark' });
        }

    }



    if (isOpen) {
        return (
            <div className='modal-container'>
                <div className='modal'>
                    <button className='x-btn'
                        onClick={changeVisibility}
                    ><FiX size={20} color='#ffff' /></button>

                    {signed ?
                        <>
                            <label>
                                <span><FiUpload size={30} color='#ffff' /></span>
                                <input type='file' accept='image/*' onChange={handleFile} className='input-file' />

                                {
                                    avatarUrl === null ? (
                                        <div style={{ width: 125, height: 125, backgroundColor: "#000000", borderRadius: 65 }}></div>

                                    ) : (
                                        <img src={avatarUrl} alt='Foto do grupo' />
                                    )
                                }

                            </label>

                            <p>Nome</p>
                            <input
                                type='text'
                                placeholder='Altere seu nome'
                                className='input'
                                value={nameInput}
                                onChange={(e) => setNameInput(e.target.value)}
                                maxLength={20}
                            />

                            <div className='btn-area'>
                                {loading ? (
                                    <div className='create-btn'>
                                        <img src={loadImage} alt='carregando' />
                                    </div>
                                ) : (
                                    <button className='create-btn' onClick={handleSubmit}>
                                        Salvar Perfil
                                    </button>
                                )}

                                <button className='create-btn' onClick={logOut}
                                    style={{ backgroundColor: 'red' }}
                                >
                                    Sair da conta
                                </button>
                            </div>
                        </>
                        :

                        <div className='login-area'>
                            <Link to='/login'>
                                Fazer Login
                            </Link>
                        </div>

                    }

                </div>

            </div>
        );
    } else {
        return <></>
    }
}