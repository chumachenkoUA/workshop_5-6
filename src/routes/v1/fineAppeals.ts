import { Router } from 'express';

import { create, destroy, edit, list, show } from 'controllers/fineAppeals';
import { checkJwt } from 'middleware/checkJwt';
import { checkRole } from 'middleware/checkRole';
import { validateFineAppealPayload } from 'middleware/validation/fineAppeals';

const router = Router();
const adminOnly = [checkJwt, checkRole(['ADMINISTRATOR'])];

router.get('/', adminOnly, list);
router.get('/:id([0-9]+)', adminOnly, show);
router.post('/', adminOnly, validateFineAppealPayload, create);
router.patch('/:id([0-9]+)', adminOnly, validateFineAppealPayload, edit);
router.delete('/:id([0-9]+)', adminOnly, destroy);

export default router;
