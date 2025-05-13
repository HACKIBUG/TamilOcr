/**
 * Enhanced helper script for running the Tamil OCR application locally.
 * Handles Node.js v22+ compatibility issues and port conflicts.
 * 
 * Run with: node run-local.js
 */

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting Tamil OCR Digitizer Application locally...');
console.log('Creating required directories...');

// Create required directories if they don't exist
const dirs = ['uploads', 'notebooks', 'temp'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✓ Created ${dir} directory`);
  } else {
    console.log(`✓ ${dir} directory already exists`);
  }
});

// Check if tsx is installed
function startServer() {
  // Try to detect node version
  const nodeVersion = process.version;
  console.log(`Detected Node.js ${nodeVersion}`);

  // For Node.js v20+ we'll use our special localhost server to avoid bind issues
  const serverFile = 
    parseInt(nodeVersion.slice(1).split('.')[0]) >= 20 
      ? 'server/localhost-dev.ts' 
      : 'server/local-dev.ts';
  
  console.log(`Starting server with: ${serverFile}`);
  
  // Start the server with tsx
  const server = spawn('npx', ['tsx', serverFile], { 
    stdio: 'inherit',
    shell: true 
  });
  
  server.on('error', (err) => {
    console.error('Failed to start server:', err);
    if (err.code === 'ENOENT') {
      console.log('It appears tsx is not installed. Installing it now...');
      const install = spawn('npm', ['install', '--save-dev', 'tsx'], {
        stdio: 'inherit',
        shell: true
      });
      
      install.on('close', (code) => {
        if (code === 0) {
          console.log('✓ tsx installed successfully, restarting server...');
          startServer(); // Try again
        } else {
          console.error('Failed to install tsx. Please run: npm install --save-dev tsx');
        }
      });
    }
  });
  
  server.on('close', code => {
    if (code !== 0 && code !== null) {
      console.error(`Server process exited with code ${code}`);
      
      // Suggest fixing the TypeScript error manually if it's that kind of error
      if (code === 1) {
        console.log('\nIf you encounter TypeScript errors with vite configuration, you may need to:');
        console.log('1. Create a file called server-fix.d.ts in the root directory');
        console.log('2. Add this content to it:');
        console.log(`
import 'vite';
declare module 'vite' {
  interface ServerOptions {
    allowedHosts?: boolean | string[] | 'all';
  }
}
`);
      }
    }
  });
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    server.kill('SIGINT');
    process.exit(0);
  });
}

// Check for required packages and start
console.log('Checking if all dependencies are installed...');
exec('npm list express vite tsx react react-dom', (error, stdout, stderr) => {
  const missingPackages = [];
  
  ['express', 'vite', 'tsx', 'react', 'react-dom'].forEach(pkg => {
    if (!stdout.includes(pkg + '@')) {
      missingPackages.push(pkg);
    }
  });
  
  if (missingPackages.length > 0) {
    console.log(`Installing missing dependencies: ${missingPackages.join(', ')}...`);
    const install = spawn('npm', ['install', '--save', ...missingPackages], {
      stdio: 'inherit',
      shell: true
    });
    
    install.on('close', (code) => {
      if (code === 0) {
        console.log('✓ Dependencies installed successfully');
        startServer();
      } else {
        console.error('Failed to install dependencies. Please run: npm install');
      }
    });
  } else {
    console.log('✓ All Node.js dependencies are installed');
    startServer();
  }
});