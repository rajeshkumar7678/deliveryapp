const express=require("express")
const { ordermodel } = require("../model/ordermodel")

const orderroute=express.Router()


orderroute.get("/",(req,res)=>{
    res.send("order route")
})

orderroute.post("/",async(req,res)=>{
    try {
        let payload=req.body
        let order=new ordermodel(payload)
        await order.save()
        res.status(200).send("order added")
    } catch (error) {
        console.log(error)
    }
})


orderroute.get("/:id",async(req,res)=>{
    try {
       let {id}=req.params
        let order=await ordermodel.findOne({_id:id})
        
        res.status(200).send({"order":order})
    } catch (error) {
        console.log(error)
    }
})

orderroute.put("/:id",async(req,res)=>{
    try {
        let {id}=req.params
        let {status}=req.body
        let order=await ordermodel.findOne({_id:id})
        order.status=status
        await order.save()
        
        res.status(200).send({"msg":"atatus uppdated"})
    } catch (error) {
        console.log(error)
    }
})





module.exports={
    orderroute
}