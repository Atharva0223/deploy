'use strict';

/**
 * login-session controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::login-session.login-session');
