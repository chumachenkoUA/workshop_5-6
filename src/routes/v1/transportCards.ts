import { Router } from 'express';

import { create, destroy, edit, getMine, list, show } from 'controllers/transportCards';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import { validateTransportCardPayload } from 'middleware/validation/transportCards';

const router = Router();
const adminOnly = [checkJwt, checkRole(['ADMINISTRATOR'])];
const transitOnly = [checkJwt, checkRole(['TRANSIT'])];

router.get('/', adminOnly, list);
router.get('/:id([0-9]+)', adminOnly, show);
router.get('/me', transitOnly, getMine);
router.post('/', adminOnly, validateTransportCardPayload, create);
router.patch('/:id([0-9]+)', adminOnly, validateTransportCardPayload, edit);
router.delete('/:id([0-9]+)', adminOnly, destroy);

export default router;
