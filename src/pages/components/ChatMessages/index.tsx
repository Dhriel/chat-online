import {useState, useEffect, useRef, useContext} from 'react';
import './messages.scss';
import {AuthContext} from '../../../contexts/AuthContext';

import {MessagesProps} from '../../types/Card.type';

import {db} from '../../../services/firebaseConnection';
import {collection, doc, onSnapshot, query, orderBy, addDoc} from 'firebase/firestore';

import defaultAvatar from '../../../assets/images/avatar.jpg';

interface ChatMessagesProps {
    id: string
}

export function ChatMessages({id} : ChatMessagesProps) {
    const [messages, setMessages] = useState<MessagesProps[]>([]);
    
    const {user, signed} = useContext(AuthContext);
    
    const inputTextRef = useRef<HTMLInputElement | null>(null);
    const scrollRef = useRef<HTMLInputElement>(null);

    useEffect(()=>{
        if(!id) return;
        console.log('Página chatMessages: rodou')
        try {
            const docRef = doc(db, 'rooms', id);

            const unsubscribe = onSnapshot(
                query(collection(docRef, 'messages'), orderBy('createdAt')),
                (snapshot) => {
                let list = [] as MessagesProps[];

                snapshot.forEach((documentSnapshot) => {
                    list.push({
                        createdAt: documentSnapshot.data()?.createdAt,
                        name: documentSnapshot.data()?.name,
                        text: documentSnapshot.data()?.text,
                        image: documentSnapshot.data()?.image,
                        dateHour: documentSnapshot.data()?.dateHour
                    });
                });
                console.log(list);
                setMessages(list);
            }
        );

        } catch (error) {
            console.log(error);
        }

    }, [id]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
          handleMessages();
        }
      };

      useEffect(()=>{
        scrollDownComponent();
      },[messages])


    async function handleMessages(): Promise<void>{
        if(!signed) return;
        let message = '';

        if (inputTextRef.current) {
            console.log(inputTextRef.current.value);
            message = inputTextRef.current.value;
            inputTextRef.current.value = ''; // Define o valor do input como uma string vazia
        }

        console.log(message);

        let formatedDate = getDate();
        
        try {
            const docRef = doc(db, 'rooms', id);
            const collectionRef = collection(docRef, 'messages');
            await addDoc(collectionRef, {
                createdAt: new Date(),
                text: message,
                name: user?.name,
                image: user?.image,
                dateHour: formatedDate
            });

        }catch(err){
            console.log(err);
        }

    }

    function getDate() : string{
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

   function scrollDownComponent(): void {
        if (scrollRef.current) {
          const chatArea = scrollRef.current;
          chatArea.scrollTop = chatArea.scrollHeight;
        }
      }
      
    return(
        <main className='chat-box'>
           
            <div className='chat-area' ref={scrollRef}>
                {messages && messages.map((item, index)=> (
                    <div key={index} className='chat-container'>
                        <div className='chat-image'>
                            <img
                                src={item.image ? item.image : defaultAvatar}
                                loading='lazy'
                            />
                        </div>
                        <div className='chat-right'>
                            <div>
                                <span className='chat-username'>{item.name}</span>
                                <span className='chat-time'>{item.dateHour}</span>
                            </div>
                            <p className='chat-text'>{item.text}</p>
                        </div>
                    </div>
                ))}
            </div> 

            <div className='message-box'>
                <input
                    type='textarea'
                    placeholder='Escreva algo aqui'
                    ref={inputTextRef}
                    onKeyDown={handleKeyDown}
                    
                />
            </div>

        </main>
    )
}