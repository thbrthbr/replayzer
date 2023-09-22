const { List } = require('../models');
const { Op } = require('sequelize');

let dataQueue = ['0'];

exports.intro = (req, res) => {
  res.render('main');
};

exports.getList = async (req, res) => {
  let list = await List.findAll();
  console.log(list);
  let arr = [];
  for (let i = 0; i < list.length; i++) {
    let obj = {
      title: list[i].dataValues.title,
      fileName: list[i].dataValues.fileName,
    };
    arr.push(obj);
  }
  res.send({ data: arr });
};

exports.show = (req, res) => {
  res.render('open');
};

exports.select = (req, res) => {
  try {
    console.log(req.body);
    dataQueue.shift();
    dataQueue.push(req.body.data);
    console.log(dataQueue);
    res.send('성공');
  } catch (e) {
    res.send('실패');
  }
};

exports.upload = async (req, res) => {
  try {
    let arr = [];
    let openArr = [];
    console.log(req.files);
    for (let i = 0; i < req.files.length; i++) {
      let name = req.files[i].originalname.split('.')[0];
      arr.push(name);
      openArr.push(req.files[i].filename);
      let response = await List.create({
        title: name,
        fileName: req.files[i].filename,
      });
    }
    res.send({ status: '성공', dataName: arr, open: openArr });
  } catch (e) {
    console.log('error: ', e);
    res.send({ status: '실패' });
  }
};

exports.load = (req, res) => {
  res.send({ data: dataQueue[0] });
};

exports.replayShow = (req, res) => {
  console.log(req.params);
  res.render(dataQueue[0]);
};
