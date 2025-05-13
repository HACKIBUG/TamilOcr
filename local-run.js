/**
 * This is a helper script for running the application locally.
 * Run this with: node local-run.js
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting the Tamil OCR application locally...');

// Check if tsx is installed
try {
  require.resolve('tsx');
} catch (e) {
  console.error('TSX is not installed globally. Installing it now...');
  const installProcess = spawn('npm', ['install', '-g', 'tsx'], { stdio: 'inherit' });
  
  installProcess.on('close', code => {
    if (code !== 0) {
      console.error('Failed to install tsx. Please run: npm install -g tsx');
      process.exit(1);
    }
    startServer();
  });
} 

function startServer() {
  console.log('Starting local development server...');
  
  // Create required directories if they don't exist
  const dirs = ['uploads', 'notebooks', 'temp'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created ${dir} directory`);
    }
  });
  
  // Start the server
  const server = spawn('tsx', ['server/local-dev.ts'], { stdio: 'inherit' });
  
  server.on('close', code => {
    if (code !== 0) {
      console.error(`Server process exited with code ${code}`);
    }
  });
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log('Shutting down server...');
    server.kill('SIGINT');
    process.exit(0);
  });
}

// Start the server if tsx is installed
if (require.resolve('tsx')) {
  startServer();
}