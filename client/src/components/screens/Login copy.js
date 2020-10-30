import React, { useState, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'
import { UserContext} from '../../App'

const Login = () => {
    const {state, dispatch} = useContext(UserContext)

    const history = useHistory()
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')

    const postData = () => {

        fetch('/login', {
            method: 'post',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        }
        )
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    M.toast({ html: data.error })
                } else {
                    localStorage.setItem('jwt', data.token)
                    localStorage.setItem('user', JSON.stringify(data.user))
                    dispatch({type: 'USER', payload: data.user})
                    M.toast({ html: 'Login successful' })
                    history.push('/')
                }

            })
            .catch(err => console.log(err))
    }

    

    return (
        <div>
            <div>
                <h2>Nonogram</h2>
                <input
                    type="text"
                    placeholder='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    className="btn waves-effect waves-light"
                    onClick={() => postData()}
                >
                    Login
                </button>
                <h6>
                    <Link to='Signup'> Don't have an account?</Link>
                </h6>
                <div>
                    <Link to="/reset">Forgot password?</Link>
                </div>


            </div>
        </div>
    )
}

export default Login
