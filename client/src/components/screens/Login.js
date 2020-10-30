import React, { useState, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { UserContext} from '../../App'
import AlertMassage from "./AlertMessage"

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card'
import Button from '@material-ui/core/Button'
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import PersonIcon from '@material-ui/icons/Person';
import LockIcon from '@material-ui/icons/Lock'; 

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        height: 300,
        maxWidth: 300,
        margin: '30px auto',
        padding: theme.spacing(6)
    }, 
    margin: {
        // margin: theme.spacing(2),
        
    },
}))

const Login = () => {
    const classes = useStyles();
    const history = useHistory()
    const {state, dispatch} = useContext(UserContext)

    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [status, setStatusBase] = useState("");
    const [open, setOpen] = useState(false)

    const postData = () => {

        fetch('/login', {
            method: 'post',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        }
        )
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    setStatusBase({ msg: "Something went wrong", key: Math.random() })
                } else {
                    localStorage.setItem('jwt', data.token)
                    localStorage.setItem('user', JSON.stringify(data.user))
                    dispatch({ type: 'USER', payload: data.user })
                    setStatusBase({ msg: "Success", key: Math.random() });
                    history.push('/')
                }
            })
            .catch(err => console.log(err))
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    }

    return (
        <Card className={classes.root}>
            <Typography variant='h6' align="center">
                Login
            </Typography>

            <TextField
                className={classes.margin}
                type='email'
                placeholder='Email'
                fullWidth
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <PersonIcon fontSize='small'/>
                        </InputAdornment>
                    ),
                }}
            />
            <TextField
                className={classes.margin}
                fullWidth
                type='password'
                placeholder='Password'
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <LockIcon fontSize='small'/>
                        </InputAdornment>
                    ),
                }}
            />
            <Button 
                variant='contained'  
                onClick={() => postData()}
                disableElevation
                fullWidth
                >
                Login
            </Button>
            <Typography align='center'>
                <Link to='Signup'>Don't have an account?</Link>
            </Typography>

            {status ? <AlertMassage key={status.key} message={status.msg} /> : null}

            
        </Card>

    )
}

export default Login
