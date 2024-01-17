const { List } = require('../models');
const { Comment } = require('../models');
const { Op } = require('sequelize');
const fs = require('fs');

// const pwGenerator = () => {
//   let pwConfirmed = '';
//   let tempPW = '' + Date.now();
//   console.log(tempPW);
//   let str = '';
//   let mix = [
//     'sd',
//     'Dw',
//     'poiuytfrds',
//     '1qw2ewr4fty6u7',
//     'wqe21',
//     'dczvghvz3',
//     'asdfghjk',
//     'zxcvbnm',
//     'd21e3',
//     '0we9fb203hedw',
//     '23ePlhd',
//     'POIUYTRDS',
//     'LKJHGVCX',
//     'NBVCXwdefPOIUYfewTR',
//     'pp1t',
//     'e',
//     '090xcv0hdj2',
//     '66plz',
//     'qedoo2',
//     'efoxcvejroc',
//     'E',
//     '213ed1e',
//     'we2ee34',
//     '20dExczvzcxvEeewjg',
//     '55DEw25fewdefwc',
//   ];
//   mix.sort(() => Math.random() - 0.5);
//   for (let i = 0; i < tempPW.length; i++) {
//     let each = mix[+tempPW[i]];
//     let tempEach = each.split('');
//     tempEach.sort(() => Math.random() - 0.5);
//     tempEach = tempEach.join('');
//     str += tempEach;
//   }
//   pwConfirmed = str;
//   if (pwConfirmed.length > 500) {
//     let temp = pwConfirmed.split('');
//     temp.splice(0, 499);
//     pwConfirmed = temp;
//   }
//   return pwConfirmed;
// };

// exports.temp = async (req, res) => {
//   for (let i = 0; i < 117; i++) {
//     // let hello = pwGenerator();
//     let areyouthere = await List.findOne({ where: { id: i } });
//     if (areyouthere) {
//       await List.update(
//         {
//           privateURL: 'none',
//         },
//         {
//           where: { id: i },
//         },
//       );
//     }
//   }
// };

exports.intro = (req, res) => {
  res.render('main');
};

exports.getList = async (req, res) => {
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
  console.log(req.session.which.id);
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
    console.log(req.body);
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
  console.log(req.body);
  await Comment.destroy({ where: { id: req.body.commentId } });
  res.send({ status: '성공' });
};
