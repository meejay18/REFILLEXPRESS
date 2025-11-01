'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.belongsTo(models.User, {
  foreignKey: 'userId',
  as: 'user'
});

    }
  }
  Review.init({
    
        id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
userId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      
   rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5
        }
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false
      },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },  {
      sequelize,
      modelName: 'Review',
      tableName: 'reviews',
      timestamps: false
    }
);
  return Review;
};