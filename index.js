const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.pr3rbd0.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const blogCollection = client.db("blogDB").collection("blogs");

    app.post("/blogs", async (req, res) => {
      const newBlog = req.body;
      console.log(newBlog);
      const result = await blogCollection.insertOne(newBlog);
      res.send(result);
    });

    app.get("/blogs", async (req, res) => {
      const result = await blogCollection.find({}).toArray();
      res.send(result);
    });

    app.get("/blogs/:id", async (req, res) => {
      const blogid = req.params.id;
      const filter = { _id: new ObjectId(blogid) };
      const result = await blogCollection.findOne(filter);
      res.send(result);
    });

    app.put("/blogs/:id", async (req, res) => {
      const updateBlog = req.body;
      const blogId = req.params.id;
      const filter = { _id: new ObjectId(blogId) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          title: updateBlog.title,
          description: updateBlog.description,
        },
      };

 
      const result = await blogCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });


    app.delete("/blogs/:id", async (req, res) => {
        const blogid = req.params.id;
        const filter = { _id: new ObjectId(blogid) };
        const result = await blogCollection.deleteOne(filter);
        res.send(result);
      });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
