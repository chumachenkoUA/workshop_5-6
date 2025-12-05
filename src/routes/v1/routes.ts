import { Router } from 'express';

import { create, destroy, edit, list, show } from 'controllers/routes_';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import { validateRoutePayload } from 'middleware/validation/routes';

const router = Router();
const adminOnly = [checkJwt, checkRole(['ADMINISTRATOR'])];

router.get('/', adminOnly, list);
router.get('/:id([0-9]+)', adminOnly, show);
router.post('/', adminOnly, validateRoutePayload, create);
router.patch('/:id([0-9]+)', adminOnly, validateRoutePayload, edit);
router.delete('/:id([0-9]+)', adminOnly, destroy);

export default router;
