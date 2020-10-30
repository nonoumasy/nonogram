const router = require('express').Router()
const Post = require('../models/post')
const checkAuth = require('../middleware/checkAuth')

router.get('/allpost', checkAuth, (req, res) => {
    Post.find()
        .populate("postedBy", "_id name pic")
        .populate("comments.postedBy", "_id name")
        .sort('-createdAt')
        .then((posts) => {
            res.json({ posts })
        }).catch(err => {
            console.log(err)
        })
})

router.get('/getsubpost', checkAuth, (req, res) => {

    // if postedBy in following
    Post.find({ postedBy: { $in: req.user.following } })
        .populate("postedBy", "_id name pic")
        .populate("comments.postedBy", "_id name pic")
        .sort('-createdAt')
        .then(posts => {
            res.json({ posts })
        })
        .catch(err => {
            console.log(err)
        })
})

router.post('/create', checkAuth, (req, res) => {
    const { title, body, image} = req.body
    if (!title || !body || !image) {
        res.status(400).json({error: 'Please add all fields.'})
    }

    req.user.password = undefined

    const post = new Post({
        title,
        body,
        image,
        postedBy: req.user
    })

    // save post
    post
    .save()
    .then(result => res.send({post: result}))
    .catch(err => console.log(err))
})

router.get('/mypost', checkAuth, (req, res) => {
    Post.find({ postedBy: req.user._id })
        .populate("postedBy", "_id name")
        .then(post => {
            res.json({ post })
        })
        .catch(err => {
            console.log(err)
        })
})


router.put('/like' , checkAuth, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, 
        {$push:{likes: req.user._id}},
        {new: true})
        .populate("postedBy", "_id name pic")
        .populate("comments.postedBy", "_id name")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({error: err})
            } else {
                res.json(result)
            }
        })
})

router.put('/unlike', checkAuth, (req, res) => { 
    Post.findByIdAndUpdate(req.body.postId,
        { $pull: { likes: req.user._id } },
        { new: true })
        .populate("postedBy", "_id name pic")
        .populate("comments.postedBy", "_id name pic")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            } else {
                res.json(result)
            }
        })
})

router.put('/comment', checkAuth, (req, res) => {
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push: { comments: comment }
    }, {
        new: true
    })
        .populate("comments.postedBy", "_id name pic")
        .populate("postedBy", "_id name pic")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            } else {
                res.json(result)
            }
        })
})

router.delete('/deletepost/:postId', checkAuth, (req, res) => {
    Post.findOne({_id: req.params.postId})
    .populate("postedBy", "_id")
    .exec((err,post) => {
        if (err || !post) {
            return res.status(422).json({error: err})
        }
        if (post.postedBy._id.toString() === req.user._id.toString()) {
            post.remove()
            .then(result => {
                res.json(result)
            })
            .catch(err => console.log(err))
        }
    })
})

module.exports = router