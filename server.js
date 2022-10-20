const express = require("express");
const app = express();
const axios = require("axios")
const {getDataFromRedis, setDataInRedis} = require("./config/redis");
const REDIS_KEY = 'user_data_key';
require('dotenv').config()
const Port = process.env.PORT;
const db = require('./db/index')
app.use(express.json())
//Retrive data from an external API

//Get restaurants
app.get("/api/v1/restaurants",async(req, res)=>{
try{
    const results = await db.query('select * from restaurants');
    console.log(results)
    res.status(200).json({
        status: "success",
        results : results.rows.length,
      data:{
        restaurants:results.rows,
      }
        
    })
}catch(error){
    console.log(error)

}
})

//Save restaurants data on redis

async function fetchRestaurantData(){
    const userResponse = await axios.get('http://localhost:3005/api/v1/restaurants')
console.log("Request sent to external API")
return userResponse.data
}

async function getRestaurantData(req, res){
    let results;
    let dataFromCache =false
    try{
        const cachedResult = await getDataFromRedis(REDIS_KEY);
        if(cachedResult){
            dataFromCache= true;
            results = JSON.parse(cachedResult);
        }else{
            results = await fetchRestaurantData();
            if(results.length===0){
                throw 'API return empty data'
            }
            await setDataInRedis(REDIS_KEY, results);

        }
        res.send({
            dataFromCache:dataFromCache,
            result: results
        })
    }catch(error){
        console.error(error);
        res.status(404).send("Data not found")
    }
}

app.get("/api/redis/restaurants", getRestaurantData)







//Get Restaurants by its ID
app.get("/api/v1/restaurant/:id",async(req, res)=>{

    try{
        let result = await db.query("select * from restaurants where id = $1",[req.params.id]);
      //select * from restaurants where id = req.params.id
      
        res.status(200).json({
            status:"success",
            size: result.rows.length,
            data:{
                restaurant: result.rows,
            }
           })
    }
    catch(error){

    }
   console.log(req.params)

})
//Create Restaurab=nts
app.post("/api/v1/restautrent",async(req, res)=>{

    try{
        const result = await db.query("INSERT INTO restaurants (name, location, price_range) VALUES ($1,$2,$3) returning *",[req.body.name,req.body.location,req.body.price_range])
          res.status(201).json({
            status: 201,
            message: "Successfully created restaurant",
            data:{
                restaurant: result.rows[0],
            }
          })
    }
    catch(error){
        console.error("data not created", error)
    }
 
})
//Update Restaurants
app.put("/api/v1/restaurant/:id",async(req, res)=>{
try{
    const result = await db.query("UPDATE restaurants SET name = $1, location = $2,price_range = $3  WHERE ID = $4 returning *",[req.body.name,req.body.location,req.body.price_range, req.params.id])
    res.status(204).json({
        status: 204,
        message: "Successfully Updated",
        data:{
            reataurant: result.rows

        }
    })
}
catch(error){
    console.error("can't update", error)
}
})
//Delete Restaurants
app.delete("/api/v1/restaurant/:id",async(req, res)=>{
try{
    const result =await db.query("DELETE FROM restaurants WHERE ID = $1",[req.params.id]);
    res.status(202).json({
       status: 202,
       message: `Successfully deleted Id ${req.params.id}`
    })
}catch(error){
    console.log("error on deleting")
}
})
app.listen(Port,()=>{
    console.log(`http://localhost:${Port}`)
})

//2.03.10