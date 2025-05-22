import { dirname } from 'path';
import {fileURLToPath} from 'url'
const filepath = fileURLToPath(import.meta.url);
const __dir = dirname(dirname(filepath));
export {
    __dir
} 