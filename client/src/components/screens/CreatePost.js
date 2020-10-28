import React, {useState, useEffect} from 'react'
import { useHistory } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import M from 'materialize-css'

import '../../App.css'

const useStyles = makeStyles((theme) => ({
    dialog: {
        maxWidth: 400,
        margin: '0px auto',
        padding: '30px'
    },
    margin: {
        margin: theme.spacing(2),
        padding: '0 30px'
    },
    input: {
        display: 'none',
    },
}))

const CreatePost = () => {
    const classes = useStyles()
    const [open, setOpen] = React.useState(false);
    const history = useHistory()
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")
    const [value, setValue] = useState('');

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

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
        
    const handleChange = (event) => {
        setValue(event.target.value);
    };

    return (
        <>
            <Button onClick={handleClickOpen}>
                Add Post
            </Button>
            <Dialog 
                open={open} 
                onClose={handleClose} 
                aria-labelledby="form-dialog-title"
                className={classes.dialog}
                >
                <DialogTitle id="form-dialog-title">Add Post</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To add a post: please pick an interesting title, tell us a story, upload an image and then click on Post.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="title"
                        label="Title"
                        fullWidth
                    />
                    <TextField
                        id="standard-multiline-flexible"
                        label="Tell us a story"
                        multiline
                        rowsMax={4}
                        value={value}
                        fullWidth
                        onChange={handleChange}
                    />
                    <DialogActions>
                        <input
                            accept="image/*"
                            className={classes.input}
                            id="contained-button-file"
                            type="file"
                        />
                        <label htmlFor="contained-button-file">
                            <Button
                                variant="contained"
                                color="primary"
                                component="span"
                                onChange={(e) => setImage(e.target.files[0])}
                            >
                                Upload Image
                        </Button>
                        </label>
                    </DialogActions>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={handleClose}
                        color="primary"
                        >
                        Cancel
                    </Button>
                    <Button 
                        onClick={postDetailsHandler} 
                        color="primary"
                        >
                        Post
                    </Button>
                </DialogActions>
            </Dialog>
        </>
        )
    
}

export default CreatePost
