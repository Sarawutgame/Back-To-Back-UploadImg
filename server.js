require("dotenv").config();
const aws = require('aws-sdk');
const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
const uuid = require('uuid').v4;
// const MongoClient = require('mongodb').MongoClient
const path = require('path');

const app = express();
const cors = require('cors');
app.use(cors())

const s3 = new aws.S3({apiVersion: '2006-03-01'});

const upload = multer({
    storage: multerS3({
        s3,
        bucket: 'postimagebucket',
        acl: 'public-read',
        metadata: (req, file, cb) => {
            console.log(file);
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            cb(null, `${uuid()}${ext}`);
        }
    })
});
const uploadProfile = multer({
    storage: multerS3({
        s3,
        bucket: 'profileuser-image-buckect',
        acl: 'public-read',
        metadata: (req, file, cb) => {
            console.log(file);
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            cb(null, `${uuid()}${ext}`);
        }
    })
});

// To connect with your mongoDB database
const mongoose = require("mongoose");
mongoose
  .connect("mongodb://34.194.191.197:27017", {
    dbName: 'back2back',
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 30000,
  })
  .then(() => console.log("Connected to Your_db database"))
  .catch((err) => console.log(err));

// Schema for users of app
const UserSchema = new mongoose.Schema({
    imgPath: {
      type: String,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      unique: true,
    },
    faculty: {
      type: String,
      required: true,
    },
    ig: {
      type: String,
    },
    fb: {
      type: String,
    },
    twit: {
      type: String,
    },
    line: {
      type: String,
    }
});
const ItemSchema = new mongoose.Schema({
    imagePath: {
        type: String,
    },
    name: {
        type: String,
    },
    type: {
        type: String,
    },
    desc: {
        type: String,
    },
    tag: {
        type: String,
    },
    price: {
        type: String,
    },

})
const PostSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
  },
  desc: {
    type: String,
  },
  imgPath: {
    type: String,
  },
  like: {
    type: Number,
  },
  comments: {
    type: Array,
  },
  time: {
    type: Date,
    default: Date.now,
  }
})

const User = mongoose.model("users", UserSchema);
const Item = mongoose.model("item", ItemSchema);
const Post = mongoose.model("post", PostSchema);

User.createIndexes();
Item.createIndexes();
Post.createIndexes();

mongoose.connection.on(
    "error",
    console.error.bind(console, "MongoDB connection error:")
);

app.use(express.json({ limit: "300mb" }));

// app.use(express.static('public'));

app.get("/", (req, res) => {
  res.send("app is running")
})

app.get("/userById/:id", async (req, res) => {
  try {
    console.log(req.body.userId)
    const user = await User.findById(req.params.id);
    console.log(user);
    res.send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error finding user");
  }
});


app.post("/register", async (req, resp) => {
    try {
      const user = new User(req.body);
      let result = await user.save();
      result = result.toObject();
      if (result) {
        delete result.password;
        resp.send(req.body);
        console.log(result);
      } else {
        console.log({status: "User already registered"});
      }
    } catch (e) {
      console.log(e);
      resp.send({status: "Something Went Wrong"});
    }
});

app.post("/createItem", async (req, res) => {
    try{
        const item = new Item(req.body);
        let result = await item.save();
        // console.log(item);
        console.log(req.body);
        result = result.toObject();
        if (result) {
            res.send(req.body);
            // console.log(result);
        } else {
            console.log({status: "Can't create item"});
        }
    } catch (e) {
        console.log(e);
        res.send({status: "Something went wrong"});
    }
})

app.post("/createPost", async (req, res) => {
  try{
    const post = new Post(req.body);
    let result = await post.save();
    result = result.toObject();
    if (result) {
      res.send(req.body);
    } else {
      console.log("Can't create post");
    }
  } catch (e) {
    console.log(e);
    res.send("Something went wrong");
  }
})

app.post('/upload', upload.single('avatar'), (req, res) =>{
    // console.log(req.body);
    // console.log(req.file.location);
    return res.send({fileurl:req.file.location});

});

app.post('/uploadProfile', uploadProfile.single('avatar'), (req, res) => {
  return res.send({fileurl: req.file.location});
})


app.listen(3005, () => console.log('App Is listening'));
