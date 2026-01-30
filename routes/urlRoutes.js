import { Router } from 'express';
import {
  createShortLink,
  redirectByCode,
} from '../controllers/urlController.js';

export const apiRouter = Router();
// Create a short link
apiRouter.post('/links', createShortLink);

export const redirectRouter = Router();
// Resolve short code and redirect
redirectRouter.get('/:code', redirectByCode);
