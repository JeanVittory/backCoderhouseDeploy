import { Router } from 'express';
import { postOrder } from '../controllers/notifications.controllers.js';

const twilioRoute = Router();

twilioRoute.post('/', postOrder);

export { twilioRoute };
