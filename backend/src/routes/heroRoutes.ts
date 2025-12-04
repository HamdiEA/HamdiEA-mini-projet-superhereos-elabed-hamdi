import { Router } from 'express';
import * as heroController from '../controllers/heroController';
import { auth, requireEditor, requireAdmin } from '../middleware/authMiddleware';
import { requireViewer } from '../middleware/roleMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

// GET /api/heroes - Get all heroes (with search and filter)
router.get('/', auth, requireViewer, heroController.getHeroes);

// GET /api/heroes/:id - Get hero by ID
router.get('/:id', auth, requireViewer, heroController.getHeroById);

// POST /api/heroes - Create new hero (editor and admin)
router.post('/', auth, requireEditor, upload.single('image'), heroController.createHero);

// PUT /api/heroes/:id - Update hero (editor and admin)
router.put('/:id', auth, requireEditor, upload.single('image'), heroController.updateHero);

// DELETE /api/heroes/:id - Delete hero (admin only)
router.delete('/:id', auth, requireAdmin, heroController.deleteHero);

export default router;