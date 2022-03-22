const { Users, Articles } = require('../models')

// 게시글 전체 목록 조회
const getAllArticles = async (req, res) => {
  try {
    const articles = await Articles.findAll({
      include: [
        { model: Users, attributes: ["nickname"] },
      ],
      raw: true	
    });
    res.json({
      articles,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({});
  }
};

// 게시글 상세 조회
const getArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    const article = await Articles.findOne({
      include: [
        { model: Users, attributes: ["nickname"]}
      ],
      where: { articleId },
      raw: true	
     });
     console.log(article)
    res.status(200).render('detail', { article });
  } catch (err) {
    console.log(err);
    res.status(400).send({});
  }
};

// 게시글 작성
const postArticle = async (req, res) => {
  const { title, content } = req.body;
  const { userId } = res.locals;
  await Articles.create({
    userId,
    title,
    content,
  });
  res.json({ success: true });
};

// 게시글 수정 페이지 로드
const editPage = async (req, res) => {
  try {
    const { articleId } = req.params;
    const article = await Articles.find({ articleId });
    res.status(200).render('edit', { article });
  } catch (err) {
    res.status(400).send({});
  }
};

// 게시글 작성자와 로그인한 유저가 동일한지 확인 (수정페이지)
const checkHost = async (req, res) => {
  try {
    const { articleId } = req.params;
    const article = await Articles.find({ articleId });
    const author = article[0].nickname;
    const nickname = res.locals['user']['nickname'];
    if (author === nickname) {
      res.json({ result: true });
    } else {
      res.json({ result: false });
    }
  } catch (err) {
    res.status(400).send({});
  }
};

// 게시글 수정
const editArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    const { title, content } = req.body;
    const existsArticle = await Articles.find({ articleId });
    if (!existsArticle.length) {
      return res.status(400).json({
        success: false,
        errorMessage: '해당 게시글은 삭제된 상태입니다.',
      });
    }
    await Articles.updateOne({ articleId }, { $set: { title, content } });
    res.status(200).send({});
  } catch (err) {
    res.status(400).send({});
  }
};

// 게시글 삭제
const deleteArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    await Articles.deleteOne({ articleId });
    res.status(200).send({});
  } catch (err) {
    res.status(400).send({});
  }
};

module.exports = {
  getAllArticles,
  getArticle,
  postArticle,
  editPage,
  checkHost,
  editArticle,
  deleteArticle,
};
