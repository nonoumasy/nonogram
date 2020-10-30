import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../App'
import { useParams } from 'react-router-dom'
import Card from '@material-ui/core/Card';
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress'
import Tooltip from '@material-ui/core/Tooltip';


import '../../App.css'

const useStyles = makeStyles( theme => ({
    gridContainer: {
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
        height: '22rem',
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
    const [userProfile, setUserProfile] = useState(null)
    const { state, dispatch } = useContext(UserContext)
    const { userid } = useParams()
    const [showfollow, setShowFollow] = useState(true)  

    useEffect(() => {
        setShowFollow(state && !state.following.includes(userid))
    }, state)

    useEffect(() => {
        fetch(`/user/${userid}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                setUserProfile(result)
            })
    }, [])


    const followUser = () => {
        fetch('/follow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                followId: userid
            })
        }).then(res => res.json())
            .then(data => {

                dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })
                localStorage.setItem("user", JSON.stringify(data))
                setUserProfile((prevState) => {
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: [...prevState.user.followers, data._id]
                        }
                    }
                })
                setShowFollow(false)
            })
    }
    const unfollowUser = () => {
        fetch('/unfollow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                unfollowId: userid
            })
        }).then(res => res.json())
            .then(data => {

                dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })
                localStorage.setItem("user", JSON.stringify(data))

                setUserProfile((prevState) => {
                    const newFollower = prevState.user.followers.filter(item => item !== data._id)
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: newFollower
                        }
                    }
                })
                setShowFollow(true)
            })
    }

    const clickImageHandler = () => {
        alert('image modal shows up')
    }
    return (
        <>
            { userProfile ?
                <>


                    <div style={{
                        display: "flex",
                        flexDirection: 'row',
                        justifyContent: "space-around",
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        marginBottom: '40px'
                    }}>

                        <div>
                            <img style={{ width: "160px", height: "160px", borderRadius: "80px", objectFit: 'cover'}}
                            src={userProfile.user.pic}
                            alt=''
                            />
                            
                        </div>

                        <div>
                            <Typography variant='h4'>
                                {userProfile.user.name}
                            </Typography>
                            <Typography variant='h6'>
                                    {userProfile.user.email}
                            </Typography>
                            
                            <div style={{ 
                                display: "flex", 
                                justifyContent: "space-between"
                                }}>
                                    <Typography variant='body'>
                                        {userProfile.posts.length} posts  
                                    </Typography>
                                    <Typography variant='body'>
                                        {userProfile.user.followers.length} followers  
                                    </Typography>
                                    <Typography variant='body'>
                                        {userProfile.user.following.length} following  
                                    </Typography>
                            </div>
                            <div style={{margin: '16px 0'}}>
                                    {showfollow ?
                                        <Button 
                                            onClick={() => followUser()}
                                            variant='contained'
                                            disableElevation
                                            >
                                            Follow
                                        </Button>
                                        :
                                        <Button 
                                            onClick={() => unfollowUser()}
                                            variant='contained'
                                            disableElevation
                                            >
                                            UnFollow
                                        </Button>
                                    }
                            </div>
                        </div>  
                    </div>
                    
                    <Grid
                        container
                        spacing={2}
                        className={classes.gridContainer}
                        justify='start'>

                        {userProfile.posts.map(item => {
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

                    
                </>
                : 
                <div>
                    <LinearProgress className={classes.line} />
                </div>
                }

        </>
    )
}


export default Profile