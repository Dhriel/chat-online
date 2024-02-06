import { useState, useEffect } from 'react';
import './home.scss';


import { db } from '../../services/firebaseConnection';
import { getDoc, doc } from 'firebase/firestore';

import { GiQueenCrown } from "react-icons/gi";


import { ThreadsProps, UserProps } from '../../types/Card.type';

import { RoomCard } from '../../components/RoomCard';
import { ChatMessages } from '../../components/ChatMessages';


import { toast } from 'react-toastify';

import defaultAvatar from '../../assets/images/avatar.jpg';

export function Home() {

    const [idRoom, setIdRoom] = useState<string>('nCLIpMyYQJhNYGvaVJEK');

    const [threads, setThreads] = useState<ThreadsProps>();
    const [userInfo, setUserInfo] = useState<UserProps>();



    useEffect(()=>{

        async function loadRoom(){

            const docRef = doc(db, 'rooms', idRoom);
            await getDoc(docRef).then((snapshot)=>{

                let data: ThreadsProps = {

                    idRoom: snapshot.id,
                    roomName: snapshot.data()?.roomName,
                    roomImage: snapshot.data()?.roomImage,
                    owner: snapshot.data()?.owner,
                }
    
                handleChatRoom(data);
            })


        }
        
        loadRoom();

    },[])


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

            <RoomCard changeId={(id) => handleChatRoom(id)} />

            <ChatMessages id={idRoom} />

            {threads && userInfo &&
                <section className='info-box'>
                    <div className='img-area'>
                        <img src={threads.roomImage} />
                    </div>

                    <div className='profile-name'>
                        <h1>{threads.roomName}</h1>
                    </div>

                    <div className='profile-icon'>
                        <GiQueenCrown size={50} color='yellow' />
                    </div>

                    <div className='profile-creator'>
                        <img src={userInfo?.image === '' ? defaultAvatar : userInfo?.image} />
                        <div>
                            <h2>{userInfo?.name}</h2>
                        </div>
                    </div>
                </section>
            }
        </div>
    )
}

