import React, {useState, useEffect} from 'react'
import { Link, useHistory} from 'react-router-dom'
import {useForm} from 'react-hook-form'

import '../../App.css'



const Signup = () => {
    const history = useHistory()
    const [image, setImage] = useState("")
    const [url, setUrl] = useState(undefined)
    const {register, handleSubmit} = useForm()

    useEffect(() => {
        if (url) {
            uploadFields()
        }
    }, [url])

    const uploadPic = (props) => {
        const data = new FormData()
        data.append('file', props.image)
        data.append('upload_preset', 'nonogram')
        data.append('cloud_name', 'nonoumasy')

        // posting to cloudinary 
        fetch('https://api.cloudinary.com/v1_1/nonoumasy/image/upload',
            {
                method: "post",
                body: data
            })
            .then(res => res.json())
            .then(data => setUrl(data.url))
            .catch(err => console.log(err))
        }

    const uploadFields = (props) => {
        fetch('signup', {
            method: 'post',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                name: props.name,
                email: props.email,
                password: props.password,
                pic: url
            })
        }
        )
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    console.log(data.message)
                    history.push('/login')
                }

            })
            .catch(err => console.log(err))
    }

    const postData = (props) => {
        if (image) {
            uploadPic(props)
        } else {
            uploadFields(props)
        }
    }

    return (
        <form onSubmit={handleSubmit(postData)}>
            <input type='name' name='name' ref={register} />
            <br></br>
            <input type='email' name='email' ref={register} />
            <br></br>
            <input type='password' name='password' ref={register} />
            <br></br>
            <input type="file" name='image' ref={register}/>
            <br></br>
            <button >Submit</button>
            <br></br>
            <Link to='Login'> Already have an account?</Link>
        </form>
    )
}

export default Signup
