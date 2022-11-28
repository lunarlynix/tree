import fs from 'fs';
import { Canvas } from 'canvas';
const Image = Canvas.Image;
const canvas = new Canvas(100, 100);
const ctx = canvas.getContext('2d');

ctx.fillStyle = '#ff0000';
ctx.fillRect(0, 0, 100, 100);

const out = fs.createWriteStream("C:/users/antho/hex.png");
const stream = canvas.pngStream();

stream.on('data', function (chunk) {
    out.write(chunk);
});

stream.on('end', function () {
    console.log('saved png');
});