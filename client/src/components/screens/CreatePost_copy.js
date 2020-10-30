import React, {useState, useEffect} from 'react'
import { useHistory } from 'react-router-dom'
import M from 'materialize-css'
import { capitalCase } from "capital-case"
import axios from 'axios'

import '../../App.css'

const CreatePost = () => {
    const history = useHistory()
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")

    useEffect(() => {
        if (url) {
            // posting to database
            fetch("/create", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    title: capitalCase(title),
                    body,
                    image: url
                })
            }).then(res => res.json())
                .then(data => {

                    if (data.error) {
                        M.toast({ html: data.error})
                    }
                    else {
                        M.toast({ html: "Created post Successfully"})
                        history.push('/')
                    }
                }).catch(err => {
                    console.log(err)
                })
        }
    }, [url])

    const postDetails = () => {
        const data = new FormData()
        data.append('file', image)
        data.append('upload_preset', 'nonogram')
        data.append('cloud_name', 'nonoumasy')

        // posting to cloudinary 
        if (image.type === 'video/mp4' || 'video/webm' || 'video/ogg') {
            axios.post('https://api.cloudinary.com/v1_1/nonoumasy/video/upload', data)
                .then(res => setUrl(res.data.secure_url))
                .catch(err => console.log(err))
        } 
        
        if (image.type === 'image/png' || 'image/jpg' || 'image/jpeg' || 'image/gif'){
            axios.post('https://api.cloudinary.com/v1_1/nonoumasy/image/upload', data)
                .then(res => setUrl(res.data.secure_url))
                .catch(err => console.log('something went wrong', err))
        }

    }
        
    return (
        <div>
            <input 
            type="text" 
            placeholder='title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            />
            <input 
            type="text" 
            placeholder='body' 
            value={body}
            onChange={(e) => setBody(e.target.value)}
            />

            <div className="file-field input-field">
                <div className="btn">
                    <input 
                    type="file"
                    accept="video/*,image/*"
                    onChange={(e) =>{
                        setImage(e.target.files[0])
                        }
                    } 
                    />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" placeholder='Add image.' />
                </div>
            </div>
            <button
                className="btn waves-effect waves-light"
                onClick={() => postDetails()}
            >
                Submit Post
            </button>

        </div>
        )
    
}

export default CreatePost
