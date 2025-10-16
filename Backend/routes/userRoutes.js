import express from "express";

import {
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
  userLogin,
  userSignup,
} from "../controllers/userController.js";
import { protect, roles } from "../middlewares/auth.js";

const router = express.Router();
// router.post("/ulogin", userLogin);
// router.post("/usignup", userSignup);
router.post("/login", userLogin);
router.post("/signup", userSignup);
router.get("/users", protect, roles("admin"), getUsers);
router.get("/users/:id", protect, roles("admin", "user"), getUserById);
router.put("/useredit/:id", protect, roles("admin", "user"), updateUser);
router.delete("/userdelete/:id", protect, roles("admin"), deleteUser);

export default router;
