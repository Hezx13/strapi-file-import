module.exports = [
  {
    method: 'POST',
    path: '/upload-excel',
    handler: 'myController.uploadExcel',
    config: {
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/get-content-types',
    handler: 'myController.fetchContentTypes',
    config: {
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/get-content-schema',
    handler: 'myController.fetchContentSchema',
    config: {
      auth: false,
    },
  },
  
];
