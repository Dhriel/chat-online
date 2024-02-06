import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

import './register.scss'
import { Link } from 'react-router-dom';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
    email: z.string().email('Digite um e-mail válido').min(1, 'O campo de e-mail não pode estar vázio.'),
    password: z.string().min(6, 'A senha deve possuir pelo menos 6 caracteres.')
})

type FormData = z.infer<typeof schema>

export function Login() {

    const { signIn, loadingAuth } = useContext(AuthContext);

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: 'onChange'
    })

    function handleLogin(data: FormData) {
        try {
            signIn(data.email, data.password);
        } catch (err) {
            console.log('Erro ao logar')
        }
    }

    return (
        <div className='box'>
            <h1>Chat Online</h1>
            <p>Desenvolvido por: Adriel Rocha</p>

            <form className='form' onSubmit={handleSubmit(handleLogin)}>
                <label>
                    <span>Email</span>
                    <input
                        type='email'
                        placeholder='teste@gmail.com'
                        {...register('email')}
                        id='email'

                    />
                    {errors.email?.message && <p>{errors.email.message}</p>}
                </label>

                <label>
                    <span>Senha</span>
                    <input
                        type='password'
                        placeholder='**************'
                        {...register('password')}
                        id='password'
                    />
                    {errors.password?.message && <p>{errors.password.message}</p>}
                </label>


                <button type='submit'>
                    {loadingAuth ? 'Carregando... ' : 'Fazer Login'}
                </button>
            </form>
            <div className='link-area'>
                <Link to='/register'>Ainda não possui uma conta?</Link>
            </div>
        </div>
    )
}