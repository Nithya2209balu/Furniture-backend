const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config(); // Load environment variables from .env file

// Create Express app
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB URI from environment variable
const uri = process.env.MONGODB_URI;

// MongoDB client instance
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Async function to connect to MongoDB and start server
async function run() {
try {
// Connect MongoDB client to server
await client.connect();
console.log("Connected to MongoDB!");

// Database and collection
const database = client.db("FurnitureInventory");
const furnitureCollection = database.collection("furnitures");

// Example route: Upload furniture
app.post("/upload-furniture", async (req, res) => {
try {
const data = req.body;
const result = await furnitureCollection.insertOne(data);
res.json(result);
} catch (err) {
console.error("Error uploading furniture:", err);
res.status(500).json({ error: "Failed to upload furniture" });
}
});

//get all furniture from the database
app.get("/all-furnitures",async(req,res)=>{
    const furnitures = furnitureCollection.find();
    const result = await furnitures.toArray();
   res.send(result);
})

//update  furniture
app.patch("/furniture/:id",async(req,res)=>{
    const id=req.params.id;
    const updateFurnitureData=req.body;
    const filter={_id:new ObjectId(id)};
    const options={upsert:true};

    const updateDoc={
        $set:{
            ...updateFurnitureData
        }
    }
    //update
    const result = await furnitureCollection.updateOne(filter,updateDoc,options);
    res.send(result);
})

//delete 
app.delete("/furniture/:id",async(req,res)=>{
    const id=req.params.id;
    const filter={_id:new ObjectId(id)};
    const result=await furnitureCollection.deleteOne(filter);
    res.send(result);
})

//find category
app.get("/all-furnitures",async(req,res)=>{
    let query={};
    if(req.query?.category){
        query={category:req.query.category}
    }
    const result=await furnitureCollection.find(query).toArray();
    res.send(result);
})

//single book
app.get("/furnitures/:id",async(req,res)=>{
    const id = req.params.id;
    const filter = {_id:new ObjectId(id)};
    const result=await furnitureCollection.findOne(filter);
    res.send(result); 
})
// Start listening on specified port
app.listen(port, () => {
console.log(`Server is running on http://localhost:${port}`);
});
} catch (err) {
console.error("Error connecting to MongoDB:", err);
}
}

// Run the server
run().catch(console.error);

