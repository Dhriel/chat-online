import { useState } from 'react';
import './home.scss';

import {Link} from 'react-router-dom';

import {CreateRoom} from '../components/CreateRoom';

export function Home(){
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    

    return(
        <div className='container'>

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
        </div>
    )
}

