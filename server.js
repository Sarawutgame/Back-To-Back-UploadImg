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

aws.config.update({
    region: 'us-east-1',
    aws_access_key_id:'ASIAQ6W6DD7SK2HDJQRF',
    aws_secret_access_key:'1xWv6dfANmUcRRCq/bwjIBrLT2Wng2Cf/wzUVNgy',
    aws_session_token:'FwoGZXIvYXdzEMv//////////wEaDNp4lsd/BBToIDTNzyLIAUYYwJ2reQmSIL94Lt9R3TN0S+SwUgXVgepclhZp6gJSfQXQkqrji3HtOoG2PiA03wxferaTRSDpTnLyE7cFLLjht7E8js2XNzJ4U4oozTnG7ChscXZ4aNsl/THNIKQLVpQiL81G5rEusdeAR1QgCix7g/czBZ+MpDc9N62+VpoXBj7MLAc5u0xrUgm+WX6LwcF/qALqODxxbvOzUVMikR7xwkJnZIpDOVG+6j3WjEG/CM9Bl7GNLYDzCGR3eM/NeXdoppM9TXxoKMKFxaIGMi23qNCxxG2I3wWWtuNhRmWa+4ZA9acrr4+U0Gsnl6MsVKO0ep6wnuSBzPRlTGk='
})

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
    },
    imageuserpath: {
      type: String,
      default:'https://postimagebucket.s3.amazonaws.com/e3fa12a0-77c0-48d0-ad6c-26771ee872bf.jpg'
    },
    ban:{
      type: Boolean,
      default:false,
    },
    role:{
      type:String,
      default:'member'
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
    iduser:{
        type: String,
    },
    nameuser:{
        type: String,
    },
    status:{
        type: String,
    },
    ban:{
        type: Boolean,
        default:false,
    },
    bitprice:{
      type: String,
    },
    iduserwinbit:{
        type:String,
    },
    nameuserwinbit:{
        type:String,
    },
    daytime:{
        type:Date,
        default:Date.now,
    },

})

const TagSchema = new mongoose.Schema({
  tagname: {
    type: String,
  },
  tagprice: {
    type: String,
  }
})

const PostSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
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
  imageuserpath: {
    type: String,
  },
  // comments: {
  //   type: Array,
  // },
  time: {
    type: Date,
    default: Date.now,
  },
  ban:{
    type: Boolean,
    default:false,
  },
})

const CommentSchema = new mongoose.Schema({
  postId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
  },
  text: {
    type: String,
  },
  imgPath: {
    type: String,
  }
})

const ReportSchema = new mongoose.Schema({
  namereport: {
    type: String,
  },
  typereport: {
    type: String,
  },
  desc: {
    type: String,
  },
  time: {
    type: Date,
    default: Date.now,
  },
  iditem:{
    type:String,
  },
  statusReport:{
    type:String,
    default: 'pending'
  }
})

const HistoryNotiSchema = new mongoose.Schema({
  iduser: {
    type: String,
  },
  nameitem: {
    type: String,
  },
  iditem:{
    type:String,
  },
  time: {
    type: Date,
    default: Date.now,
  },
  usernamepost:{
    type:String,
  },
  useridpost:{
    type:String,
  },
  itemtype:{
    type:String,
  },
  notistatus:{
    type:String,
    default: 'wait',
  },
  imageURL:{
    type:String,
  },
  bitprice:{
    type:String,
  }
})

const ReceiveNotiSchema = new mongoose.Schema({
  iduser: {
    type: String,
  },
  iditem:{
    type:String,
  },
  nameitem: {
    type: String,
  },
  time: {
    type: Date,
    default: Date.now,
  },
  usernamerequest:{
    type:String,
  },
  useridrequest:{
    type:String,
  },
  itemtype:{
    type:String,
  },
  requeststatus:{
    type:String,
    default: 'wait',
  },
  imageURL:{
    type:String,
  },
  bitprice:{
    type:String,
  }
})

const User = mongoose.model("users", UserSchema);
const Item = mongoose.model("items", ItemSchema);
const Post = mongoose.model("posts", PostSchema);
const Report = mongoose.model('reports', ReportSchema);
const History = mongoose.model('history', HistoryNotiSchema);
const Receive = mongoose.model('receive', ReceiveNotiSchema);
const Comment = mongoose.model("comment", CommentSchema);
const Tag = mongoose.model("tag", TagSchema);

User.createIndexes();
Item.createIndexes();
Post.createIndexes();
Report.createIndexes();
History.createIndexes();
Receive.createIndexes();
Comment.createIndexes();
Tag.createIndexes();

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
    // console.log(req.body.userId)
    const user = await User.findById(req.params.id);
    // console.log(user);
    res.send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error finding user");
  }
});

app.get("/allitem", async (req, res) => {
  try {
    const allitem = await Item.find();
    // console.log("1234");
    res.send(allitem);
  } catch (err) {
    console.error(err);
    res.status(500).send("Can't Find Item");
  }
});

app.get("/allPost", async (req, res) => {
  try {
    const allPost = await Post.find();
    res.send(allPost);
  } catch (err) {
    console.error(err);
    res.status(500).send("Can't Find Post");
  }
})

app.get("/getitem/:id", async (req, res) => {
  try {
    // console.log(req.params.id);
    const detailitem = await Item.findById(req.params.id);

    res.send(detailitem);
  } catch (err) {
    console.error(err);
    res.status(500).send("Can't Find Item");
  }
});

app.get("/getPostComment/:id", async (req, res) => {
  try{
    const comments = await Comment.find({"postId": req.params.id})
    res.send(comments);
  } catch (err) {
    console.log(e);
    res.send({status: "Something went wrong"});
  }
})

app.put('/posts/:id', async (req, res) => {
  try {
    let updateLike = await Post.updateOne(
      {_id:req.params.id},
        {$set:{
          like: req.body.like
        }})

    if (updateLike) {
      res.send(req.body)
    } else {
      console.log("Can't add like");
    }
  } catch (err) {
    res.status(500).send('Server Error');
  }
})

app.put('/updateUser/:id', async (req, res) => {
  try{
    let updatedUser = await User.updateOne(
      {_id: req.params.id},
      {$set: {
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone,
        faculty: req.body.faculty,
        ig: req.body.ig,
        fb: req.body.fb,
        twit: req.body.twit,
        line: req.body.line,
        imageuserpath: req.body.imageuserpath,
        role: req.body.role,
        ban: req.body.ban
      }}
    )

    if (updatedUser) {
      res.send(req.body)
    } else {
      console.log("Can't update user");
    }
  } catch (err) {
    console.log(err);
  }
})

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const alluser = await User.find({});
    const user = alluser.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      // localStorage.setItem("user", "test");
      res.send(user);
    } else {
      res.send("Wrong id or password");
    }
  } catch (e) {
    console.log(e);
  }
});

app.post("/comment", async (req, res) => {
  try{
    const comment = new Comment(req.body);
    let result = await comment.save();
    result = result.toObject();
    if (result) {
      res.send(result)
    } else {
      console.log("Can't create comment");
    }
  } catch (e) {
    console.log(e);
    res.send({status: "Something went wrong"});
  }
})


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
        
        result = result.toObject();
        console.log(result);
        if (result) {
            res.send(result);
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

app.post("/createReport", async (req, res) => {
  try{
    const report = new Report(req.body);
    // console.log(req.body);
    let result = await report.save();
    result = result.toObject();
    if (result) {
      res.send(req.body);
    } else {
      console.log("Can't create report");
    }
  } catch (e) {
    console.log(e);
    res.send("Something went wrong");
  }
})


app.post("/createNoti", async (req, res) => {
  try{
    const history = new History(req.body);
    console.log(req.body);
    let result = await history.save();
    result = result.toObject();
    if (result) {
      res.send(req.body);
    } else {
      console.log("Can't create History Noti");
    }
  } catch (e) {
    console.log(e);
    res.send("Something went wrong");
  }
})

app.post("/createRequest", async (req, res) => {
  try{
    const request = new Receive(req.body);
    console.log(req.body);
    let result = await request.save();
    let updateitem = await Item.updateOne({_id:req.body.iditem}, {$set:{status:'pending'}})
    result = result.toObject();
    if (result) {
      res.send(req.body);
    } else {
      console.log("Can't create Request Noti");
    }
  } catch (e) {
    console.log(e);
    res.send("Something went wrong");
  }
})

app.post("/createTag", async (req, res) => {
  try{
    const tag = new Tag(req.body);
    let result = await tag.save();
    result = result.toObject();
    if (result) {
      res.send(req.body);
    } else {
      console.log("Can't create tag");
    }
  } catch (e) {
    console.log(e);
    res.send("Something went wrong");
  }
})


app.get("/getnotiHistory/:id", async (req, res) => {
  try {
    // console.log(req.params.id);
    // console.log(req.params.id);
    const notihis = await History.find({iduser: req.params.id});
    // console.log(notihis);
    res.send(notihis);
  } catch (err) {
    console.error(err);
    res.status(500).send("Can't Find Item");
  }
});

app.get("/getnotiResive/:id", async (req, res) => {
  try {
    // console.log(req.params.id);
    // const recive = await Receive.findById(req.params.id);
    const receive = await Receive.find({iduser: req.params.id})
    console.log(receive);
    res.send(receive);
  } catch (err) {
    console.error(err);
    res.status(500).send("Can't Find Item");
  }
});

app.put("/updateReceive", async (req, res) => {
  try{
    // const request = new Receive(req.body);
    // console.log(req.body);
    
    let result = await Receive.updateMany({iditem: req.body.iditem}, {$set:{requeststatus:'reject'}})
    let updatestatus = await Receive.updateOne({_id:req.body.idreceive}, {$set:{requeststatus:'accept'}})
    let UpdateHistory = await History.updateMany({iditem: req.body.iditem}, {$set:{notistatus:'reject'}})
    let UpdateResult = await History.updateMany({iditem: req.body.iditem, iduser:req.body.useridrequest}, {$set:{notistatus:'accept'}})
    let updateitem = await Item.updateOne({_id:req.body.iditem}, {$set:{status:'complete'}})

    // result = result.toObject();
    if (result) {
      res.send(req.body);
    } else {
      console.log("Can't create Request Noti");
    }
  } catch (e) {
    console.log(e);
    res.send("Something went wrong");
  }
})

app.put("/updateReceiveReject", async (req, res) => {
  try{
    // const request = new Receive(req.body);
    // console.log(req.body);
    
    let result = await Receive.updateMany({iditem: req.body.iditem, useridrequest:req.body.useridrequest}, {$set:{requeststatus:'reject'}})
    // let updatestatus = await Receive.updateOne({_id:req.body.idreceive}, {$set:{requeststatus:'accept'}})
    let UpdateHistory = await History.updateMany({iditem: req.body.iditem, iduser:req.body.useridrequest}, {$set:{notistatus:'reject'}})
    let updateitem = await Item.updateOne({_id:req.body.iditem}, {$set:{status:'wait'}})
    // let UpdateResult = await History.updateMany({iditem: req.body.iditem, }, {$set:{notistatus:'accept'}})
    // result = result.toObject();
    if (result) {
      res.send(req.body);
    } else {
      console.log("Can't create Request Noti");
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

app.put("/updateBit", async (req, res) => {
  try{
    // console.log(req.body);
    let updateitem = await Receive.updateOne({iditem:req.body.iditem}, {$set:{bitprice:req.body.bitprice, usernamerequest:req.body.usernamerequest, useridrequest: req.body.useridrequest}})
    let updatelose = await History.updateMany({iditem: req.body.iditem}, {$set:{notistatus:'lose'}})
    let updateprice = await Item.updateMany({_id: req.body.iditem}, {$set:{bitprice:req.body.bitprice, iduserwinbit:req.body.usernamerequest}})


    // result = result.toObject();
    if (updateitem) {
      res.send(req.body);
    } else {
      console.log("Can't create Request Noti");
    }
  } catch (e) {
    console.log(e);
    res.send("Something went wrong");
  }
})

app.put("/stopBit", async (req, res) => {
  try{
    // console.log(req.body);
    let updatereceive = await Receive.updateOne({_id:req.body.notiid}, {$set:{requeststatus:'done'}})
    // let updateitem = await Receive.updateOne({iditem:req.body.iditem}, {$set:{bitprice:req.body.bitprice, usernamerequest:req.body.usernamerequest, useridrequest: req.body.useridrequest}})
    let updateitem = await Item.updateOne({_id:req.body.iditem}, {$set:{status:'complete'}})
    // let updatelose = await History.updateMany({iditem: req.body.iditem}, {$set:{notistatus:'lose'}})
    // let updateprice = await Item.updateMany({_id: req.body.iditem}, {$set:{bitprice:req.body.bitprice, iduserwinbit:req.body.usernamerequest}})


    // result = result.toObject();
    if (updateitem) {
      res.send(req.body);
    } else {
      console.log("Can't create Request Noti");
    }
  } catch (e) {
    console.log(e);
    res.send("Something went wrong");
  }
})

app.get("/getTag", async (req, res) => {
  try {
    const allTag = await Tag.find();
    res.send(allTag);
  } catch (err) {
    console.log(err);
    res.status(500).send("Can't Find Tag");
  }
})

app.get("/getReport", async (req, res) => {
  try {
    const allReport = await Report.find();
    res.send(allReport);
  } catch (err) {
    console.error(err);
    res.status(500).send("Can't Find Report");
  }
});

app.put("/Banitem", async (req, res) => {
  try{
    // console.log(req.body);
    // let updatereceive = await Receive.updateOne({_id:req.body.notiid}, {$set:{requeststatus:'done'}})
    // // let updateitem = await Receive.updateOne({iditem:req.body.iditem}, {$set:{bitprice:req.body.bitprice, usernamerequest:req.body.usernamerequest, useridrequest: req.body.useridrequest}})
    // let updateitem = await Item.updateOne({_id:req.body.iditem}, {$set:{status:'complete'}})
    // let updatelose = await History.updateMany({iditem: req.body.iditem}, {$set:{notistatus:'lose'}})
    // let updateprice = await Item.updateMany({_id: req.body.iditem}, {$set:{bitprice:req.body.bitprice, iduserwinbit:req.body.usernamerequest}})
    let updateReport = await Report.updateOne({_id:req.body.idreport}, {$set:{statusReport:'done'}})
    let updateitem = await Item.updateOne({_id:req.body.iditem}, {$set:{ban:true}})

    // result = result.toObject();
    if (updateitem) {
      res.send(req.body);
    } else {
      console.log("Can't create Request Noti");
    }
  } catch (e) {
    console.log(e);
    res.send("Something went wrong");
  }
})

app.put("/updateTag", async (req, res) => {
  try {
    let result = await Tag.updateOne({_id:req.body.id}, {$set:{tagprice: req.body.price}})
    if (result) {
      res.send(req.body);
    } else {
      console.log("Can't Update Tag")
    }
  } catch (e) {
    console.log(e);
    res.send("Something went wrong")
  }
})


app.post('/uploadProfile', uploadProfile.single('avatar'), (req, res) => {
  return res.send({fileurl: req.file.location});
})

app.delete('/deleteTag', async (req, res) => {
  try {
    let result = await Tag.deleteOne({_id: req.body.id})
    if (result) {
      res.send(req.body);
    } else {
      console.log("Can't Delete Tag")
    }
  } catch (e) {
    console.log(e);
    res.send("Something went wrong")
  }
})


app.listen(3005, () => console.log('App Is listening'));
