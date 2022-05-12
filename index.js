const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// middleware
app.use(cors());
app.use(express.json());

// connect with mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@carzone.jfici.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const carCollection = client.db('CarZone').collection('cars');

        // get all products
        app.get('/cars', async (req, res) => {
            const query = {};
            const cursor = carCollection.find(query);
            const cars = await cursor.toArray();
            res.send(cars);
        });
        // get one product
        app.get('/cars/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const car = await carCollection.findOne(query);
            res.send(car);
        });

        // delete
        app.delete('/cars/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const car = await carCollection.deleteOne(query);
            res.send(car);
        });

        // Add new
        app.post('/cars', async (req, res) => {
            const newCar = req.body;
            const car = await carCollection.insertOne(newCar);
            res.send(car);
        })

        // update
        app.put('/cars/:id', async (req, res) => {
            const id = req.params.id;
            const updatedRestock = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: updatedRestock.quantity,
                }
            };
            const car = await carCollection.updateOne(filter, updatedDoc, options);
            res.send(car);

        });

        // sort api
        app.get('/cars', async (req, res) => {
            const email = req.query.email;
            console.log(email);
            const query = { email: email };
            const cursor = carCollection.find(query);
            const car = await cursor.toArray();
            res.send(car);

        });

    }
    finally { };
};

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('hi')
});

app.listen(port, () => {
    console.log('listen to port', port)
});