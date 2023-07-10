const express=require("express")
const { usermodel } = require("../model/usermodel")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const { restroute } = require("./restaurents")
const { orderroute } = require("./order")


const foodroute=express.Router()

foodroute.get("/",async(req,res)=>{
    let user=await usermodel.find()
    res.send({"user":user})
})
/**
 * @swagger
 * components:
 *   schemas:
 *     userschema:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         address:
 *           type: Object
 */

/**
 * @swagger
 * /api/register:
 *  post:
 *      summary: To add a new user to the database
 *      tags: [posts]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/userschema'
 *      responses:
 *          200:
 *              description: The user was successfully added.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/userschema'
 *          500:
 *              description: Some server error
 */

foodroute.post("/register",async(req,res)=>{
    try {
        let {name,email,password,address}=req.body

        let user=await usermodel.findOne({email})
        if(user){
            return res.status(400).send({"msg":"user already present"})
        }

        let hashpass=bcrypt.hashSync(password,7)

        let newuser=new usermodel({name,email,password:hashpass,address})
        await newuser.save()

        res.status(200).send({"msg":"user registration successfull"})

    } catch (error) {
        console.log(error)
    }
})


/**
 * @swagger
 * /api/login:
 *  post:
 *      summary: To add a new user to the database
 *      tags: [posts]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/userschema'
 *      responses:
 *          200:
 *              description: The user was successfully added.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/userschema'
 *          500:
 *              description: Some server error
 */
foodroute.post("/login",async(req,res)=>{
    try {
        let {email,password}=req.body
        let user=await usermodel.findOne({email})
        if(!user){
            return res.status(201).send({"msg":"register first then login"})
        }
        let hashpass=bcrypt.compare(password,user.password)
        if(!hashpass){
            return res.status(201).send({"msg":"password incorrect"})
        }
        const token=jwt.sign({id:user._id},"masai",{expiresIn:"6h"})

        res.status(201).send({"msg":"login successfull","token":token})
    } catch (error) {
        console.log(error)
    }
})

/**
 * @swagger
 * /api/user/:id/reset:
 *   put:
 *     summary: To update a user in the database
 *     tags: [posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/userschema'
 *     responses:
 *       200:
 *         description: The user was successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/userschema'
 *       404:
 *         description: The specified user ID does not exist.
 *       500:
 *         description: Some server error
 */
foodroute.put("/user/:id/reset",async(req,res)=>{
    try {
        let {id}=req.params
        let {password,newpassword}=req.body
        //console.log(id)
        let user=await usermodel.findOne({_id:id})
        //console.log(user)
        if(!user){
            return res.send("user not found")
        }
        let hashpass=bcrypt.compare(password,user.password)
        //console.log(hashpass)
        if(!hashpass){
            return res.send("password incorrect")
        }
        let hashnewpass=bcrypt.hashSync(newpassword,7)
        user.password=hashnewpass
        await user.save()

        res.status(204).send({"msg":"password update successfull"})

    } catch (error) {
        console.log(error)
    }
})


foodroute.use("/restaurents",restroute)

foodroute.use("/orders",orderroute)


// foodroute.post("/register",async(req,res)=>{
//     try {
        
//     } catch (error) {
//         console.log(error)
//     }
// })










module.exports={
    foodroute
}