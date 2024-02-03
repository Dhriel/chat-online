import { useState, useEffect } from 'react';
import './home.scss';


import {db} from '../../services/firebaseConnection';
import {collection, getDocs, query, orderBy, doc, getDoc} from 'firebase/firestore';

import {Link} from 'react-router-dom';

import {FiSettings} from 'react-icons/fi';


import {CreateRoom} from '../components/CreateRoom';
import { EditProfile } from '../components/EditProfile';

interface ThreadsProps {
    idRoom: string;
    roomName: string;
    roomImage: string;
    owner: string;}


export function Home(){
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [ProfileModalVisible, setProfileModalVisible] = useState<boolean>(false);
    const [threads, setThreads] = useState<ThreadsProps[]>([]);

    useEffect(()=>{
        
        async function getChats(){

            const docRef = collection(db, 'rooms');
            const q = query(docRef, orderBy('createdAt', 'desc'));
            await getDocs(q)
            .then((snapshot)=>{
                const threads = snapshot.docs.map(documentSnapshot => {
                    return {
                        idRoom: documentSnapshot.id,
                        roomName: documentSnapshot.data()?.roomName,
                        roomImage: documentSnapshot.data()?.roomImage,
                        owner: documentSnapshot.data()?.owner,
                    }
                })

                setThreads(threads);
            })

        }

        getChats()
    })

    return(
        <div className='container'>

            
            <div className='nav-settings'>
                    <button onClick={()=> setProfileModalVisible(!ProfileModalVisible)}>
                        <FiSettings size={30} color='#fff'/>
                    </button>
            </div>

            <nav className='nav-area'>
                <ul>
                    <button onClick={()=> setModalVisible(!modalVisible)}>+</button>
 
                </ul>
            </nav>

            <main className='chat-box'>

            </main>
            
            <section className='info-box'>

            </section>

            <CreateRoom isOpen={modalVisible} changeVisibility={()=> setModalVisible(!modalVisible)}/>
            <EditProfile isOpen={ProfileModalVisible} changeVisibility={()=> setProfileModalVisible(!ProfileModalVisible)}/>
        </div>
    )
}

