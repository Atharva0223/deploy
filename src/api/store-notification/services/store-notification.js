'use strict';

/**
 * store-notification service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::store-notification.store-notification');
