const express = require('express');
const router = express.Router();

const Controller = require('../controller/Cmain');
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  //저장될 경로지정
  destination: (req, file, cb) => {
    cb(null, 'views/');
  },
  //파일 이름 설정
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const newName =
      path.basename(file.originalname, ext) + 'vispix' + Date.now() + '.ejs';
    cb(null, newName);
  },
});
const limits = {
  fileSize: 5 * 1024 * 1024,
};
const upload = multer({ storage, limits });

router.get('/get_list', Controller.getList);

router.get('/', Controller.intro);
router.post('/replay_upload', upload.array('replay-upload'), Controller.upload);
router.post('/select', Controller.select);
router.get('/replay/load', Controller.load);
router.get('/open', Controller.show);
router.get('/replayShow', Controller.replayShow);
router.post('/search', Controller.search);
module.exports = router;
