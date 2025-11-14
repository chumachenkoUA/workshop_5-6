import { Router } from 'express';

import { create, destroy, edit, list, show } from 'controllers/transportTypes';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import { validateTransportTypePayload } from 'middleware/validation/transportTypes';

const router = Router();
const adminOnly = [checkJwt, checkRole(['ADMINISTRATOR'])];

router.get('/', adminOnly, list);
router.get('/:id([0-9]+)', adminOnly, show);
router.post('/', adminOnly, validateTransportTypePayload, create);
router.patch('/:id([0-9]+)', adminOnly, validateTransportTypePayload, edit);
router.delete('/:id([0-9]+)', adminOnly, destroy);

export default router;
