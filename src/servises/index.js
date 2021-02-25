const router = require("express").Router();

const commentRoute = require("./comments");
const experienceRoute = require("./experience");
const postRoute = require("./post");
const profileRoute = require("./profile");

router.use("/experience", experienceRoute);
router.use("/profile", profileRoute);
router.use("/posts", postRoute);
router.use("/comments", commentRoute);

module.exports = router;
