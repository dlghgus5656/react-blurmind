import { Axios } from 'axios'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { loginUser} from '../../../_actions/user_action';

function Loginpage(props) {
    const dispatch = useDispatch();

    const [ID, setID] = useState("")
    const [Password, setPassword] = useState("")

    const onIDHandler = (event) => {
        setID(event.currentTarget.value)
    }
    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
    }

    const onSubmitHandler = (event) => {
        event.preventDefault();

        let body = {
            id: ID,
            password: Password
        }
        dispatch(loginUser(body))
            .then(response => {
                if(response.payload.loginSuccess) {
                    props.history.push('/')
                } else {
                    alert('Error')
                }
            })
        
    }



    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center'
            , width: '100%', height: '100vh'
        }}>
            <form style={{ display: 'flex', flexDirection: 'column'}}
                onSubmit={onSubmitHandler}
            >
                <label>ID</label>
                <input type="id" value={ID} onChange={onIDHandler} />
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />

                <br />
                <button type="submit">
                    Login
                </button>


            </form>
           
        </div>
    )
}

export default Loginpage