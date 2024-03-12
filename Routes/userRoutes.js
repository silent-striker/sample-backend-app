const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

let users_list = [];

// fetch all users
router.get("/users", (req, res) => {
    let users = [];
    try{
        // fetching users from users_list
        for(i=0; i<users_list.length; i++){
            const email = users_list[i].email;
            const firstName = users_list[i].firstName;
            const id = users_list[i].id;

            let userObj = {
                "email": email,
                "firstName": firstName,
                "id": id
            }
            users.push(userObj);
        }
    } catch(err){
        console.log("Error while fetching users list: ", err.message);

        res.status(500);
        res.json({
            "message": "Internal server error, please try again in sometime",
            "success": false
        })
        return res;
    }

    res.status(200);
    if(users.length == 0){
        res.json({
            "message": "No users present",
            "success": true
        })
    }
    else{
        res.json({
            "message": "Users retrieved",
            "success": true,
            "users": users
        });
    }
    return res;
});

// fetch a specific user
router.get("/user/:id", (req, res) => {
    const id = req.params.id;
    let user = null;
    try{
        // fetching users from users_list
        for(i=0; i<users_list.length; i++){
            if(users_list[i].id === id){
                user = {
                    "email": users_list[i].email,
                    "firstName": users_list[i].firstName,
                    "id": users_list[i].id
                };
                break;
            }
        }
    } catch(err){
        console.log("Error while fetching users list: ", err.message);

        res.status(500);
        res.json({
            "message": "Internal server error, please try again in sometime",
            "success": false
        })
        return res;
    }

    // no users present
    if(!user){
        res.status(404);
        res.json({
            "message": "user is not present",
            "success": false
        });
        return res;
    }

    res.status(200);
    res.json({
        "success": true,
        "user": user 
    });
    return res;
});

// adding an user
router.post("/add", (req, res) => {
    // checking request
    if(!req || !req.body || !req.body.email || !req.body.firstName){
        res.status(400);
        res.json({
            "message": "Invalid input provided",
            "success": false
        });
        return res;
    }

    let isInserted = false;

    try{
        const id = uuidv4();
        const email = req.body.email;
        const firstName = req.body.firstName;

        let user = {
            "email": email,
            "firstName": firstName,
            "id": id
        }

        users_list.push(user);

        for(i=0; i<users_list.length; i++){
            if(users_list[i].id === user.id 
                && users_list[i].email === user.email 
                && users_list[i].id === user.id){
                isInserted = true;
                break;
            }
        }
    } catch(err){
        console.log("Error in adding user: ", err.message);

        res.status(500);
        res.json({
            "message": "Internal server error",
            "success": false
        });
        return res;
    }

    if(isInserted){
        res.status(200);
        res.json({
            "message": "User added",
            "success": true
        });
    }
    else{
        // todo: check status code
        res.status(200);
        res.json({
            "message": "User not added, please try again after sometime",
            "success": false
        });
    }
    return res;
});

// updating user information
router.put("/update/:id", (req, res) => {
    // check request
    if(!req || !req.body || (!req.body.email && !req.body.firstName)){
        res.status(400);
        res.json({
            "message": "please provide fields to update",
            "success": false
        });
        return res;
    }

    const email = req.body.email;
    const firstName = req.body.firstName;

    let success = false;

    try{
        const id = req.params.id;
        let requiredUser = null;
        for(i=0; i<users_list.length; i++){
            if(users_list[i].id === id){
                requiredUser = users_list[i];
                break;
            }
        }

        if(requiredUser === null){
            success = false;

            res.status(200);
            res.json({
                "message": "User not found",
                "success": success
            });
            return res;
        }

        if(email || firstName){
            if(email){
                requiredUser.email = email;
            }
            if(firstName){
                requiredUser.firstName = firstName;
            }
            success = true;
        }
    } catch(err){
        console.log("Error in updating user: ", err.message);
        success = false;

        res.status(500);
        res.json({
            "message": "Internal server error",
            "success": success
        });
        return res;
    }

    res.status(200);
    res.json({
        "message": "User updated",
        "success": success
    })
});

module.exports = router;