const { List } = require('../models');
const { Comment } = require('../models');
const { Op } = require('sequelize');
const fs = require('fs');

exports.intro = (req, res) => {
  res.render('main');
};

exports.getList = async (req, res) => {
  console.log(req.params.page);
  let page = req.params.page;
  let list = await List.findAll();
  let comments = await Comment.findAll();
  list = list.reverse();
  let arr = [];
  for (let i = (page - 1) * 10; i < page * 10; i++) {
    if (list[i]) {
      let commentNum = 0;
      for (let j = 0; j < comments.length; j++) {
        if (list[i].dataValues.id == comments[j].dataValues.pageid) {
          commentNum++;
        }
      }
      let obj = {
        fileid: list[i].dataValues.id,
        title: list[i].dataValues.title,
        fileName: list[i].dataValues.fileName,
        commentNum: commentNum,
      };
      arr.push(obj);
    }
  }

  res.send({ data: arr });
};

exports.show = (req, res) => {
  req.session.which = req.params;
  res.render('replay');
};

exports.upload = async (req, res) => {
  try {
    let response = await List.create({
      title: req.body.title,
      fileName: req.file.filename,
    });
    let fileId = response.dataValues.id;
    res.send({
      status: '성공',
      dataName: req.body.title,
      open: req.file.filename,
      fileid: fileId,
    });
  } catch (e) {
    console.log('error: ', e);
    res.send({ status: '실패' });
  }
};

exports.replayShow = async (req, res) => {
  let numbering = parseInt(req.session.which.id);
  let response = await List.findOne({ where: { id: numbering } });
  if (response) {
    const tDir = __dirname + '/../views/';
    let flag = 0;
    fs.readdir(tDir, (err, data) => {
      if (err) throw err;
      data.forEach((item, i) => {
        if (item == response.fileName) {
          flag++;
        }
      });
      if (flag !== 0) {
        res.render(response.fileName);
      } else {
        res.render('404_2');
      }
    });
  } else {
    res.render('404_2');
  }
};

exports.search = async (req, res) => {
  try {
    let result = await List.findAll();
    let arr = [];
    for (let i = 0; i < result.length; i++) {
      if (result[i].dataValues.title.includes(req.body.keyword)) {
        let obj = {
          fileid: result[i].dataValues.id,
          title: result[i].dataValues.title,
          fileName: result[i].dataValues.fileName,
        };
        arr.push(obj);
      }
    }
    res.send({ status: '성공', data: arr });
  } catch (e) {
    res.send({ status: '실패' });
  }
};

exports.getComments = async (req, res) => {
  let result = await Comment.findAll({ where: { pageid: +req.params.pageid } });
  console.log(result);
  res.send({ status: '성공', data: result });
};

exports.commentAdd = async (req, res) => {
  try {
    console.log(req.body);
    let response = await Comment.create({
      nick: req.body.nick,
      pw: req.body.pw,
      content: req.body.content,
      pageid: req.body.pageid,
    });
    res.send({ status: '성공' });
  } catch (e) {
    console.log(e);
  }
};

exports.commentSub = async (req, res) => {
  console.log(req.body);
  let result = await Comment.destroy({ where: { id: req.body.commentId } });
  res.send({ status: '성공' });
};
