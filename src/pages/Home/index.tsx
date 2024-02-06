import { useState } from 'react';
import './home.scss';


import { db } from '../../services/firebaseConnection';
import { getDoc, doc } from 'firebase/firestore';

import { GiQueenCrown } from "react-icons/gi";

import { FiSettings } from 'react-icons/fi';

import { EditProfile } from '../../components/EditProfile';

import { ThreadsProps, UserProps } from '../../types/Card.type';

import { RoomCard } from '../../components/RoomCard';
import { ChatMessages } from '../../components/ChatMessages';


import { toast } from 'react-toastify';

import defaultAvatar from '../../assets/images/avatar.jpg';

export function Home() {
    const [ProfileModalVisible, setProfileModalVisible] = useState<boolean>(false);

    const [idRoom, setIdRoom] = useState<string>('');
    const [threads, setThreads] = useState<ThreadsProps>();
    const [userInfo, setUserInfo] = useState<UserProps>();


    async function handleChatRoom(data: ThreadsProps) {
        if (data) {

            try {

                setIdRoom(data?.idRoom);

                await getDoc(doc(db, 'users', data?.owner))
                    .then((snapshot) => {

                        let list: UserProps = {
                            name: snapshot.data()?.name,
                            image: snapshot.data()?.image,
                            uid: data?.owner
                        }

                        setUserInfo(list);
                        setThreads(data);

                    })
                    .catch(() => {
                        toast.error(`Erro ao buscar sala, tente novamente!`, { theme: 'dark' });
                    })

            } catch (err) {
                toast.error(`Erro ao buscar sala, tente novamente!`, { theme: 'dark' });
            }
        }
    }

    return (
        <div className='container'>

            {/* Editar perfil  */}
            <label className='nav-settings'>
                <button onClick={() => setProfileModalVisible(!ProfileModalVisible)}
                >
                    <FiSettings size={30} color='#fff' />
                </button>
            </label>

            {/* Mostrar salas */}
            <RoomCard changeId={(id) => handleChatRoom(id)} />


            {/* Chat */}
            <ChatMessages id={idRoom} />

            {/* Mostrar grupo ao lado */}
            {threads && userInfo &&
                <section className='info-box'>
                    <div className='img-area'>
                        <img src={threads.roomImage} />
                    </div>

                    <div className='profile-name'>
                        <h1>{threads.roomName}</h1>
                    </div>

                    <div className='profile-icon'>
                        <GiQueenCrown size={25} color='yellow' />
                        <p>Criador do Grupo</p>
                    </div>

                    <div className='profile-creator'>
                        <img src={userInfo?.image === '' ? defaultAvatar : userInfo?.image} />
                        <div>
                            <h2>{userInfo?.name}</h2>
                        </div>
                    </div>
                </section>
            }

            <EditProfile isOpen={ProfileModalVisible} changeVisibility={() => setProfileModalVisible(!ProfileModalVisible)} />
        </div>
    )
}

