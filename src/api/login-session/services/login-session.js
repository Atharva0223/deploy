'use strict';

/**
 * login-session service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::login-session.login-session');
