import { useState, useEffect } from 'react';
import './home.scss';


import {db} from '../../services/firebaseConnection';
import {collection, getDocs, query, orderBy, doc} from 'firebase/firestore';


import {FiSettings} from 'react-icons/fi';
import { toast } from 'react-toastify';

import { EditProfile } from '../components/EditProfile';

import {ThreadsProps, MessagesProps} from '../types/Card.type';

import {RoomCard} from '../components/RoomCard';
import {ChatMessages} from '../components/ChatMessages';


export function Home(){
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [ProfileModalVisible, setProfileModalVisible] = useState<boolean>(false);
    const [idRoom, setIdRoom] = useState<string>('');

    const [messages, setMessages] = useState<MessagesProps[]>([]);


    async function handleChatRoom(id: string){
        console.log(id);
        try{
                    const docRef = doc(db, 'rooms', id);
                    await getDocs(collection(docRef, 'messages'))
                    .then((snapshot)=>{
                        
                        let list = [] as MessagesProps[];

                        snapshot.docs.forEach((documentSnapshot)=>{
                            list.push({
                                createdAt: documentSnapshot.data()?.createdAt,
                                name: documentSnapshot.data()?.name,
                                text: documentSnapshot.data()?.text,
                                image: documentSnapshot.data()?.image,
                            })
                        });

                        console.log(list);

                    })
            

        }catch(error){
            console.log(error);
        }
    }

    return(
        <div className='container'>
            
            {/* Editar perfil  */}
            <label className='nav-settings'>
                    <button onClick={()=> setProfileModalVisible(!ProfileModalVisible)}
                    >
                        <FiSettings size={30} color='#fff'/>
                    </button>
            </label>

            {/* Mostrar salas */}
            <RoomCard changeId={(id)=> setIdRoom(id)}/>


            {/* Chat */}
            <ChatMessages id={idRoom}/>
            
            {/* Mostrar grupo ao lado */}
            <section className='info-box'>
                <div>
                    <image/>
                </div>

                <h3>Nome</h3>

                <div>
                    <p>Icon</p>
                    <p>Criador do Grupo</p>
                </div>

                <div>
                    <div>
                        <image/>
                    </div>
                    <h4>Adriel</h4>
                </div>

            </section>

            <EditProfile isOpen={ProfileModalVisible} changeVisibility={()=> setProfileModalVisible(!ProfileModalVisible)}/>
        </div>
    )
}

