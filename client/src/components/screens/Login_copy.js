import React, { useState, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import {useForm} from 'react-hook-form'
import { UserContext} from '../../App'

const Login = () => {
    const history = useHistory()
    const {state, dispatch} = useContext(UserContext)
    const { register, handleSubmit} = useForm()

    const postData = ({ email, password }) => {
        fetch('/login', {
            method: 'post',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log('data object:',data)
                if (data.error) {
                    console.log(data.error)
                } else {
                    localStorage.setItem('jwt', data.token)
                    localStorage.setItem('user', JSON.stringify(data.user))
                    dispatch({ type: 'USER', payload: data.user })
                    history.push('/')
                }
            })
            .catch(err => console.log(err))
    }
 
    return (
        <form onSubmit={handleSubmit(postData)}>
            <input type='email' name='email' ref={register} />
            <br></br>
            <input type='password' name='password' ref={register} />
            <br></br>
            <Link to='Signup'>Don't have an account?</Link>
            <br></br>
            <button type='submit'>Submit</button>  
        </form>

    )
}

export default Login
