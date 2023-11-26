const { User, Post } = require("../models");
const { Op } = require("sequelize");

exports.getPosts = async (req, res, next) => {
  try {
    const post = await Post.findAll({
      attributes: ["id", "title", "content", "imagePath", "rating", "location", "createdAt", "updatedAt", "author"],
      include: [
        {
          model: User,
          attributes: ["nick", "email"]
        }
      ],
      order: [
        ["createdAt", "DESC"] // Order by createdAt in descending order
      ]
    });

    if (post.length === 0) {
      return res.status(400).json({
        success: false,
        message: "목록 조회 실패"
      });
    }

    return res.json({
      success: true,
      message: "목록 조회 성공",
      post
    });
  } catch (errMessage) {
    console.log(errMessage);

    return res.status(500).json({
      success: false,
      message: "예기치 못한 에러가 발생했습니다. 관리자에게 문의 해주세요."
    });
  }
};

exports.getMyPosts = async (req, res) => {
  try {
    // 이것들로 유저 찾을거임
    const user = await User.findOne({
      where: { email: res.locals.user.email }
    });

    const post = await Post.findAll({
      attributes: ["id", "title", "content", "imagePath", "rating", "location", "createdAt", "updatedAt", "author"],
      include: [
        {
          model: User,
          attributes: ["nick", "email"]
        }
      ]
    });

    if (!post) {
      return res.status(400).json({
        success: false,
        message: "나의 목록 조회 실패"
      });
    }
    return res.json({
      success: true,
      message: "나의 목록 조회 성공",
      post
    });
  } catch (errMessage) {
    console.log(errMessage);
    return res.status(500).json({
      success: false,
      message: "예기치 못한 에러가 발생했습니다. 관리자에게 문의 해주세요."
    });
  }
};

exports.getPostDetail = async (req, res, next) => {
  try {
    const post = await Post.findAll({
      where: {
        title: {
          [Op.like]: `%${req.params.title}%`
        }
      },
      attributes: ["id", "title", "content", "imagePath", "rating", "location", "createdAt", "updatedAt", "author"],
      include: [
        {
          model: User,
          attributes: ["nick", "email"]
        }
      ],
      order: [
        ["createdAt", "DESC"] // Order by createdAt in descending order
      ]
    });

    if (post.length === 0) {
      return res.status(400).json({
        success: false,
        message: "상세 조회 실패",
        post
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "상세 조회 성공",
        post
      });
    }
  } catch (errMessage) {
    console.log(errMessage);
    return res.status(500).json({
      success: false,
      message: "예기치 못한 에러가 발생했습니다. 관리자에게 문의 해주세요."
    });
  }
};

exports.createPost = async (req, res, next) => {
  const { title, content, rating, location } = req.body;
  if (!title || !content || !rating || !location) {
    res.status(400).json({message: "공란이 없게 작성해주세요."})
  }

  let imagePath = null;
  if (req.files) {
    imagePath = req.files.map((file) => file.location).join(",");
  }
  //여기서 해야한다.
  try {
    // 유저 찾기
    const user = await User.findOne({
      where: { email: res.locals.user.email }
    });


    const post = await Post.create({
      title,
      content,
      imagePath,
      rating,
      location
    });
    await user.addPost(post);

    //user.addPost하기

    return res.status(200).json({
      success: true,
      message: "게시글 등록이 완료되었습니다."
    });
  } catch (errMessage) {
    console.log(errMessage);
    return res.status(500).json({
      success: false,
      message: "예기치 못한 에러가 발생했습니다. 관리자에게 문의 해주세요."
    });
  }
};

exports.putPost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.id } });
    const { title, content, imagePath, rating, location } = req.body;

    if (!title || !content || !imagePath || !rating || !location) {
      return res.status(400).json({
        message: "공란이 없게 작성해주세요."
      });
    }
    if (!post) {
      return res.status(404).json({
        message: "게시글이 존재하지 않습니다."
      });
    }
    if (post.author !== res.locals.user.id) {
      return res.status(401).json({
        message: "게시글을 수정할 권한이 존재하지 않습니다."
      });
    }

    post.title = title;
    post.content = content;
    post.imagePath = imagePath;
    post.rating = rating;
    post.location = location;

    await post.save();
    return res.json("게시글 수정이 완료되었습니다.")
  } catch (errMessage) {
    res.status(500).json({
      success: false,
      message: "예기치 못한 에러가 발생했습니다. 관리자에게 문의 해주세요."
    });
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.id } });

    if (!post) {
      return res.status(404).json({
        message: "게시글이 존재하지 않습니다."
      });
    }
    if (post.author !== res.locals.user.id) {
      return res.status(401).json({
        message: "게시글을 삭제할 권한이 존재하지 않습니다."
      });
    }
    await post.destroy();
    return res.json("게시글 삭제가 완료되었습니다.");
  } catch (errMessage) {
    res.status(500).json({
      success: false,
      message: "예기치 못한 에러가 발생했습니다. 관리자에게 문의 해주세요."
    });
  }
};
