module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "Post",
    {
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validator: {}
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      imagePath: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      location: {
        type: DataTypes.STRING(255),
        allowNull: true
      }
    },
    {
      timestamps: true,
      underscored: false,
      modelName: "Post",
      tableName: "posts",
      charset: "utf8",
      collate: "utf8_general_ci"
    }
  );

  Post.associate = (db) => {
    db.Post.belongsTo(db.User, { foreignKey: "author", targetKey: "id" });
    db.Post.hasMany(db.Comment, { foreignKey: "postId", sourceKey: "id" });
  };

  // 추가적인 관계 설정이나 메서드 등이 필요하면 여기에 추가할 수 있습니다.

  return Post;
};
