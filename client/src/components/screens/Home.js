import React, {useState, useEffect, useContext} from 'react'
import { UserContext } from '../../App'
import { Link } from 'react-router-dom'
import { capitalCase } from "capital-case";

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import ThumbUp from '@material-ui/icons/ThumbUp';
import ThumbDown from '@material-ui/icons/ThumbDown';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip'


import '../../App.css'

const useStyles = makeStyles((theme) => ({
    card: {
        maxWidth: 600,
        margin: '30px auto'
    },
    media: {
        height: 600,
        width: '100%',
        objectFit: 'cover'
    },
    small: {
        width: theme.spacing(4),
        height: theme.spacing(4),
    },
    icon: {
        marginTop: '15px'
    }
}))


const Home = ({props}) => {
    const classes = useStyles()
    const [data, setData] = useState([])
    const {state, dispatch} = useContext(UserContext)

    useEffect(() => {
        fetch('/allpost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            }
        })
        .then(res => res.json())
        .then(result => {
            setData(result.posts)
        })
        
    }, [])

    const likePostHandler = (id) => {
        fetch('/like', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }

    const unlikePostHandler = (id) => {
        fetch('/unlike', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        })
            .then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }

    const makeCommentHandler = (text, postId) => {
        fetch('/comment', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId,
                text
            })
        })
            .then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }

    const deletePostHandler = (postid) => {
        fetch(`/deletepost/${postid}`, {
            method: 'delete',
            headers: {
                Authorization: "Bearer " + localStorage.getItem('jwt')
            }
        })
        .then(res => res.json())
        .then(result => {
            // console.log(result)
            const newData = data.filter(item=> {
                return item._id !== result._id
            })
            setData(newData)
        })
        .catch(err => console.log(err))
    }

    return (
        <>
            {data.map(item => { 
                return (
                    <>
                        <Card className={classes.card}>
                            <CardHeader
                                avatar={<Avatar alt="" src={item.postedBy.pic} className={classes.small} />}
                                title={
                                    <Typography variant='h6' style={{fontWeight: 500}}>
                                        <Tooltip title="Go to profile" arrow placement="bottom">
                                            <Link style={{ textDecoration: 'none' }} to={item.postedBy._id !== state._id ? "/profile/" + item.postedBy._id : "/profile"}>
                                                {item.postedBy.name}
                                            </Link>
                                        </Tooltip>
                                    </Typography>
                                    }
                                    
                                action=
                                {
                                    <Tooltip title="Delete Post" arrow placement="bottom">
                                        <IconButton className={classes.icon}>
                                            {item.postedBy._id === state._id && <DeleteIcon onClick={() => deletePostHandler(item._id)} />}
                                        </IconButton>
                                    </Tooltip>
                                    
                                }
                            />
                            <div style={{ marginRight: '2rem' }}></div>
                            {console.log(item)}
                            {
                                (item.image.includes('video')) ?
                                    <CardMedia
                                        component='video'
                                        controls
                                        className={classes.media}
                                        image={item.image}
                                    />
                                    :
                                    <CardMedia
                                        component='img'
                                        className={classes.media}
                                        image={item.image}
                                    />

                            }
                            
                            <CardContent>
                                <IconButton variant="h5">
                                    {item.likes.includes(state._id)
                                        ?
                                        <Tooltip title="unlike this" arrow placement="bottom">
                                            <ThumbDown onClick={() => unlikePostHandler(item._id)} />
                                        </Tooltip>
                                        :
                                        <Tooltip title="like this" arrow placement="bottom">
                                            <ThumbUp onClick={() => likePostHandler(item._id)} />
                                        </Tooltip>
                                        
                                    }
                                </IconButton>
                                <Typography>
                                    {item.likes.length} likes
                                </Typography>
                                <Typography variant="h6">
                                    {capitalCase(item.title)}
                                </Typography>
                                <Typography>
                                    {item.body}
                                </Typography>
                                <br/>                                        
                                {
                                    item.comments.map(record => {
                                        return (
                                            <>
                                                <Typography >
                                                    <span style={{ fontWeight: '700' }}>{record.postedBy.name}</span> {record.text}
                                                </Typography>

                                            </>
                                        )
                                    })
                                }
                                <form onSubmit={(e) => {
                                    e.preventDefault()
                                    makeCommentHandler(e.target[0].value, item._id)
                                    e.target[0].value = ''
                                }}>
                                    <TextField
                                        id="standard-full-width"
                                        label="Comment"
                                        placeholder='Add a comment'
                                        fullWidth />
                                </form>
                            </CardContent>
                        </Card>
                    </>  
                )
            })
        }
        </>
    )
}

export default Home
