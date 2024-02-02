import {useRef, useState} from 'react';
import './register.scss'

import {Link} from 'react-router-dom';

export function Login(){
    const name = useRef(null);
    const email = useRef(null);

    function handleSubmit(e : any) {
        e.preventDefault();
        alert('ALOU')
    }

    return(
        <div className='box'>
            <h1>Chat Online</h1>
            <p>Desenvolvido por: Adriel Rocha</p>

            <form className='form' onSubmit={handleSubmit}>  
                <label>
                   <span>Nome</span>
                    <input
                        className='input'
                        placeholder='Seu nome aqui'
                        ref={name}
                    />
                </label>

                <label>
                   <span>Email</span>
                    <input
                        className='input'
                        placeholder='teste@gmail.com'
                        ref={email}
                    />
                </label>

                
                <button type='submit'>
                    Fazer Login
                </button>
                <Link to='/register'>Ainda não possui uma conta?</Link>
            </form>
        </div>
    )
}