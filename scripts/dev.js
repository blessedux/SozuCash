const chokidar = require('chokidar');
const { exec } = require('child_process');
const path = require('path');

// Watch for file changes
const watcher = chokidar.watch(['src/**/*'], {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true
});

console.log('Watching for file changes...');

let building = false;

watcher.on('change', async (path) => {
  if (building) return;
  
  building = true;
  console.log(`File ${path} has been changed`);
  
  exec('yarn build', (error, stdout, stderr) => {
    if (error) {
      console.error(`Build error: ${error}`);
      building = false;
      return;
    }
    
    console.log('Build completed');
    building = false;
  });
}); 