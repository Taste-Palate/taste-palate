exports.getMyPosts = (req, res) => {
  console.log("내 게시글 모두 조회가 실행되었습니다.");
  res.json("내 게시글 모두 조회가 실행되었습니다.");
  return;
};

exports.getPosts = async (req, res, next) => {
  console.log("게시글 모두 조회가 실행되었습니다.");
  res.json("게시글 모두 조회가 실행되었습니다.");
  return;
};

exports.getPostDetail = async (req, res, next) => {
  console.log("게시글 상세 조회가 실행되었습니다.");
  res.json("게시글 상세 조회가 실행되었습니다.");
  return;
};

exports.createPost = async (req, res, next) => {
  console.log("게시글 추가가 실행되었습니다.");
  res.json("게시글 추가가 실행되었습니다.");
  return;
};

exports.patchPost = async (req, res, next) => {
  console.log("게시글 수정이 실행되었습니다.");
  res.json("게시글 수정이 실행되었습니다.");
  return;
};

exports.deletePost = async (req, res, next) => {
  console.log("게시글 삭제가 실행되었습니다.");
  res.json("게시글 삭제가 실행되었습니다.");
  return;
};
