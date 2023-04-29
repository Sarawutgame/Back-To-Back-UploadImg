require("dotenv").config();
const aws = require('aws-sdk');
const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
const uuid = require('uuid').v4;
// const MongoClient = require('mongodb').MongoClient
const path = require('path');

const app = express();

const s3 = new aws.S3({apiVersion: '2006-03-01'});

const upload = multer({
    storage: multerS3({
        s3,
        bucket: 'postimagebucket',
        acl: 'public-read',
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            cb(null, `${uuid()}${ext}`);
        }
    })
});

app.use(express.static('public'));


app.post('/upload', upload.single('avatar'), (req, res) =>{
    console.log(req.file.location)
    return res.json({ status: 'OK', uploaded: req.files});
});


app.listen(3005, () => console.log('App Is listening'));
