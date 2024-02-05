import { useState, useEffect } from 'react';

import {ThreadsProps} from '../../types/Card.type';

import {db} from '../../../services/firebaseConnection';
import {collection, getDocs, query, orderBy} from 'firebase/firestore';

import { toast } from 'react-toastify';

import {CreateRoom} from '../CreateRoom';


import './roomcard.scss';

interface RoomCardProps {
    changeId: (id: string) => void;
  }


export function RoomCard({changeId} : RoomCardProps){

  const [threads, setThreads] = useState<ThreadsProps[]>([]);
  const [refresh, setRefresh] = useState<boolean>(true);

  const [modalVisible, setModalVisible] = useState<boolean>(false);


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
      <div className='nav-container'>
          <nav className='nav-area'>
          
          <ul>
              <button onClick={()=> setModalVisible(!modalVisible)}
                  className='room-button'
              >+</button>
          </ul>

          {threads && threads.map(item => (
              <li key={item.idRoom}>
                  <div className="room-card">
                    <button className='room-card-button' onClick={()=> changeId(item.idRoom)}>
                      <img src={item.roomImage} alt={`Imagem da sala ${item.roomName}`} />
                    </button>
                    <span>{item.roomName}</span>
                  </div>
              </li>
      ))}
      
      </nav>
      <CreateRoom isOpen={modalVisible} changeVisibility={()=> setModalVisible(!modalVisible)} refresh={()=> setRefresh(!refresh)} />
    </div>
    
  )
}