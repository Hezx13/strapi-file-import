'use strict';

module.exports = ({ strapi }) => ({

  async uploadExcel(ctx) {   
    const readExcel = (await import('read-excel-file/node')).default;
    const myService = await import('../services/my-service.js');

    const { checkFileType, getContentSchema }  = myService.default({ strapi: strapi });
    const fs = (await import('fs')).default;

    try {
      const { selectedContent, selectedFileType } = ctx.request.body;
      const file = ctx.request.files.file; // The file passed from the frontend
      const filetype = await checkFileType(file)
      
      if (selectedFileType !== filetype) {
        ctx.throw(400, `Wrong file format`);
        return;
      }
      
      const schema = await getContentSchema(selectedContent);

      if (selectedFileType === 'Excel') {
        const rows = await readExcel(file.path);
        //console.log(rows); // This will log all rows to the server console
        
        for (const row of rows) {
          // Skip header row if present
          if (rows.indexOf(row) === 0) continue;

          // Map the row to your items structure. This example assumes each
          // row is an array of [partNumber, brand, category, available]
          let itemData = schema;
          console.log(itemData);
          Object.keys(itemData).forEach(key => {
            itemData[key] = row[Object.keys(itemData).indexOf(key)].toString();
          })

          await strapi.entityService.create(`api::${selectedContent}.${selectedContent}`, {
            data: itemData,
          });
        }
      }

      if (selectedFileType === 'JSON'){
        const itemData = JSON.parse(fs.readFileSync(file.path, 'utf8'));
        console.log(itemData);

        for (let dataInstance of itemData) {
          await strapi.entityService.create(`api::${selectedContent}.${selectedContent}`, {
            data: dataInstance,
          });
        }

      }

      // Wait for all Promises to resolve
      ctx.body = 'File processed. Check server logs for details.';
      console.log('File processed. Check server logs for details.');
    } catch (error) {
      console.log(error.message);
      ctx.throw(500, `Error processing file: ${error.message}`);
    }
  },

  async fetchContentTypes(ctx){
    const fs = (await import('fs')).default;

    fs.readdir('src/api', { withFileTypes: true }, (error, files) => {
      if (error) throw error;
      const directoriesInDIrectory = files
          .filter((item) => item.isDirectory())
          .map((item) => item.name);
  
      console.log("Found content types: " + directoriesInDIrectory);
      const response = {
        message: 'Success',
        data: directoriesInDIrectory
      }
      ctx.status = 200
      ctx.body = response
  });
  },

  async fetchContentSchema(ctx) {
    const myService = await import('../services/my-service.js');

    const { getContentSchemaWithTypes } = myService.default({ strapi: strapi });
    const {selectedContent} = ctx.request.query;
    const schema = await getContentSchemaWithTypes(selectedContent);
    const response = {
      message: 'Success',
      data: schema
    }
    ctx.status = 200;
    ctx.body = response;
    return;
  },

});
