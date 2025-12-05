import { Router } from 'express';

import { create, destroy, edit, list, show } from 'controllers/transitUsers';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import { validateTransitUserPayload } from 'middleware/validation/transitUsers';

const router = Router();
const adminOnly = [checkJwt, checkRole(['ADMINISTRATOR'])];

router.get('/', adminOnly, list);
router.get('/:id([0-9]+)', adminOnly, show);
router.post('/', adminOnly, validateTransitUserPayload, create);
router.patch('/:id([0-9]+)', adminOnly, validateTransitUserPayload, edit);
router.delete('/:id([0-9]+)', adminOnly, destroy);

export default router;
