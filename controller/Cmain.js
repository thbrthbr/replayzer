const { List } = require('../models');
const { Op } = require('sequelize');

exports.intro = (req, res) => {
  res.render('main');
};

exports.getList = async (req, res) => {
  let list = await List.findAll();
  let arr = [];
  for (let i = 0; i < list.length; i++) {
    let obj = {
      fileid: list[i].dataValues.id,
      title: list[i].dataValues.title,
      fileName: list[i].dataValues.fileName,
    };
    arr.push(obj);
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
  res.render(response.fileName);
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
