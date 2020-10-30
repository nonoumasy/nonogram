import React, {useState, useEffect} from 'react'
import { Link, useHistory} from 'react-router-dom'
import M from 'materialize-css'

import '../../App.css'

const Signup = () => {
    const history = useHistory()
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [image, setImage] = useState("")
    const [url, setUrl] = useState(undefined)

    useEffect(() => {
        if (url) {
            uploadFields()
        }
    }, [url])

    const uploadPic = () => {
        const data = new FormData()
        data.append('file', image)
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

    const uploadFields = () => {
        fetch('signup', {
            method: 'post',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password,
                pic: url
            })
        }
        )
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    M.toast({ html: data.error })
                } else {
                    M.toast({ html: data.message })
                    history.push('/login')
                }

            })
            .catch(err => console.log(err))
    }

    const postData = () => {
        if (image) {
            uploadPic()
        } else {
            uploadFields()
        }
    }

    return (
        <div>
            <div>
                <h2>Nonogram</h2>
                <input
                    type="text"
                    placeholder='name' 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    />
                <input
                    type="email"
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
                <div className="file-field input-field">
                    <div className="btn">
                        <span>Upload Photo</span>
                        <input
                            type="file"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
                
                <button 
                className="btn waves-effect waves-light"
                    onClick={() => postData()}
                >
                    SignUp
                </button>
                <h6>
                    <Link to='Login'> Already have an account?</Link>
                </h6>
                
            
            </div>
        </div>
    )
}

export default Signup
