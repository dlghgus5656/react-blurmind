import React, { useEffect} from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom'

function Mainpage(props) {

    useEffect(() => {
        axios.get('/api/hello')
        .then(response=> { console.log(response)})
    }, [])

    const onClickHandler =() => {
        axios.get('/api/users/logout')
            .then(response => {
                console.log(response.data)
                if(response.data.success=true) {
                    props.history.push("/login")
                } else {
                    alert('로그아웃에 실패 했습니다.')
                }
            })
    }

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center'
            , width: '100%', height: '100vh'
        }}>
            <form style={{ display: 'flex', flexDirection: 'column'}}>
            <h2>시작 페이지</h2>
            

            <Link to="./login"> 
                <button> 로그인하기 </button>
            </Link>
            
            <button onClick={onClickHandler}>
                로그 아웃
            </button>

            <Link to="./register"> 
                <button> 회원가입 </button>
            </Link>
            </form>        
        </div>
        
    )
}

export default Mainpage