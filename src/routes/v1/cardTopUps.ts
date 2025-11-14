import { Router } from 'express';

import { create, destroy, edit, list, show } from 'controllers/cardTopUps';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import { validateCardTopUpCreate, validateCardTopUpUpdate } from 'middleware/validation/cardTopUps';

const router = Router();
const adminOnly = [checkJwt, checkRole(['ADMINISTRATOR'])];

router.get('/', adminOnly, list);
router.get('/:id([0-9]+)', adminOnly, show);
router.post('/', adminOnly, validateCardTopUpCreate, create);
router.patch('/:id([0-9]+)', adminOnly, validateCardTopUpUpdate, edit);
router.delete('/:id([0-9]+)', adminOnly, destroy);

export default router;
