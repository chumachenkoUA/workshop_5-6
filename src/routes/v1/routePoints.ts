import { Router } from 'express';

import { create, destroy, edit, list, show } from 'controllers/routePoints';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import { validateRoutePointPayload } from 'middleware/validation/routePoints';

const router = Router();
const adminOnly = [checkJwt, checkRole(['ADMINISTRATOR'])];

router.get('/', adminOnly, list);
router.get('/:id([0-9]+)', adminOnly, show);
router.post('/', adminOnly, validateRoutePointPayload, create);
router.patch('/:id([0-9]+)', adminOnly, validateRoutePointPayload, edit);
router.delete('/:id([0-9]+)', adminOnly, destroy);

export default router;
