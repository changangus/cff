import aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import dotenv from 'dotenv';

dotenv.config();

aws.config.update({
  secretAccessKey: process.env.AWS_ACCESS_KEY,
  accessKeyId: process.env.AWS_SECRET_KEY,
  region: 'us-east-2'
})
const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'com-fridge-finder',
    acl: 'public-read',
    metadata: function (_, _1, cb) {
      cb(null, {fieldName: 'TESTING_META_DATA'});
    },
    key: function (_, _1, cb) {
      cb(null, Date.now().toString())
    }
  })
});

export default upload;