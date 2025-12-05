import { Router } from 'express';

import { create, destroy, edit, list, show } from 'controllers/userGpsLogs';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import { validateUserGpsLogPayload } from 'middleware/validation/userGpsLogs';

const router = Router();
const adminOnly = [checkJwt, checkRole(['ADMINISTRATOR'])];

router.get('/', adminOnly, list);
router.get('/:id([0-9]+)', adminOnly, show);
router.post('/', adminOnly, validateUserGpsLogPayload, create);
router.patch('/:id([0-9]+)', adminOnly, validateUserGpsLogPayload, edit);
router.delete('/:id([0-9]+)', adminOnly, destroy);

export default router;
