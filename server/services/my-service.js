'use strict';

const checkFileType = (file) =>{
  const excelMimeTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
  const jsonMimeType = 'application/json';

  if (excelMimeTypes.includes(file.type)) {
    return 'Excel';
  } else if (file.type === jsonMimeType) {
    return 'JSON';
  } else {
    const extension = file.name.split('.').pop().toLowerCase();
    if (extension === 'xlsx' || extension === 'xls') {
      return 'Excel';
    } else if (extension === 'json') {
      return 'JSON';
    } else {
      return 'Unknown';
    }
  }
}

const getContentSchema = async (contentName) => {
  const fs = (await import('fs')).default;

  const schemaFilePath = `src/api/${contentName}/content-types/${contentName}/schema.json`;
  try {

    const schema = JSON.parse(fs.readFileSync(schemaFilePath, 'utf8'));
    let attributes = schema.attributes;
    const isLocalized = schema.pluginOptions?.i18n?.localized
    Object.keys(schema.attributes).forEach(key => {
      attributes[key] = null;
    });
    if (isLocalized) 
    attributes['locale'] = null
    return attributes;

  } catch (err) {
    console.error
    return null;
  }
  
}

const getContentSchemaWithTypes = async (contentName) => {
  const fs = (await import('fs')).default;

  const schemaFilePath = `src/api/${contentName}/content-types/${contentName}/schema.json`;
  try {

    const schema = JSON.parse(fs.readFileSync(schemaFilePath, 'utf8'));
    let attributes = schema.attributes;
    
    const isLocalized = schema.pluginOptions?.i18n?.localized
    if(isLocalized) {
      const locs = await strapi.plugins['i18n'].services.locales.findLocales();
      console.log(locs)
    }
    Object.keys(schema.attributes).forEach(key => {
      attributes[key] = schema.attributes[key].type;
    });
    if (isLocalized) 
    attributes['locale'] = 'uk'
    return attributes;

  } catch (err) {
    console.error
    return null;
  }
  
}

const getLocales = async () =>{
  fetch('http://127.0.0.1:1337/api/i18n/locales')
  .then(response => response.json())
  .then(data => {
    console.log(data)
  })
  .catch(error => {
    console.error('Error fetching locales:', error);
    return []
  });
}

module.exports = ({ strapi }) => ({
     checkFileType(file){
    const excelMimeTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    const jsonMimeType = 'application/json';
  
    if (excelMimeTypes.includes(file.type)) {
      return 'Excel';
    } else if (file.type === jsonMimeType) {
      return 'JSON';
    } else {
      const extension = file.name.split('.').pop().toLowerCase();
      if (extension === 'xlsx' || extension === 'xls') {
        return 'Excel';
      } else if (extension === 'json') {
        return 'JSON';
      } else {
        return 'Unknown';
      }
    }
  },
  
  async getContentSchema  (contentName){
    const fs = (await import('fs')).default;
  
    const schemaFilePath = `src/api/${contentName}/content-types/${contentName}/schema.json`;
    try {
  
      const schema = JSON.parse(fs.readFileSync(schemaFilePath, 'utf8'));
      let attributes = schema.attributes;
      const isLocalized = schema.pluginOptions?.i18n?.localized
      Object.keys(schema.attributes).forEach(key => {
        attributes[key] = null;
      });
      if (isLocalized) 
      attributes['locale'] = null
      return attributes;
  
    } catch (err) {
      console.error
      return null;
    }
    
  },
  
  async getContentSchemaWithTypes(contentName){
    const fs = (await import('fs')).default;
    
    const schemaFilePath = `src/api/${contentName}/content-types/${contentName}/schema.json`;
    try {
  
      const schema = JSON.parse(fs.readFileSync(schemaFilePath, 'utf8'));
      let attributes = schema.attributes;
      let locs;
      const isLocalized = schema.pluginOptions?.i18n?.localized
      if(isLocalized) {
        locs = await strapi.plugins['i18n'].services.locales.find();
        if (locs) {
          locs = locs.map(locale => locale.code)
        }
      }
      Object.keys(schema.attributes).forEach(key => {
        attributes[key] = schema.attributes[key].type;
      });
      if (isLocalized) 
      attributes['locale'] = locs
      return attributes;
  
    } catch (err) {
      console.error(err)
      return null;
    }
    
  }
});
