import { Router } from 'express';
import { TimeEntryController } from '../controllers/time-entry.controller';

const router = Router();
const timeEntryController = new TimeEntryController();

router.get('/', timeEntryController.getEntriesByUser);

router.post('/create', timeEntryController.createEntry);

router.delete('/delete', timeEntryController.deleteEntry);

export default router;