import express from 'express';
import { currentUser } from '@rdgtickets/common';

const router = express.Router();

router.get('/api/users/current', currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
