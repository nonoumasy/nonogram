import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../App'
import { useParams } from 'react-router-dom'
import Footer from './Footer'
import Card from '@material-ui/core/Card';
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CardMedia from '@material-ui/core/CardMedia';

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
    return (
        <>
            { userProfile ?
                <>
                <div className='profile-container'>

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
                            <h4>{userProfile.user.name}</h4>
                            <h5>{userProfile.user.email}</h5>
                            <div style={{ 
                                display: "flex", 
                                justifyContent: "space-between"
                                }}>
                                <h6>{userProfile.posts.length} posts</h6>
                                <h6>{userProfile.user.followers.length} followers</h6>
                                <h6>{userProfile.user.following.length} following</h6>
                            </div>
                            <div style={{margin: '16px 0'}}>
                                    {showfollow ?
                                        <button className="btn waves-effect waves-light"
                                            onClick={() => followUser()}
                                        >
                                            Follow
                                        </button>
                                        :
                                        <button
                                            className="btn waves-effect waves-light"
                                            onClick={() => unfollowUser()}
                                        >
                                            UnFollow
                                        </button>
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

                : <h2>loading...!</h2>}

        </>
    )
}


export default Profile