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

function randomChoice(arr) {
  return arr[Math.floor(arr.length * Math.random())];
}

const options = ['Beullers_A_day_like_this.mp3', 'Firefly_Shooting.mp3', 'Futurama_Good_News!_77.mp3', 'LOTR_Samwise_Potatoes.mp3', 'Rick_and_Morty_Wubba_Lubba_Dub_Dub.mp3']

const getSoundUrl = async () => {
  try {
      const command = new GetObjectCommand({
        Bucket: 'soundsforthebutton2',
        Key: randomChoice(options),
      });
      // Create the presigned URL.
      const signedUrl = await getSignedUrl(s3Client, command, {expiresIn: 3600});
      const response = await fetch(signedUrl);
      const url = await response;
      return await url['url']


  } catch (err) {
      console.log('Error creating presigned URL', err);
  };
};

// homepage
app.get('/', (req, res) => {
  res.send('Welcome!')
});

// fetch sound url
app.get('/get', async (req, res) => {
  res.send(String(await getSoundUrl()))
});

// launch API
app.listen('3001', () => { })
