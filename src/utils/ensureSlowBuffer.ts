// Node.js 22+ removed SlowBuffer; jsonwebtoken -> jwa expects it.
// Ensure it exists on both buffer module and global scope.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bufferModule: any = require('buffer');

if (!bufferModule.SlowBuffer) {
  Object.defineProperty(bufferModule, 'SlowBuffer', {
    value: bufferModule.Buffer,
    writable: false,
    enumerable: false,
    configurable: false,
  });
}

if (!(global as any).SlowBuffer) {
  (global as any).SlowBuffer = bufferModule.SlowBuffer;
}
