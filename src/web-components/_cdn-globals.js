// Imports Bootstrap CSS + design tokens + fonts.
// Incluido en cada bundle CDN para que cada .js sea autocontenido.
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/tokens.css';
import { ensureEncodeSans } from '../utils/fonts.js';
ensureEncodeSans();
