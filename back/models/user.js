module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      email: {
        type: DataTypes.STRING(40),
        allowNull: false,
        unique: true
      },
      selfIntroduction: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: "자기소개를 입력해주세요"
      },
      nick: {
        type: DataTypes.STRING(15),
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      uuid: {
        type: DataTypes.STRING(40),
        allowNull: false,
      }
    },
    {
      timestamps: false,
      underscored: false,
      modelName: "User",
      tableName: "users",
      paranoid: true,
      charset: "utf8",
      collate: "utf8_general_ci"
    }
  );

  User.associate = (db) => {
    db.User.hasMany(db.Comment, { foreignKey: "nick", sourceKey: "nick" });
    db.User.hasMany(db.Post, { foreignKey: "author", sourceKey: "id" });
  };
  return User;
};
