const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ProfilePicture = sequelize.define('ProfilePicture', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    filename: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    url: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'profile_pictures',
    timestamps: true,
    indexes: [
      {
        fields: ['user_id']
      }
    ]
  });

  return ProfilePicture;
};