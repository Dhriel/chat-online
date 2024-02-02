import {useRef} from 'react';
import './../Login/register.scss';
import {Link} from 'react-router-dom';


export function SignUp(){
    const name = useRef(null);
    const email = useRef(null);
    const password = useRef(null);

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

                <label>
                   <span>Password</span>
                    <input
                        className='input'
                        placeholder='*********'
                        ref={password}
                    />
                </label>
                
                <button type='submit'>
                    Cadastrar
                </button>
                <Link to='/login'>Já possui uma conta?</Link>
            </form>
        </div>
    )
}