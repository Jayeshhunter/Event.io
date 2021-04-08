const { Router } = require("express");
const authController = require("../controllers/authControllers.js");
const router = Router();

router.get("/signup", authController.signup_get);
router.post("/signup", authController.signup_post);

router.get("/signAdminup", authController.signAdminup_get);
router.post("/signAdminup", authController.signAdminup_post);

router.get("/login", authController.login_get);
router.post("/login", authController.login_post);

router.get("/loginAdm", authController.loginAdm_get);
router.post("/loginAdm", authController.loginAdm_post);

module.exports = router;
