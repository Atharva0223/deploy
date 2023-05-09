'use strict';

/**
 * upskill service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::upskill.upskill');
