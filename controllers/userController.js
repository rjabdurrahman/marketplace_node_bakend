const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Profile = require("../models/Profile");
const User = require("../models/User");
const Invitation = require("../models/Invitations");
const Post = require("../models/Post");

exports.register = (req, res) => {
    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const newUser = new User(req.body);
        console.log('UserId', newUser._id);
        const newProfile = new Profile({ user: newUser._id });
        // Hash password before saving in database
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser
                    .save()
                    .then(user => {
                        newProfile.save();
                        res.json(user);
                    })
                    .catch(err => res.send(err.message));
            });
        });
    });
};

exports.login = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Find user by username
    User.findOne({ username }).then(user => {
        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: "No user registed in this mail!" });
        }
        // Check password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // User matched
                // Create JWT Payload
                const payload = {
                    id: user.id,
                    username: user.username,
                    type: user.type
                };
                // Sign token
                jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN },
                    (err, token) => {
                        res.json({
                            type: user.type,
                            username: user.username,
                            token: "Bearer " + token
                        });
                    }
                );
            }
            else {
                return res.status(400).json({ message: "Password Incorrect!" });
            }
        });
    });
}

exports.getAll = (req, res) => {
    User.find({ type: 2 })
        .then(data => {
            res.send(data);
        })
        .catch(err => console.log(err));
}


exports.createInvitation = (req, res) => {
    let invitation = new Invitation(req.body);
    invitation.save()
        .then(data => res.json({ "msg": "Invitation Sent" }))
        .catch(err => res.send(err));
}


exports.getAllInvitation = (req, res) => {
    Invitation.find({ username: req.user.username })
        .then(inv => {
            if (inv) {
                let postsList = [];
                inv.forEach(x => {
                    Post.findById(x.post)
                        .then(function (post) {
                            postsList.push(post);
                            res.json(postsList);
                        });
                });
            }
            else res.json(inv);
        })
        .catch(err => res.json(err));
}