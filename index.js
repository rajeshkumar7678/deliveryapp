const express=require("express")
const { connection } = require("./config/db")
const { foodroute } = require("./routes/ruotes")
const swaggerJSdoc=require("swagger-jsdoc")
const swaggerUI=require("swagger-ui-express")

require("dotenv").config()
const app=express()
const port=process.env.port || 5555
app.use(express.json())

const options={
    definition:{
        openapi:"3.0.0",
        info:{
            title:"Learning Swagger",
            version:"1.0.0"
        },
        servers:[
            {
                url:"http://localhost:5555"
            }
        ]
    },
    apis:["./routes/*.js"]
}
//specification
const swaggerSpec= swaggerJSdoc(options)
//building UI
app.use("/documentation",swaggerUI.serve,swaggerUI.setup(swaggerSpec))

app.get("/",(req,res)=>{
    res.send("home route")
})

app.use("/api",foodroute)






app.listen(port,async()=>{
    try {
        await connection
        console.log("database is connected")
    } catch (error) {
        console.log(error)
    }
    console.log(`server is running ${port}`)
})