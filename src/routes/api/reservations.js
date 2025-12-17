import express from "express";
import { authenticate } from "../../middlewares/auth.js";
import * as reservationController from "../../controllers/reservation.controller.js";

const router = express.Router();

router.get("/all", authenticate, reservationController.getAllReservations);
router.get("/", authenticate, reservationController.getUserReservations);
router.get("/:id", authenticate, reservationController.getReservationById);
router.post("/", authenticate, reservationController.createReservation);
router.delete("/:id", authenticate, reservationController.cancelReservation);

export default router;
