const { User, Post } = require("../models");

exports.getPosts = async (req, res, next) => {
  try {
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
      message: "예기치 못한 에러가 발생했습니다 관리자에게 문의 해주세요."
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
      message: "예기치 못한 에러가 발생했습니다 관리자에게 문의 해주세요."
    });
  }
};

exports.getPostDetail = async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.id },
      attributes: ["id", "title", "content", "imagePath", "rating", "location", "createdAt", "updatedAt", "author"],
      include: [
        {
          model: User,
          attributes: ["nick", "email"]
        }
      ]
    });

    if (!post) {
      return res.status(401).json({
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
      message: "Error!"
    });
  }
};

exports.createPost = async (req, res, next) => {
  try {
    const { title, content, imagePath, rating, location } = req.body;

    // 유저 찾기
    const user = await User.findOne({
      where: { email: res.locals.user.email }
    });

    const post = new Post({
      userId: User.id,
      title,
      content,
      imagePath,
      rating,
      location
    });

    await post.save();

    if (!title || !content || !imagePath || !rating || !location) {
      // 공란이 있으면 작성 실패
      if (title) {
        alert("제목을 작성해주세요");
      } else if (content) {
        alert("내용을 작성해주세요");
        return;
      } else if (imagePath) {
        alert("이미지를 삽입해주세요");
        return;
      } else if (rating) {
        alert("별점을 등록해주세요");
        return;
      } else if (location) {
        alert("위치를 설정해주세요");
        return;
      }
    } else {
      return res.status(200).json({
        success: true,
        message: "게시글 등록에 성공하였습니다."
      });
    }
  } catch (errMessage) {
    console.log(errMessage);
    return res.status(405).json({
      success: false,
      message: "공란이 없게 작성해주세요"
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
  } catch (error) {
    res.status(500).json({
      message: "오류가 발생했습니다."
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
  } catch (error) {
    res.status(500).json({
      message: "오류가 발생했습니다."
    });
  }
};
