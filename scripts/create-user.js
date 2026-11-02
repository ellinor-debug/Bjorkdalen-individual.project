import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { hashPassword } from '../src/lib/server/password.js';

async function readPassword() {
  if (!stdin.isTTY || !stdin.setRawMode) {
    throw new Error('Run this script in a terminal to enter the password securely.');
  }

  stdout.write('Password: ');
  stdin.setRawMode(true);
  stdin.resume();

  return new Promise((resolve, reject) => {
    let password = '';

    function finish(error) {
      stdin.off('data', onData);
      stdin.setRawMode(false);
      stdin.pause();
      stdout.write('\n');
      if (error) reject(error);
      else resolve(password);
    }

    function onData(buffer) {
      for (const character of buffer.toString()) {
        if (character === '\u0003') return finish(new Error('Password entry cancelled.'));
        if (character === '\r' || character === '\n') return finish();
        if (character === '\u007f' || character === '\b') {
          password = password.slice(0, -1);
        } else {
          password += character;
        }
      }
    }

    stdin.on('data', onData);
  });
}

const prompt = createInterface({ input: stdin, output: stdout });

try {
  const username = (await prompt.question('Username: ')).trim();
  prompt.close();

  if (!username || username.length > 100) {
    throw new Error('Username must contain between 1 and 100 characters.');
  }

  const password = await readPassword();
  if (!password || password.length > 1024) {
    throw new Error('Password must contain between 1 and 1024 characters.');
  }

  const passwordHash = await hashPassword(password);
  const escapeSql = (value) => `'${value.replaceAll("'", "''")}'`;

  console.log(
    `INSERT INTO users (username, password_hash) VALUES (${escapeSql(username)}, ${escapeSql(passwordHash)});`
  );
} catch (error) {
  prompt.close();
  console.error(error.message);
  process.exitCode = 1;
}
