"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Products", {
      product_id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      product_category: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      product_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      product_price: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      product_availability: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      product_quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      product_unit: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      product_filename: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      product_github_image_link: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      product_local_image_link: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      product_description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      product_ratings: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
  },
};