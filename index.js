import express from "express";
import cors from "cors";
import fetch from "node-fetch";
// Import required AWS SDK clients and commands for Node.js.
import { s3Client } from "./libs/s3Client.js";
import { GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

const listSounds = async () => {
  /* Returns a list of the names of all items in the bucket */
  try {
    const command = new ListObjectsV2Command({
      Bucket: "soundsforthebutton2",
    });
    const data = await s3Client.send(command);
    let allSounds = [];
    let contents = data.Contents;
    contents.forEach(function (content) {
      allSounds.push(content.Key);
    });
    return allSounds;
  } catch (err) {
    console.log("Error fetching mp3s", err);
  }
};

function randomChoice(arr) {
  return arr[Math.floor(arr.length * Math.random())];
}

const getSoundUrl = async () => {
  /* Returns a signed url for a random sound */
  try {
    const config = new GetObjectCommand({
      Bucket: "soundsforthebutton2",
      Key: randomChoice(await listSounds()),
    });
    // Create the presigned URL.
    const signedUrl = await getSignedUrl(s3Client, config, {
      expiresIn: 3600,
    });
    const response = await fetch(signedUrl);
    const url = response;
    return url["url"];
  } catch (err) {
    console.log("Error creating presigned URL", err);
  }
};

// homepage
app.get("/", (req, res) => {
  res.send("Welcome!");
});

// fetch sound url
app.get("/get", async (req, res) => {
  res.send(String(await getSoundUrl()));
});

// launch API
app.listen("3001", () => {});
