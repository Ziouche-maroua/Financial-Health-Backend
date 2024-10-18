const { getDataConnect, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'Financial-Health-Backend',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

