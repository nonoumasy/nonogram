import React, {useState, useEffect} from 'react'
import { useHistory } from 'react-router-dom'
import M from 'materialize-css'
import { capitalCase } from "capital-case"
import axios from 'axios'
import AlertMassage from "./AlertMessage"

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

import '../../App.css'

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        height: 300,
        maxWidth: 300,
        margin: '30px auto',
        padding: theme.spacing(6)
    }
}))

const CreatePost = () => {
    const classes = useStyles()
    const history = useHistory()
    
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")
    const [status, setStatusBase] = useState("");
    const [open, setOpen] = useState(false)

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
                        setStatusBase({ msg: data.error, key: Math.random() })
                    }
                    else {
                        setStatusBase({ msg: "Created post Successfully", key: Math.random() })
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
        if ((image.type === 'video/mp4') || (image.type === 'video/webm') || (image.type === 'video/ogg')) {
            axios.post('https://api.cloudinary.com/v1_1/nonoumasy/video/upload', data)
                .then(res => { 
                    setStatusBase({ msg: "Created post Successfully", key: Math.random() })
                    setUrl(res.data.secure_url)
                }
                    )
                .catch(err => { 
                    console.log('something went wrong', err)
            }) 
        } 
        if
            ((image.type === 'image/png') || (image.type === 'image/jpg') || (image.type === 'image/jpeg' || (image.type === 'image/gif') )) {
            axios.post('https://api.cloudinary.com/v1_1/nonoumasy/image/upload', data)
                .then(res => {
                    setStatusBase({ msg: "Created post Successfully", key: Math.random() })
                    setUrl(res.data.secure_url)
                }
                )
                .catch(err => {
                    console.log('something went wrong', err)
                }) 
        } 
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    }

        
    return (
        <>
        <Card className={classes.root}>
            <Typography variant='h6' align="center">
                Add Post
            </Typography>

            <TextField
                label='Title'
                type='text'
                placeholder='title'
                value={title}
                fullWidth
                onChange={(e) => setTitle(e.target.value)}
            />

            <TextField
                    rows={4}
                    label="Tell us a story"
                    multiline
                    placeholder='Once a upon a time...'
                    value={body}
                    fullWidth
                    onChange={(e) => setBody(e.target.value)}
                    
                />

            <Button fullwidth>
                <input

                    type="file"
                    accept="video/*,image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                />
            </Button>

            <Button
                variant='contained'
                disableElevation
                fullWidth
                type='submit'
                onClick={() => postDetails()}>
                Submit Post
            </Button>
            
        </Card>
        { status ? <AlertMassage key={status.key} message={status.msg} /> : null }
        </>
        )
    
}

export default CreatePost
