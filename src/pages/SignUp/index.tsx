import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

import './../Login/register.scss';
import { Link } from 'react-router-dom';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
    name: z.string().min(3, 'O nome precisa ter pelo menos 3 caracteres.'),
    email: z.string().email('Digite um e-mail válido').min(1, 'O campo de e-mail não pode estar vázio.'),
    password: z.string().min(6, 'A senha deve possuir pelo menos 6 caracteres.')
})

type FormData = z.infer<typeof schema>

export function SignUp() {
    const { signUp, loadingAuth } = useContext(AuthContext);

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: 'onChange'
    });


    function handleRegister(data: FormData) {
        try {
            signUp(data.email, data.password, data.name)
        } catch (error) {
            console.log('Erro ao tentar cadastrar');
        }

    }

    return (
        <div className='box'>
            <h1>Chat Online</h1>
            <p>Desenvolvido por: Adriel Rocha</p>

            <form className='form' onSubmit={handleSubmit(handleRegister)}>
                <label>
                    <span>Nome</span>
                    <input
                        type='text'
                        placeholder='Seu nome aqui'
                        {...register('name')}
                        id='name'
                    />
                    {errors.name?.message && <p>{errors.name.message}</p>}
                </label>

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
                    <span>Password</span>
                    <input
                        type='Senha'
                        placeholder='*********'
                        {...register('password')}
                        id='password'
                    />
                    {errors.password?.message && <p>{errors.password.message}</p>}
                </label>

                <button type='submit'>
                    {loadingAuth ? 'Carregando... ' : 'Cadastrar'}
                </button>

            </form>
            <div className='link-area'>
                <Link to='/login'>Já possui uma conta?</Link>
            </div>
        </div>
    )
}