const { List } = require('../models');
const { Comment } = require('../models');
const { Op } = require('sequelize');
const fs = require('fs');

exports.intro = (req, res) => {
  res.render('main');
};

exports.getList = async (req, res) => {
  let page = req.params.page;
  let list = await List.findAll();
  let comments = await Comment.findAll();
  list = list.reverse();
  let arr = [];
  let limit = page * 10;
  // console.log(page);
  // console.log(limit);
  for (let i = (page - 1) * 10; i < limit; i++) {
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
        filePassword: list[i].dataValues.filePassword,
        privateURL: list[i].dataValues.privateURL,
        locked: list[i].dataValues.locked,
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
      filePassword: req.body.password,
      locked: req.body.locked,
      privateURL: req.body.privateURL,
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

exports.remove = async (req, res) => {
  try {
    await List.destroy({ where: { id: req.body.id } });
    res.send({ status: '성공' });
  } catch (e) {
    res.send({ status: '실패' });
  }
};

exports.replayShow = async (req, res) => {
  // console.log(req.session.which.id);
  let check = parseInt(req.session.which.id);
  let response;
  let numbering = parseInt(req.session.which.id);
  if (isNaN(check)) {
    response = await List.findOne({
      where: { privateURL: req.session.which.id },
    });
  } else {
    response = await List.findOne({ where: { id: numbering } });
  }
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
    let result = await List.findAll({
      where: {
        title: {
          [Op.like]: '%' + req.body.keyword + '%',
        },
      },
    });
    result = result.reverse();
    let comments = await Comment.findAll();
    let arr = [];
    let page = req.body.page;
    for (let i = (page - 1) * 10; i < page * 10; i++) {
      if (result[i]) {
        let commentNum = 0;
        for (let j = 0; j < comments.length; j++) {
          if (result[i].dataValues.id == comments[j].dataValues.pageid) {
            commentNum++;
          }
        }
        let obj = {
          fileid: result[i].dataValues.id,
          title: result[i].dataValues.title,
          fileName: result[i].dataValues.fileName,
          filePassword: result[i].dataValues.filePassword,
          locked: result[i].dataValues.locked,
          privateURL: result[i].dataValues.privateURL,
          commentNum: commentNum,
        };
        arr.push(obj);
      } else {
        break;
      }
    }
    res.send({ status: '성공', data: arr });
  } catch (e) {
    res.send({ status: '실패' });
  }
};

exports.searchByCode = async (req, res) => {
  try {
    if (req.body.keyword == 'none') {
      res.send({ status: '실패' });
    } else {
      let result = await List.findOne({
        where: {
          privateURL: req.body.keyword,
        },
      });
      if (result) {
        let comments = await Comment.findAll();
        let arr = [];
        if (result) {
          let commentNum = 0;
          for (let j = 0; j < comments.length; j++) {
            if (result.dataValues.id == comments[j].dataValues.pageid) {
              commentNum++;
            }
          }
          let obj = {
            fileid: result.dataValues.id,
            title: result.dataValues.title,
            fileName: result.dataValues.fileName,
            filePassword: result.dataValues.filePassword,
            locked: result.dataValues.locked,
            privateURL: result.dataValues.privateURL,
            commentNum: commentNum,
          };
          arr.push(obj);
        }
        res.send({ status: '성공', data: arr });
      } else {
        res.send({ status: '실패' });
      }
    }
  } catch (e) {
    res.send({ status: '실패' });
  }
};

exports.getComments = async (req, res) => {
  let firstly = '' + req.session.which.id;
  let check = parseInt(firstly);
  let result;
  let numbering = parseInt(firstly);
  if (isNaN(check)) {
    let forGetId = await List.findOne({
      where: { privateURL: req.session.which.id },
    });
    result = await Comment.findAll({
      where: { pageid: forGetId.dataValues.id },
    });
  } else {
    result = await Comment.findAll({ where: { pageid: numbering } });
  }
  res.send({ status: '성공', data: result });
};

exports.commentAdd = async (req, res) => {
  try {
    let check = parseInt(req.body.pageid);
    let result;
    let numbering = parseInt(req.body.pageid);
    if (isNaN(check)) {
      let forGetId = await List.findOne({
        where: { privateURL: req.body.pageid },
      });
      result = forGetId.dataValues.id;
    } else {
      result = numbering;
    }
    await Comment.create({
      nick: req.body.nick,
      pw: req.body.pw,
      content: req.body.content,
      pageid: result,
    });
    res.send({ status: '성공' });
  } catch (e) {
    console.log(e);
  }
};

exports.commentSub = async (req, res) => {
  // console.log(req.body);
  await Comment.destroy({ where: { id: req.body.commentId } });
  res.send({ status: '성공' });
};
