import { spawn } from 'node:child_process';
import { serveStatic } from './static-server.mjs';

function parseNodeVersion(version) {
  const [major = 0, minor = 0, patch = 0] = version.split('.').map(Number);
  return { major, minor, patch };
}

function supportsAngular22Cli(version = process.versions.node) {
  const { major, minor, patch } = parseNodeVersion(version);

  if (major >= 26) {
    return true;
  }

  if (major === 24) {
    return minor > 15 || (minor === 15 && patch >= 0);
  }

  if (major === 22) {
    return minor > 22 || (minor === 22 && patch >= 3);
  }

  return false;
}

function runAngularDevServer() {
  const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const child = spawn(npmCommand, ['run', 'dev'], { stdio: 'inherit' });

  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, () => child.kill(signal));
  }

  child.on('exit', (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }

    process.exit(code ?? 0);
  });
}

if (supportsAngular22Cli() && process.env.STACKLINE_STATIC_PREVIEW !== '1') {
  console.log(`[stackline] Node ${process.versions.node} supports Angular 22 CLI. Starting ng serve.`);
  runAngularDevServer();
} else {
  console.log(
    `[stackline] Node ${process.versions.node} is below Angular 22 CLI requirements. ` +
      'Serving the committed StackBlitz preview build instead.'
  );
  serveStatic();
}
