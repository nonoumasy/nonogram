import React, { useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import M from 'materialize-css'

const Reset = () => {

    const history = useHistory()    
    const [email, setEmail] = useState('')

    const postData = () => {

        fetch('/reset-password', {
            method: 'post',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                email
            })
        }
        )
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    M.toast({ html: data.error })
                } else {
                    M.toast({ html: 'Login successful' })
                    history.push('/login')
                }

            })
            .catch(err => console.log(err))
    }



    return (
        <div className='mycard'>
            <div className="card auth-card">
                <h2>Nonogram</h2>
                <input
                    type="text"
                    placeholder='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button
                    className="btn"
                    onClick={() => postData()}
                >
                    Reset Password
                </button>
            </div>
        </div>
    )
}

export default Reset
