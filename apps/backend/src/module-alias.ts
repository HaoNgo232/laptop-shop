import 'module-alias/register';
import * as moduleAlias from 'module-alias';
import { join } from 'path';

/**
 * Cấu hình module alias cho production build
 * Cho phép sử dụng absolute imports với prefix @
 */

const isDevelopment = process.env.NODE_ENV === 'development';
const baseDir = isDevelopment ? __dirname : join(__dirname, '..');

moduleAlias.addAliases({
  '@': baseDir,
});

console.log(`Module alias configured for ${process.env.NODE_ENV} mode`);
console.log(`Base directory: ${baseDir}`);
