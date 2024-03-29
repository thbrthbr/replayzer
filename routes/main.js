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
const upload2 = multer({
  storage: multer.diskStorage({
    //저장될 경로지정
    destination: (req, file, cb) => {
      cb(null, 'views/img/');
    },
    //파일 이름 설정
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const newName = Date.now() + path.extname(file.originalname);
      cb(null, newName);
    },
  }),
});

router.get('/', Controller.intro);
router.get('/get_list/:page', Controller.getList);
// router.post('/replay_upload', upload.array('replay-upload'), Controller.upload);
router.post(
  '/replay_upload',
  upload.single('replay-upload'),
  Controller.upload,
);
router.post('/card_upload', upload2.single('card-upload'), Controller.upload2);
router.post('/replay_delete', Controller.remove);

// router.post('/temp', Controller.temp);
// router.get('/test', Controller.test);

router.get('/awards', Controller.awards);
router.get('/ladder', Controller.ladder);
router.get('/getCards', Controller.getCards);
router.get('/getLadder', Controller.getLadder);
router.get('/getUserLadder', Controller.getUserLadder);
router.get('/replay/:id', Controller.show);
router.get('/replayShow', Controller.replayShow);
router.post('/search', Controller.search);
router.post('/searchByCode', Controller.searchByCode);
router.post('/updateLadder', Controller.updateLadder);
router.post('/updateLadder2', Controller.updateLadder2);

router.post('/decay', Controller.decay);

router.get('/getComments/:pageid', Controller.getComments);
router.post('/commentAdd', Controller.commentAdd);
router.post('/commentSub', Controller.commentSub);
module.exports = router;
