// Alright let's set up our S3 implementation
import { randomUUID } from "node:crypto"; // unique file names
import {
  S3Client, // object for backend communication
  PutObjectCommand, // putter and getter methods
  GetObjectCommand,
} from "@aws-sdk/client-s3";

// Create our S3 Client:
const s3 = new S3Client({ region: process.env.AWS_REGION });
const bucket = process.env.AWS_S3_BUCKET;

const extensions = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function saveProfileImage(file) {
  // file agrument
  const extension = extensions[file?.mimetype];
  if (!extension) {
    throw new Error("Invalid image type");
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Image must be 5 MB or smaller");
  } // Lets limit the image size for security and scalability
  const filename = `${randomUUID()}.${extension}`;
  await s3.send(
    //aws command for uploading
    new PutObjectCommand({
      Bucket: bucket,
      Key: `profile-pics/${filename}`,
      Body: file.buffer, // actual binary image data
      ContentType: file.mimetype,
    }),
  );
  return `/profile-images/${filename}`;
}

export async function getProfileImage(filename) {
  return await s3.send(
    // simply use aws's get command
    new GetObjectCommand({
      Bucket: bucket,
      Key: `profile-pics/${filename}`,
    }),
  );
}
