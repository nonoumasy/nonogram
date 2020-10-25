import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../App'

import '../../App.css'

const Profile = () => {
    const [mypics, setMyPics] = useState([])
    const {state, dispatch } = useContext(UserContext)
    const [image, setImage] = useState("")

    // console.log('this is state', state)

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
                        // console.log(result)
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

        <div style={{ maxWidth: "65%", margin: "0px auto" }}>

            {/* top */}
            <div style={{margin: "18px 0px"}}>
                <div style={{display: "flex", justifyContent: "space-around"}}>
                    <div>
                        <img style={{ width: "160px", height: "160px", borderRadius: "80px", objectFit: 'cover' }}
                            src={state ? state.pic : "loading"}
                            alt=''/>
                    </div>
                
                    <div>
                        <h4>{state ? state.name : "loading"}</h4>
                        <h5>{state ? state.email : "loading"}</h5>
                        <div style={{ display: "flex", justifyContent: "space-between", width: "108%"}}>
                            <h6>{mypics.length} posts</h6>
                            <h6>{state ? state.followers.length : "0"} followers</h6>
                            <h6>{state ? state.following.length : "0"} following</h6>
                        </div>
                    </div>
                </div>
            </div>

            <div className="file-field input-field">
                <div className="btn ">
                    <span>Update pic</span>
                    <input type="file" onChange={(e) => updatePhoto(e.target.files[0])} />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>     

            {/* Gallery */}
            <div className="gallery">
                {
                mypics.map(item => {
                    return (
                        <img key={item._id} className="item" src={item.image} alt={item.title} />
                    )
                })
                }
            </div>
        </div>
    )
}


export default Profile