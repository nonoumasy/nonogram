import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../App'
import Footer from './Footer'
import Card from '@material-ui/core/Card';
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';


import '../../App.css'

const useStyles = makeStyles({
    gridContainer: {
    },
    media: {
        height: 240,
        paddingTop: '60%'
    }
});

const Profile = () => {
    const classes = useStyles();
    const [mypics, setMyPics] = useState([])
    const {state, dispatch } = useContext(UserContext)
    const [image, setImage] = useState("")

    useEffect(() => {
        fetch('/mypost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
            })
            .then(res => res.json())
            .then(result => setMyPics(result.post) )
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
    }

    return (
        <>
            <div className='profile-container'>

                <div style={{ 
                    display: "flex", 
                    flexDirection: 'row', 
                    justifyContent: "space-around",
                    alignItems:"center",
                    flexWrap: 'wrap',
                    marginBottom: '2rem'
                    }}>
                    <div>
                        <img style={{ width: "160px", height: "160px", borderRadius: "80px", objectFit: 'cover' }}
                            src={state ? state.pic : "loading"}
                            alt='' />
                        <div>
                            <input type="file" onChange={(e) => updatePhoto(e.target.files[0])} />
                        </div>

                    </div>
                    <div>
                        <Typography variant='h4'>    
                            {state ? state.name : "loading"}
                        </Typography>
                        <Typography variant='h6'>    
                            {state ? state.email : "loading"}
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
                        return (
                        <Grid item xs={12} sm={6} md={4}>
                            <Card >
                                <CardMedia 
                                    className={classes.media}
                                    image={item.image}
                                    />
                            </Card>
                        </Grid>
                        )
                    })
                    } 
                </Grid>
            </div>
            <Footer />
        </>
    )
}


export default Profile