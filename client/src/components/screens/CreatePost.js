import React, {useState, useEffect} from 'react'
import { useHistory } from 'react-router-dom'
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import M from 'materialize-css'

import '../../App.css'

const useStyles = makeStyles((theme) => ({
    button: {
    },
}));


const CreatePost = () => {
    const classes = useStyles()
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
                    title,
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

    const postDetailsHandler = () => {
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
        
    return (
        <div className='card input-file'>
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
                    <span>Upload Image</span>
                    <input 
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" placeholder='Add image.' />
                </div>
            </div>
            <Button
                variant="contained"
                color="default"
                className={classes.button}
                startIcon={<CloudUploadIcon/>}
                onClick={postDetailsHandler}
            >
                Submit Post
            </Button>

        </div>
        )
    
}

export default CreatePost
