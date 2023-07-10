const express=require("express")
const { restaurentmodel } = require("../model/restaurentmodel")

const restroute=express.Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     resturantschema:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         address:
 *           type: Object
 *         menu:
 *           type: Array
 */

/**
 * @swagger
 * /api/restaurants:
 *   get:
 *     summary: This route is get all the resturant from database.
 *     responses:
 *       200:
 *         description: The list of all the resturant.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/resturantschema'
 */
restroute.get("/",async(req,res)=>{
    try {
        let reestaurentts=await restaurentmodel.find()
        res.status(200).send({"reataurents":reestaurentts})
        
    } catch (error) {
        console.log(error)
    }
    
})


/**
 * @swagger
 * /api/restaurants/:id:
 *   get:
 *     summary: This route is get all the resturant from database.
 *     responses:
 *       200:
 *         description: The list of all the resturant.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/resturantschema'
 */
restroute.get("/:id",async(req,res)=>{
    try {
        let{id}=req.params
        let reestaurentts=await restaurentmodel.findOne({_id:id})
        res.status(200).send({"reataurents":reestaurentts})
        
    } catch (error) {
        console.log(error)
    }
    
})


/**
 * @swagger
 * /api/restaurants/:id/menu:
 *   get:
 *     summary: This route is get all the resturant from database.
 *     responses:
 *       200:
 *         description: The list of all the menu.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/resturantschema'
 */
restroute.get("/:id/menu",async(req,res)=>{
    try {
        let{id}=req.params
        let reestaurentts=await restaurentmodel.findOne({_id:id})
        res.status(200).send({"menu":reestaurentts.menu})
        
    } catch (error) {
        console.log(error)
    }
    
})

// restroute.get("/:id/menu",async(req,res)=>{
//     try {
//         let{id}=req.params
//         let reestaurentts=await restaurentmodel({_id:id})
//         res.status(200).send({"reataurents":reestaurentts.menu})
        
//     } catch (error) {
//         console.log(error)
//     }
    
// })

/**
 * @swagger
 * /api/restaurants/:id/menu:
 *  post:
 *      summary: To add a new resturant menu to the database
 *      tags: [posts]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/resturantschema'
 *      responses:
 *          200:
 *              description: The menu was successfully added.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/resturantschema'
 *          500:
 *              description: Some server error
 */
restroute.put("/:id/menu",async(req,res)=>{
    try {
        let{id}=req.params
        let payload=req.body
        let restaurents=await restaurentmodel.findOne({_id:id})
        
        restaurents.menu.push(payload)
        await restaurents.save()
        //console.log(restaurents,payload)

        res.status(200).send("menu added in restaurent")
        
    } catch (error) {
        console.log(error)
    }
    
})
/**
* @swagger
* /api/restaurants/:id/menu/:id:
*   delete:
*     summary: To delete a menu from the database
*     tags: [posts]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/resturantschema'
*     responses:
*       200:
*         description: The menu was successfully deleted.
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/resturantschema'
*       404:
*         description: The specified user ID does not exist.
*       500:
*          description: Some server error
*/
restroute.delete("/:id/menu/:menuid",async(req,res)=>{
    try {
        let{id,menuid}=req.params
        //let filtered=[]
        let restaurents=await restaurentmodel.findOne({_id:id})
        let menu=restaurents.menu
        //console.log(menu)
        let filtered=menu.filter((ele)=>{
            if(ele._id==menuid){
                return false
            }else{
                return true
            }
        })
        //console.log(filtered)
        restaurents.menu=filtered
        await restaurents.save()


        res.status(200).send("menu deleted in restaurent")
        
    } catch (error) {
        console.log(error)
    }
    
})





module.exports={
    restroute
}
