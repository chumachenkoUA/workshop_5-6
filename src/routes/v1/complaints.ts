import { Router } from 'express';

import { create, destroy, edit, list, show } from 'controllers/complaints';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import { validateComplaintCreate, validateComplaintUpdate } from 'middleware/validation/complaints';

const router = Router();
const adminOnly = [checkJwt, checkRole(['ADMINISTRATOR'])];

router.get('/', adminOnly, list);
router.get('/:id([0-9]+)', adminOnly, show);
router.post('/', adminOnly, validateComplaintCreate, create);
router.patch('/:id([0-9]+)', adminOnly, validateComplaintUpdate, edit);
router.delete('/:id([0-9]+)', adminOnly, destroy);

export default router;
