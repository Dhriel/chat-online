import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

import { ThreadsProps } from '../../types/Card.type';

import { db } from './../../services/firebaseConnection';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

import { toast } from 'react-toastify';

import { CreateRoom } from '../CreateRoom';
import { EditProfile } from '../EditProfile';

import { FiSettings } from 'react-icons/fi';
import { BsPersonFill } from "react-icons/bs";

import {useNavigate} from 'react-router-dom'; 

import './roomcard.scss';

interface RoomCardProps {
  changeId: (data: ThreadsProps) => void;
}


export function RoomCard({ changeId }: RoomCardProps) {

  const [threads, setThreads] = useState<ThreadsProps[]>([]);
  const [refresh, setRefresh] = useState<boolean>(true);

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [ProfileModalVisible, setProfileModalVisible] = useState<boolean>(false);


  const { signed } = useContext(AuthContext);

  const navigate = useNavigate();


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
      } catch (error) {
        console.error('Erro ao obter chats:', error);
        toast.error(`${error}`, { theme: 'dark' });
      }
    }

    getChats();
  }, [refresh]);


  return (
    <div className='nav-container'>
      <nav className='nav-area'>

        {signed ? 
          <ul>
            <button onClick={() => setModalVisible(!modalVisible)} className='room-button'>+</button>
            <button onClick={() => setProfileModalVisible(!ProfileModalVisible)} className='room-button' style={{ backgroundColor: "#00388C" }}>
              <FiSettings size={30} color='#fff' />
            </button>
          </ul>
          :
          <ul>
            <button onClick={() => navigate('/login', {replace: true})} className='room-button' style={{ backgroundColor: "#000" }}>
              <BsPersonFill  size={30} color='#fff' />
            </button>
          </ul>
        }

        {threads && threads.map(item => (
          <li key={item.idRoom}>
            <div className="room-card" data-name={item.roomName}>
              <button className='room-card-button' onClick={() => changeId(item)}>
                <img src={item.roomImage} alt={`Imagem da sala ${item.roomName}`} />
              </button>
            </div>
          </li>
        ))}

      </nav>
      <CreateRoom isOpen={modalVisible} changeVisibility={() => setModalVisible(!modalVisible)} refresh={() => setRefresh(!refresh)} />
      <EditProfile isOpen={ProfileModalVisible} changeVisibility={() => setProfileModalVisible(!ProfileModalVisible)} />
    </div>

  )
}