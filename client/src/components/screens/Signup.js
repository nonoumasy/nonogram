import React, {useState, useEffect} from 'react'
import { Link, useHistory} from 'react-router-dom'
import {useForm} from 'react-hook-form'
import axios from 'axios'

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import '../../App.css'

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const Signup = () => {
    const classes = useStyles()
    const history = useHistory()
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [image, setImage] = useState("")
    const [url, setUrl] = useState(undefined)
    const {register, handleSubmit, errors} = useForm()

    useEffect(() => {
        if (url) {
            uploadFields()
        }
    }, [url])

    const uploadPic = () => {
        const data = new FormData()
        data.append('file', image)
        data.append('upload_preset', 'nonogram')
        data.append('cloud_name', 'nonoumasy')

        // posting to cloudinary 
        axios.post('https://api.cloudinary.com/v1_1/nonoumasy/image/upload', data)
            .then(result => {
                setUrl(result.data.url)
            })
            .catch(err => console.log(err))
        }

    const uploadFields = () => {
        fetch('signup', {
            method: 'post',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password,
                pic: url
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    console.log(data.message)
                    history.push('/login')
                }

            })
            .catch(err => console.log(err))
    }

    const postData = () => {
        if (image) {
            uploadPic()
        } else {
            uploadFields()
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                    <form className={classes.form} noValidate onSubmit={handleSubmit(postData)}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete="name"
                                name="name"
                                variant="outlined"
                                required
                                fullWidth
                                id="name"
                                label="name"
                                autoFocus
                                onChange={(e) => setName(e.target.value)}
                                inputRef={register({ required: 'Name is required', minLength: { value: 3, message: 'Name should be atleast 3 characters' } })} 
                                error={!!errors.name}
                                helperText={errors?.name?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                onChange={(e) => setEmail(e.target.value)}
                                inputRef={register({ required: 'Email is required' })}
                                error={!!errors.email}
                                helperText={errors?.email?.message}
                            />
                                {errors.email && <span>{errors.email.message}</span>}
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                onChange={(e) => setPassword(e.target.value)}
                                inputRef={register({ required: 'Password is required', minLength: { value: 6, message: 'Password should be atleast 6 characters' } })}
                                error={!!errors.password}
                                helperText={errors?.password?.message}
                            />
                                {errors.password && <span>{errors.password.message}</span>}
                        </Grid>
                        
                    </Grid>
                        <input
                            type="file"
                            inputRef={register} 
                            onChange={(e) => setImage(e.target.files[0])}
                        />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}>
                        Sign Up
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                                <Link to='Login' variant="body2"> 
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    )
}

export default Signup
