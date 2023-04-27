'use strict';

/**
 * dummy-notification service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::dummy-notification.dummy-notification');
