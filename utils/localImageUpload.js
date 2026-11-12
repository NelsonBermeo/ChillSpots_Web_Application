import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';

const allowedFolders = new Set(['users', 'locations', 'reviews']);
const extensions = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp']
]);

export async function saveImage(image, folder) {
  const extension = extensions.get(image?.mimetype);
  if (!extension) throw 'Only PNG, JPEG, and WEBP images are allowed.';
  if (!allowedFolders.has(folder)) throw 'Invalid image folder.';

  const uploadsDirectory = new URL(`../public/uploads/${folder}/`, import.meta.url);
  const filename = `${randomUUID()}.${extension}`;
  await mkdir(uploadsDirectory, { recursive: true });
  await writeFile(new URL(filename, uploadsDirectory), image.buffer);
  return `/public/uploads/${folder}/${filename}`;
}

export async function saveMultipleImages(images, folder) {
  const urls = [];
  for (const image of images || []) {
    urls.push(await saveImage(image, folder));
  }
  return urls;
}
