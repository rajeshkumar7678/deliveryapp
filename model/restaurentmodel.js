const mongoose=require("mongoose")

const restaurentschema=mongoose.Schema({
    name: String,
    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        zip: String
    },
    menu: [{
        name: String,
        description: String,
        price: Number,
        image: String
    }]
})

const restaurentmodel=mongoose.model("restaurent",restaurentschema)

module.exports={
    restaurentmodel
}