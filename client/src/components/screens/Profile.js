import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../App'
import AlertMassage from "../shared/AlertMessage"

import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import Dialog from '@material-ui/core/Dialog';

const useStyles = makeStyles( theme => ({
    dialog: {
        width: '100%',
        height: '40rem',
        margin: 'auto',
        
    },
    card: {
        objectFit: 'cover',
    },
    gridContainer: {
        margin: 0,
        padding: 0,
    },
    container: {
        margin: 0,
        padding: 0,
        border: 0,
        background: 'transparent',
        cursor: 'pointer',
        textDecoration: 'none',
        overflow: 'hidden',
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.1)',
    
    },
    image: {
        width: '100%',
        height: '20rem',
        objectFit: 'cover',
        margin: 0,
        padding: 0,
        borderRadius: '5px',
        transition: '0.4s',
        '&:hover': {
            transformOrigin: '50% 50%',
            transform: 'scale(1.1)',
        },
    },
    video: {
        width: '100%',
        height: '20rem',
        objectFit: 'cover',
        margin: 0,
        padding: 0,
        borderRadius: '5px'
    },
    button: {
        cursor: 'pointer',
        overflow: 'hidden',
        borderRadius: '50%',
        margin:0,
        padding:0,
        
    },
    avatar: {
        width: theme.spacing(15),
        height: theme.spacing(15),
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            transformOrigin: '50% 50%',
            transform: 'scale(1.1)',
        },
    },
}))

const Profile = () => {
    const classes = useStyles();
    const { state, dispatch } = useContext(UserContext)
    const [mypics, setMyPics] = useState([])
    const [image, setImage] = useState("")
    const [status, setStatusBase] = useState("")
    const [modalImage, setModalImage] = useState("")
    const [open, setOpen] = useState(false)

    useEffect(() => {
        fetch('/mypost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
            })
            .then(res => res.json())
            .then(result => {
                setMyPics(result.post)
            } 
            )
        
    }, [])

    useEffect(() => {
        if (image) {
            const data = new FormData()
            data.append("file", image)
            data.append("upload_preset", "nonogram")
            data.append("cloud_name", "nonoumasy")

            // posting to cloudinary 
            fetch("https://api.cloudinary.com/v1_1/nonoumasy/image/upload", 
            {
                method: "post",
                body: data
            })
            .then(res => res.json())
            .then(data => {

            fetch('/updatepic', {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    pic: data.url
                })
                })
                .then(res => res.json())
                .then(result => {
                    localStorage.setItem("user", JSON.stringify({ ...state, pic: result.pic }))
                    dispatch({ type: "UPDATEPIC", payload: result.pic })
                })
                    
            })
            .catch(err => {
                console.log(err)
            })
        }
    }, [image])

    const updatePhoto =  (file) => {
        setImage(file)
        setStatusBase({ msg: "Photo updated", key: Math.random() });
    }

    const clickImageHandler = (props) => {
        // console.log(props)
        setOpen(true);
        setModalImage(props)
    }

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>

                <Dialog
                    open={open}
                    className={classes.dialog}
                    onClose={handleClose}
                >
                    <img src={modalImage} className={classes.card}/>
                    
                </Dialog>


                <div style={{ 
                    display: "flex", 
                    flexDirection: 'row', 
                    justifyContent: "space-around",
                    alignItems:"center",
                    flexWrap: 'wrap',
                    marginBottom: '2rem'
                    }}>

                    
                        <input
                            accept="image/*"
                            // className={classes.input}
                            style={{ display: 'none' }}
                            id="raised-button-file"
                            type="file"
                                onChange={(e) => updatePhoto(e.target.files[0])}
                        />
                        <Tooltip title='Change Profile Photo ' arrow placement="left">
                            <label htmlFor="raised-button-file">
                                <Button variant="raised" component="span" className={classes.button}>
                                    <Avatar src={state && state.pic} className={classes.avatar} alt=""/>
                                </Button>
                            </label>
                        </Tooltip>
               
                    
                    
                    <div>
                        <Typography variant='h4'>    
                            {state && state.name}
                        </Typography>
                        <Typography variant='h6'>    
                            {state && state.email}
                        </Typography>
                        <div style={{ 
                            display: "flex", 
                            justifyContent: "space-between" 
                            }}>
                            <Typography variant='body'>
                                {mypics.length} posts
                            </Typography>
                            <Typography variant='body'>
                                {state ? state.followers.length : "0"} followers
                            </Typography>
                            <Typography variant='body'>
                                {state ? state.following.length : "0"} following
                            </Typography>
                        </div>
                    </div>
                </div>
                
                <Grid
                    container
                    spacing={2}
                    className={classes.gridContainer}
                    justify='start'>

                    {mypics.map(item => {
                        // console.log(mypics)
                        return (

                        <Grid item xs={12} sm={6} md={4}>
                            <Tooltip title={item.title} arrow placement="top">
                                    <Card className={classes.container}>
                                    {item.image.includes('video') ?
                                        <CardMedia
                                            component='video'
                                            controls
                                            className={classes.video}
                                            image={item.image}
                                        />
                                        :
                                        <CardMedia
                                            component='img'
                                            className={classes.image}
                                            image={item.image}
                                            onClick={() => clickImageHandler(item.image)}
                                        />
                                    }
                                    </Card>
                            </Tooltip>
                        </Grid>
                        )
                        })
                    } 
                </Grid>

            {status ? <AlertMassage key={status.key} message={status.msg} /> : null}
        </>
    )
}


export default Profile