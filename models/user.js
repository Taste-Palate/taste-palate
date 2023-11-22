module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      email: {
        type: DataTypes.STRING(40),
        allowNull: false,
        unique: true
      },
      nick: {
        type: DataTypes.STRING(15),
        allowNull: false
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false
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
    db.User.hasMany(db.Post, { foreignKey: "author", sourceKey: "id" });
  };
  return User;
};
