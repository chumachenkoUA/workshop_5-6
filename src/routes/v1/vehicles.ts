import { Router } from 'express';

import { create, destroy, edit, list, show } from 'controllers/vehicles';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import { validateVehiclePayload } from 'middleware/validation/vehicles';

const router = Router();
const adminOnly = [checkJwt, checkRole(['ADMINISTRATOR'])];

router.get('/', adminOnly, list);
router.get('/:id([0-9]+)', adminOnly, show);
router.post('/', adminOnly, validateVehiclePayload, create);
router.patch('/:id([0-9]+)', adminOnly, validateVehiclePayload, edit);
router.delete('/:id([0-9]+)', adminOnly, destroy);

export default router;
