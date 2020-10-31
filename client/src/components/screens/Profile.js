import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../App'
import AlertMassage from "../shared/AlertMessage"

import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles( theme => ({
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
    large: {
        width: theme.spacing(15),
        height: theme.spacing(15),
    }
}))

const Profile = () => {
    const classes = useStyles();
    const { state, dispatch } = useContext(UserContext)
    const [mypics, setMyPics] = useState([])
    const [image, setImage] = useState("")
    const [status, setStatusBase] = useState("");

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

    const updatePhoto = (file) => {
        setImage(file)
        setStatusBase({ msg: "Photo updated", key: Math.random() });
    }

    const clickImageHandler = () => {
        alert('image modal shows up')
    }


    return (
        <>
                <div style={{ 
                    display: "flex", 
                    flexDirection: 'row', 
                    justifyContent: "space-around",
                    alignItems:"center",
                    flexWrap: 'wrap',
                    marginBottom: '2rem'
                    }}>

                    <div>
                    <Tooltip title={state && state.name} arrow placement="right">
                        <Avatar src={state && state.pic} className={classes.large} alt="" />     
                    </Tooltip>
                    <input type='file' onChange={(e) => updatePhoto(e.target.files[0])}/>
                        
                    </div>
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
                        console.log(mypics)
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
                                                onClick={() => clickImageHandler()}
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