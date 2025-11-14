import { Router } from 'express';

import { create, destroy, edit, list, show } from 'controllers/stops';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import { validateStopPayload } from 'middleware/validation/stops';

const router = Router();
const adminOnly = [checkJwt, checkRole(['ADMINISTRATOR'])];

router.get('/', adminOnly, list);
router.get('/:id([0-9]+)', adminOnly, show);
router.post('/', adminOnly, validateStopPayload, create);
router.patch('/:id([0-9]+)', adminOnly, validateStopPayload, edit);
router.delete('/:id([0-9]+)', adminOnly, destroy);

export default router;
