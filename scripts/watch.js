const chokidar = require('chokidar');
const { exec } = require('child_process');

// Initialize watcher
const watcher = chokidar.watch('src/**/*', {
  ignored: /(^|[\/\\])\../,
  persistent: true
});

// Log message on start
console.log('Watching for changes...');

let building = false;

// Add event listeners
watcher.on('change', path => {
  if (building) return;
  
  building = true;
  console.log(`\nFile ${path} has been changed`);
  console.log('Rebuilding...');

  exec('yarn rebuild', (error, stdout, stderr) => {
    if (error) {
      console.error(`\nBuild error: ${error}`);
    } else {
      console.log('\nBuild completed successfully');
      console.log('Please reload the extension in Chrome');
    }
    building = false;
  });
}); 