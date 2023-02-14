import express from "express";
import cors from "cors";
// Import required AWS SDK clients and commands for Node.js.
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./libs/s3Client.js"; // Helper function that creates an Amazon S3 service client module.
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fetch from "node-fetch";

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(cors())

// homepage
app.get('/', (req, res) => {
  res.send('Welcome!')
});

const bucketParams = {
  Bucket: 'soundsforthebutton',
  Key: 'Samwise Potatoes.mp3',
};

const getSoundUrl = async () => {
  try {
      const command = new GetObjectCommand(bucketParams);
      // Create the presigned URL.
      const signedUrl = await getSignedUrl(s3Client, command, {expiresIn: 36000});
      const response = await fetch(signedUrl);
      const url = await response;
      return await url['url']


  } catch (err) {
      console.log('Error creating presigned URL', err);
  };
};

app.get('/get', async (req, res) => {
  res.send(String(await getSoundUrl()))
});

app.listen('3001', () => { })
