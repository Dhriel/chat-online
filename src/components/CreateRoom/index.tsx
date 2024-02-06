import { ChangeEvent, useContext, useRef, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

import { db, storage } from '../../services/firebaseConnection';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import './createroom.scss';

import { FiUpload, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';

import imageCompression from 'browser-image-compression';

import loadImage from './../../assets/images/load.svg';


interface RoomProps {
    isOpen: boolean;
    refresh: () => void;
    changeVisibility: () => void;
}

export function CreateRoom({ isOpen, changeVisibility, refresh }: RoomProps) {
    const { signed, user } = useContext(AuthContext);
    const roomRef = useRef<HTMLInputElement | null>(null);

    const [imageAvatar, setImageAvatar] = useState<File | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);



    async function handleSubmit() {
        if (!signed) {
            toast.error('Você precisar estar logado para criar uma sala!', { theme: 'dark' });
            return;
        } else if (roomRef.current?.value === '') {
            toast.error('O grupo precisa de um nome', { theme: 'dark' });
            return;
        } else if (!avatarUrl) {
            toast.error('Adicione uma imagem ao grupo!', { theme: 'dark' });
            return;
        }

        setLoading(true);
        await handleUpload();
        setImageAvatar(null);
        setAvatarUrl(null);
        setLoading(false);
        refresh();
        changeVisibility();

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
                toast.error('Erro ao criar sala, tente novamente!', { theme: 'dark' });

            }
        }
    }


    async function handleUpload() {
        if (imageAvatar) {

            try {
                const uploadRef = ref(storage, `rooms/${roomRef.current?.value}`);
                const snapshot = await uploadBytes(uploadRef, imageAvatar);
                await getDownloadURL(snapshot.ref).then(async (donwloadUrl) => {
                    let urlFoto = donwloadUrl;
                    await handleCreate(urlFoto);
                });
            } catch (err) {
                toast.error('Erro ao criar sala', { theme: 'dark' });
                setLoading(false);
            }

        }

    };

    async function handleCreate(url: string) {

        try {

            let formatedDate = getDate();


            const docRef = await addDoc(collection(db, 'rooms'), {
                createdAt: new Date(),
                roomImage: url,
                roomName: roomRef.current?.value,
                owner: user?.uid,
            })

            await addDoc(collection(docRef, 'messages'), {
                createdAt: new Date(),
                name: 'Sytem',
                text: 'Seja bem-vindo!',
                dateHour: formatedDate
            }).then(() => {
                toast.success('Grupo criado com sucesso!', { theme: 'dark' });
            })


        } catch (error) {
            toast.error('Erro ao criar sala', { theme: 'dark' });
            setLoading(false);
        }

    }

    function getDate(): string {
        let date = new Date();

        let formatedDate = [
            ("0" + date.getDate()).slice(-2),
            ("0" + (date.getMonth() + 1)).slice(-2),
            date.getFullYear().toString().slice(-2)
        ].join('/') + " " +
            ("0" + date.getHours()).slice(-2) +
            ":" +
            ("0" + date.getMinutes()).slice(-2);

        return formatedDate;
    }


    if (isOpen) {
        return (
            <div className='modal-container'>
                <div className='modal'>
                    <button className='x-btn'
                        onClick={changeVisibility}
                    ><FiX size={20} color='#ffff' /></button>
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

                    <p>Nome do grupo</p>
                    <input
                        type='text'
                        placeholder='Digite algum nome'
                        className='input'
                        ref={roomRef}
                    />

                    {loading ? (
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
    } else {
        return <></>
    }
}