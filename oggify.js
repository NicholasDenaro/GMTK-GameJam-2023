const { exec } = require('child_process');
const fs = require('fs');

const dirs = fs.readdirSync('./assets/premade/raws');
dirs.forEach(dirName => {
  const dir = fs.readdirSync(`./assets/premade/raws/${dirName}`);
  dir.forEach(async file => {
    exec(
      `ffmpeg -i "./assets/premade/raws/${dirName}/${file}" -y -c:a libvorbis -b:a 48k "./assets/premade/outputs/${file.split('.')[0]}.ogg"`,
      (err, stdout) => {
        if (err) {
          console.log('error');
          reject();
          return;
        }

        console.log(`done ${dirName}/${file}`);
      }
    );
  })
});