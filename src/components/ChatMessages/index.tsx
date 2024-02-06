import { useState, useEffect, useRef, useContext } from 'react';
import './messages.scss';
import { AuthContext } from '../../contexts/AuthContext';


import { db } from '../../services/firebaseConnection';
import { collection, doc, onSnapshot, query, orderBy, addDoc } from 'firebase/firestore';

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


import { MessagesProps } from '../../types/Card.type';
import loadImage from './../../assets/images/load.svg';
import defaultAvatar from '../../assets/images/avatar.jpg';


interface ChatMessagesProps {
    id: string
}

export function ChatMessages({ id }: ChatMessagesProps) {
    const [messages, setMessages] = useState<MessagesProps[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const { user, signed } = useContext(AuthContext);

    const inputTextRef = useRef<HTMLInputElement | null>(null);
    const scrollRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        try {
            const docRef = doc(db, 'rooms', id);

            onSnapshot(
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
                    setMessages(list);
                    setLoading(false);

                }
            );

        } catch (error) {
            setLoading(false);
            toast.error(`Erro ao carregar o Chat`, { theme: 'dark' });

        }

    }, [id]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleMessages();
        }
    };

    useEffect(() => {
        scrollDownComponent();
    }, [messages])


    async function handleMessages(): Promise<void> {
        if (!id) {
            toast.error('Clique em uma sala para começar uma conversa', { theme: 'dark' });
            return;
        }
        if (!signed) {
            toast.error('Você precisar estar logado para falar no chat', { theme: 'dark' });
            navigate('/login', { replace: true });
            return;
        };
        let message = '';

        if (inputTextRef.current) {
            message = inputTextRef.current.value;
            inputTextRef.current.value = '';
        }

        let formatedDate = getDate();

        try {
            if (user && user.name && user.image) {
                const docRef = doc(db, 'rooms', id);
                const collectionRef = collection(docRef, 'messages');

                if (message === '') return;
                await addDoc(collectionRef, {
                    createdAt: new Date(),
                    text: message,
                    name: user?.name,
                    image: user?.image,
                    dateHour: formatedDate
                })
                    .then(() => message = '');
            }

        } catch (err) {
            console.log(err);
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

    function scrollDownComponent(): void {
        if (scrollRef.current) {
            const chatArea = scrollRef.current;
            chatArea.scrollTop = chatArea.scrollHeight;
        }
    }


    return (
        <main className='chat-box'>

            <div className='chat-area' ref={scrollRef}>

                {loading ?
                    <div className='loading-area'>
                        <img src={loadImage} alt='Carregando' />
                    </div>
                    :
                    <>
                        {messages && messages.map((item, index) => (
                            <div key={index} className='chat-container'>
                                <div className='chat-image'>
                                    <img
                                        src={item.image ? item.image : defaultAvatar}
                                        loading='lazy' alt='Imagem de Perfil do Usuário'
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
                    </>
                }

            </div>

            <div className='message-box'>
                <input
                    type='textarea'
                    placeholder='Escreva algo aqui'
                    ref={inputTextRef}
                    onKeyDown={handleKeyDown}
                    maxLength={300}

                />
            </div>

        </main>
    )
}