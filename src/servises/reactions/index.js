const router = require("express").Router();

router.post("/:postId", async (req, res, next) => {
  try {
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
