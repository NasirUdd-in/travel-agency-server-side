const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rgaly.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function run() {
    try {
        // waiting for client to connect to database
        await client.connect();
        // declaration of database name{ this is the actual name of database} and database collection{this is like a specific data folder containing the data}

        const database = client.db("bookOne");
        const hotelCollection = database.collection("bookTwo");
        const bookingCollection = database.collection("bookThree");


        // const database = client.db("chisfisdb");
        // const hotelCollection = database.collection("hotels");
        // const bookingCollection = database.collection("bookings");
        // Get ALL HOTELS API
        app.get("/hotels", async (req, res) => {
            const cursor = hotelCollection.find({});
            const hotels = await cursor.toArray();
            res.send(hotels);
        });
        // Get ALL BOOKING API
        app.get("/booking", async (req, res) => {
            const cursor = bookingCollection.find({});
            const bookings = await cursor.toArray();
            res.send(bookings);
        });
        //GET SINGLE HOTEL API
        app.get("/hotels/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const hotel = await hotelCollection.findOne(query);
            res.send(hotel);
            // console.log(hotel);
        });
        // POST ADD HOTEL API
        app.post("/hotels", async (req, res) => {
            const newHotel = req.body;
            const result = await hotelCollection.insertOne(newHotel);
            res.json(result);
            // console.log("Hitting the post", result);
        });
        //BOOKING API
        app.post("/booking", async (req, res) => {
            const newBooking = req.body;
            const result = await bookingCollection.insertOne(newBooking);
            res.json(result);
            // console.log("Hitting the post", result);
        });
        // UPDATE STATUS OF BOOKING
        app.put("/booking/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const newStatus = req.body;
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: newStatus.status,
                },
            };
            const result = await bookingCollection.updateOne(
                filter,
                updateDoc,
                options
            );
            // console.log("updating user", id);
            res.send(result);
        });
        // DELETE SINGLE HOTEL API
        app.delete("/hotels/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await hotelCollection.deleteOne(query);
            res.send(result);
            // console.log("Deleting user with id :", id);
            // console.log("Result :", result);
        });
        // DELETE SINGLE BOOKING API
        app.delete("/booking/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookingCollection.deleteOne(query);
            res.send(result);
            // console.log("Deleting user with id :", id);
            // console.log("Result :", result);
        });
    } finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Server for Nasir Travel Agency is running");
});

app.listen(port, (req, res) => {
    console.log("Server running on port ", port);
});
