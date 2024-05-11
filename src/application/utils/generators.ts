
import * as crypto from 'crypto';
import * as url from 'url';
import bcrypt from "bcrypt";
import * as net from 'net';

export function isValidUrl(urlToCheck: string): boolean {
  try {
    new url.URL(urlToCheck);
    return true;
  } catch (error) {
    return false;
  }
}


export async function encryptPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}


export function normalizeUrl(url: string): string {
  const urlObj = new URL(url);
  urlObj.pathname = urlObj.pathname.replace(/\/$/, '');
  return urlObj.toString();
}


export function generateToken(): string {
  const randomBytes = crypto.randomBytes(32);
  const token = randomBytes.toString('base64');
  return token;
}


export function replaceChars(inputString: string): string {

  if (!inputString) return '';

  /**
   * Replaces all characters in a string (except for the first one) with an asterisk (*).
   *
   * @param inputString - The input string to modify.
   * @return The modified string with all characters replaced with an asterisk (*), except for the first character.
   */
  // return inputString.charAt(0) + '*'.repeat(inputString.length - 1);
  return inputString.charAt(0) + '*'.repeat(8);
}

function isAddressAvailable(address: string, port: number, callback: (error: Error | null, available: boolean) => void): void {
  const socket = new net.Socket();

  socket.on('connect', () => {
    socket.end();
    callback(null, true);
  });

  socket.on('error', (err) => {
    socket.destroy();
    callback(err, false);
  });

  socket.connect(port, address);
}

export function testAvailableIpPort(ip: string, port: number): boolean {

  var result: boolean = false;

  isAddressAvailable('192.168.3.28', 4002, (err, available) => {
    if (err) {
      result = false;
    } else {
      result = available ? true : false;
    }
  });

  return result;
}
