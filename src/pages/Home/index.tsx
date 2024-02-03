import { useState, useEffect } from 'react';
import './home.scss';


import {db} from '../../services/firebaseConnection';
import {collection, getDocs, query, orderBy, doc, getDoc} from 'firebase/firestore';

import {Link} from 'react-router-dom';

import {FiSettings} from 'react-icons/fi';

import { toast } from 'react-toastify';


import {CreateRoom} from '../components/CreateRoom';
import { EditProfile } from '../components/EditProfile';

import {ThreadsProps} from '../types/Card.type';

import {RoomCard} from '../components/RoomCard'


export function Home(){
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [ProfileModalVisible, setProfileModalVisible] = useState<boolean>(false);
    const [threads, setThreads] = useState<ThreadsProps[]>([]);
    const [refresh, setRefresh] = useState<boolean>(true);

    useEffect(() => {
        async function getChats() {
            try {
                const docRef = collection(db, 'rooms');
                const q = query(docRef, orderBy('createdAt', 'asc'));
                const snapshot = await getDocs(q);
    
                    const newThreads = snapshot.docs.map(documentSnapshot => ({
                    idRoom: documentSnapshot.id,
                    roomName: documentSnapshot.data()?.roomName,
                    roomImage: documentSnapshot.data()?.roomImage,
                    owner: documentSnapshot.data()?.owner,
                    }));
    
                setThreads(newThreads);
                console.log('Rodou');
          } catch (error) {
                console.error('Erro ao obter chats:', error);
                toast.error(`${error}`, { theme: 'dark' });
          }
        }
    
        getChats();
      }, [refresh]);


    return(
        <div className='container'>

            
            <label className='nav-settings'>
                    <button onClick={()=> setProfileModalVisible(!ProfileModalVisible)}
                    >
                        <FiSettings size={30} color='#fff'/>
                    </button>
            </label>

            <nav className='nav-area'>
                <ul>
                    <button onClick={()=> setModalVisible(!modalVisible)}
                        className='home-button'
                    >+</button>
                </ul>

                {threads && threads.map(item => (
                    <li key={item.idRoom}>
                        <RoomCard data={item}/>
                    </li>
          ))}
            </nav>

            <main className='chat-box'>

            </main>
            
            <section className='info-box'>

            </section>

            <CreateRoom isOpen={modalVisible} changeVisibility={()=> setModalVisible(!modalVisible)} refresh={()=> setRefresh(!refresh)} />
            <EditProfile isOpen={ProfileModalVisible} changeVisibility={()=> setProfileModalVisible(!ProfileModalVisible)}/>
        </div>
    )
}

