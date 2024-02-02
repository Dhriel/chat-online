import {Route, Routes} from 'react-router-dom';

import {Home} from '../pages/Home';
import {Login} from '../pages/Login';
import {SignUp} from '../pages/SignUp';

export  function RoutesApp(){
    return(
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/register' element={<SignUp/>}/>
        </Routes>
    )
}