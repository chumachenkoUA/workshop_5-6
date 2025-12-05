import { Router } from 'express';

import { create, destroy, edit, list, show } from 'controllers/routeStops';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import { validateRouteStopPayload } from 'middleware/validation/routeStops';

const router = Router();
const adminOnly = [checkJwt, checkRole(['ADMINISTRATOR'])];

router.get('/', adminOnly, list);
router.get('/:id([0-9]+)', adminOnly, show);
router.post('/', adminOnly, validateRouteStopPayload, create);
router.patch('/:id([0-9]+)', adminOnly, validateRouteStopPayload, edit);
router.delete('/:id([0-9]+)', adminOnly, destroy);

export default router;
