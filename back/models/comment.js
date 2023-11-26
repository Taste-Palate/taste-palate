module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "Comment",
    {
      remark: {
        type: DataTypes.STRING(255),
        allowNull: false
      }
    },
    {
      timestamps: true,
      underscored: false,
      modelName: "Comment",
      tableName: "comments",
      charset: "utf8",
      collate: "utf8_general_ci"
    }
  );

  Comment.associate = (db) => {
    db.Comment.belongsTo(db.User, { foreignKey: "nick", targetKey: "nick" });
    db.Comment.belongsTo(db.Post, { foreignKey: "postId", targetKey: "id" }); //이부분 조심
  };

  // 추가적인 관계 설정이나 메서드 등이 필요하면 여기에 추가할 수 있습니다.

  return Comment;
};
