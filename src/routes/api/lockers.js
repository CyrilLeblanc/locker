import express from "express";
import { authenticate, isAdmin } from "../../middlewares/auth.js";
import * as lockerController from "../../controllers/locker.controller.js";

const router = express.Router();

router.get("/", lockerController.getAllLockers);
router.get("/:id", lockerController.getLockerById);
router.post("/", authenticate, isAdmin, lockerController.createLocker);
router.put("/:id", authenticate, isAdmin, lockerController.updateLocker);
router.delete("/:id", authenticate, isAdmin, lockerController.deleteLocker);

export default router;
