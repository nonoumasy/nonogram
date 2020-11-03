import React, { useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import {useForm} from 'react-hook-form'
import { UserContext} from '../../App'

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(6),
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
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const Login = () => {
    const classes = useStyles();
    const history = useHistory()
    const {state, dispatch} = useContext(UserContext)
    const {register, handleSubmit, errors} = useForm()

    const postData = ({ email, password }) => {
        fetch('/login', {
            method: 'post',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        }).then(res => res.json())
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    localStorage.setItem('jwt', data.token)
                    localStorage.setItem('user', JSON.stringify(data.user))
                    dispatch({ type: 'USER', payload: data.user })
                    history.push('/')
                }
            })
            .catch(err => console.log(err))
    }
    return (
        <>
    <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
            <Avatar className={classes.avatar}>
                <img src={'https://res.cloudinary.com/nonoumasy/image/upload/v1604132149/f40d42588779c6424f0c4abcfdb383ab_htr43v.jpg'} style={{ height: '40px', width: '40px', objectFit: 'cover' }} />
            </Avatar>
            <Typography component="h1" variant="h5">
                Sign in
            </Typography>
                    <form className={classes.form} noValidate
                        onSubmit={handleSubmit(postData)}>
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                type='email'
                name="email"
                autoComplete="email"
                autoFocus
                inputRef={register}
            />
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                inputRef={register}
            />
            <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
            >
                Sign In
            </Button>
            <Grid container>
                <Grid item xs>
                    <Link inputRef="#" variant="body2">
                        `Forgot password?
                    </Link>
                </Grid>
                <Grid item>
                    <Link to='Signup'>Don't have an account?</Link>
                </Grid>
            </Grid>
            </form>
            </div>
            <Box mt={8}>
                
            </Box>
    </Container>

        </>
    )
    
}

export default Login
