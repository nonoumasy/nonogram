import React, {useState, useEffect} from 'react'
import { Link, useHistory} from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import '../../App.css'

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

const Signup = () => {
    const classes = useStyles()
    const history = useHistory()
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [image, setImage] = useState("")
    const [url, setUrl] = useState(undefined)

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
        fetch('https://api.cloudinary.com/v1_1/nonoumasy/image/upload',
            {
                method: "post",
                body: data
            })
            .then(res => res.json())
            .then(data => setUrl(data.url))
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
        }
        )
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
            <Card className={classes.root}>
                <Typography variant='h6' align="center">
                    Signup
                </Typography>
                <TextField
                    className={classes.margin}
                    type='text'
                    placeholder='name'
                    value={name}
                    fullWidth
                    onChange={(e) => setName(e.target.value)}
                />
                <TextField
                    className={classes.margin}
                    type='email'
                    placeholder='email'
                    value={email}
                    fullWidth
                    onChange={(e) => setEmail(e.target.value)}
                />
                
                <TextField
                    className={classes.margin}
                    type='password'
                    placeholder='password'
                    value={password}
                    fullWidth
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Button fullwidth>
                    <input

                        type="file"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </Button>

                    
                <Button 
                variant='contained'
                disableElevation
                fullWidth
                onClick={() => postData()}>
                    SignUp
                </Button>

                <Link to='Login'> Already have an account?</Link>
            </Card>

    )
}

export default Signup
