import bcrypt from 'bcrypt';
import moment from 'moment';

/**
 * generate hash from password or string
 * @param {string} password
 * @returns {string}
 */
export function generateHash(password: string): string {
  return bcrypt.hashSync(password, 10);
}

/**
 * validate text with hash
 * @param {string} password
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
// eslint-disable-next-line @typescript-eslint/require-await
export async function validateHash(
  password: string | undefined,
  hash: string | undefined
): Promise<boolean> {
  if (!password || !hash) {
    return false;
  }

  return bcrypt.compare(password, hash);
}

export function getVariableName<TResult>(getVar: () => TResult): string {
  const m = /\(\)=>(.*)/.exec(
    getVar.toString().replace(/(\r\n|\n|\r|\s)/gm, '')
  );

  if (!m) {
    throw new Error(
      "The function does not contain a statement matching 'return variableName;'"
    );
  }

  const fullMemberName = m[1];

  const memberParts = fullMemberName.split('.');

  return memberParts[memberParts.length - 1];
}

export const randomNoId = () =>
  (
    Math.floor(Math.random() * (99_999_999 - 10_000_000)) + 10_000_000
  ).toString();

/**
 * Returns a hash code from a string
 * @param  {String} str The string to hash.
 * @return {Number}    A 32bit integer
 */
export function hashCode(str: string): number {
  let hash = 0;

  for (let i = 0, len = str.length; i < len; i++) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr; //eslint-disable-line no-bitwise
    hash = Math.trunc(hash); // Convert to 32bit integer
  }

  return Math.abs(hash);
}

// export function canTransitStatusTo(
//   status: EDeliveryStatus,
//   nextStatus: EDeliveryStatus,
// ): boolean {
//   if (!DELIVERY_STATUS_TRASITION[status]) {
//     return false;
//   }

//   const statuses = DELIVERY_STATUS_TRASITION[status].statuses;

//   for (const s of statuses) {
//     if (s === nextStatus) {
//       return true;
//     }
//   }

//   return false;
// }

export function* asyncGenerator(limit: number) {
  let i = 0;

  while (i < limit) {
    yield i++;
  }
}

export function checkOverlap(startTime: string, endTime: string): boolean {
  return (
    moment(endTime, 'hh:mm') >= moment(startTime, 'hh:mm') ||
    moment(startTime, 'hh:mm') <= moment(endTime, 'hh:mm')
  );
}

export function hasWhiteSpace(Str: string): boolean {
  return Str.indexOf(' ') >= 0;
}

export function randomString(): string {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;

  while (counter < 10) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }

  return result;
}
