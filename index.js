const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

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
            const products = await cursor.toArray();
            res.send(products);
        });
        // get one product
        app.get('/cars/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const car = await carCollection.findOne(query);
            res.send(car);
        });
        // app.get('/service/:id', async (req, res) => {
        //     const id = req.params.id;
        //     console.log(id);
        //     const query = { _id: ObjectId(id) };
        //     const service = await serviceCollection.findOne(query);
        //     res.send(service);
        // });

    }
    finally { };
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('hi')
});

app.listen(port, () => {
    console.log('listening')
})