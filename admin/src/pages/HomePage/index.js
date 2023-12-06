/*
 *
 * HomePage
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';
import { Button } from '@strapi/design-system';
import { Grid, GridItem,Typography } from '@strapi/design-system';
import { File, Trash } from '@strapi/icons';
import {
  SingleSelect,
  SingleSelectOption,
  MultiSelect,
  MultiSelectOption,
  Loader,
  JSONInput,
  Icon,
  IconButton,
  Box
} from '@strapi/design-system';

import FormatTable from './components/FormatTable';

const HomePage = () => {

  const [status, setStatus] = React.useState(0)
  const [contentTypes, setContentTypes] = React.useState([])
  const [file, setFile] = React.useState(null)
  const [selectedContent, setSelectedContent] = React.useState(null)
  const [selectedFileType, setSelectedFileType] = React.useState(null)
  const [contentSchema, setContentSchema] = React.useState(null)
  const [isUploading, setIsUploading] = React.useState(false);

  React.useEffect(() => {
    fetchContentTypes();
  },[])

  React.useEffect(() => {
    if (selectedContent)
    fetchContentSchema();
  }, [selectedContent])
  
  const fetchContentSchema =async () => {
    const response = await fetch('http://localhost:1337/file-import/get-content-schema?' + new URLSearchParams({
      selectedContent: selectedContent
    })).then(response => response.json()) // Transform the data into json
    .then(data => {
      setContentSchema(data.data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

  async function fetchContentTypes(){
      const response = await fetch('http://localhost:1337/file-import/get-content-types')
      .then(response => response.json()) // Transform the data into json
      .then(data => {
        setContentTypes(data.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    
    }

    const hadnleSubmitFile = async (event) => {
      setFile(event.target.files[0])
    }

    const handleRemoveFile = async () => {
      setFile(null);
    }


  const handleUploadContent = async (event) => {
    setIsUploading(true);
    if (!selectedFileType || !selectedContent){ 
      setIsUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('selectedContent', selectedContent);
    formData.append('selectedFileType', selectedFileType);
    try {
      const response = await fetch('http://localhost:1337/file-import/upload-excel', {
        method: 'POST',
        body: formData,
      });
  
      console.log(response);
      setStatus(response.status);
      setIsUploading(false);
    } catch (error) {
      setStatus(500);
      setIsUploading(false);
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      <Grid gap={5}>
      <GridItem
      style={{ margin: '10px auto',}}
      col={12} 
      background="primary100"
      >
        <Typography
        style={{ fontSize: '2rem',}}
        variant="alpha"
        >
          File data upload
        </Typography>
      </GridItem>
      <GridItem
      style={{ margin: '10px auto',}}
      col={12} background="primary100">
        <Typography>Select the file and content type you want to upload</Typography>
      </GridItem>
      
      <GridItem
      style={{ margin: '20px',}}
      col={6}
      >
      <SingleSelect 
        label="Import to" 
        disabled={!contentTypes.length} 
        onChange={setSelectedContent} 
        value={selectedContent}
      >
        {
          contentTypes.map((contentType) =>(
            <SingleSelectOption key={contentType} value={contentType}>{contentType}</SingleSelectOption>
          ))
        }          
        </SingleSelect>
      </GridItem>
      
      <GridItem
      style={{ margin: '20px',}}
      col={6} background="primary100">
        <input
        type="file"
        id="fileInput"
        style={{ display: 'none' }}
        onChange={hadnleSubmitFile}
      />
          <Button 
            style={{ margin: '20px', width: '90%', height: '40px'}}
            onClick={() => document.getElementById('fileInput').click()} 
            variant='secondary'
            >
              Upload
          </Button>


      </GridItem>

        
      <GridItem
      style={{ margin: '0 20px'}}
      col={6}
      >
      <SingleSelect 
        onChange={setSelectedFileType} 
        value={selectedFileType} 
        label="File type" 
        disabled={!contentTypes.length}
      >
            <SingleSelectOption value="Excel">Excel</SingleSelectOption>    
            <SingleSelectOption value="JSON">JSON</SingleSelectOption>    
        </SingleSelect>
      </GridItem>

      <GridItem 
        col={5}
        style={{ 
          margin: '0 20px',
          alignItems: 'center', 
          justifyContent: 'flex-start', 
          display: 'flex'
        }}
        >
          {file &&<>
            <IconButton style={{ 
              margin: '0 20px 0 25px',
              height: '2.4rem',
              width: '2.4rem',
              }} onClick={handleRemoveFile} label="Delete" icon={<Trash />} />
            <Box 
            style={{
              padding: '6px 15px 6px 10px',
              alignItems: 'center',
              justifyContent: 'flex-start',
              display: 'flex',
              backgroundColor: '#212134',
              borderRadius: '4px',
              border: '1px solid #4a4a6a'
              }}
>
            <Icon style={{ marginRight: '5px'}} width="25px" height="auto" color="alternative600" as={File} />
            <Typography>
              {file?.name}
            </Typography>
            </Box>
            {
              isUploading ? 
              <Loader 
              style={{
               margin: '20px'
              }} 
              small
              >
                Loading content...
                </Loader> 
              :
              <Button 
              style={{ 
                margin: '20px',
                width: '100%',
                height: '40px'
              }}
              onClick={handleUploadContent} 
              variant={
                status === 200 ? 'success'
                :
                status === 500 ? 'danger' 
                :
                'default'
              }
              >
              {
                status === 200 ? 'Success'
                :
                status === 500 ? 'Error' 
                :
                'Import'
                }
            </Button>
            }
            
          </>
          }
        </GridItem>

      <GridItem
      style={{ margin: '0 20px',}}
      col={6}
      >
        {   
          contentSchema && 
          <>
              <Typography
                style={{ fontSize: '1.5rem',}}
                variant="alpha"
              >
              JSON schema
              </Typography>
            <JSONInput 
            disabled 
            value={JSON.stringify(contentSchema).replace(/,(?![^\[]*\])/g, ',\n\t').replace(/{/g, '{\n\t').replace(/}/g, '\n}')} 
            />
          </>
          
        }
        {
          contentSchema &&
          <>
            <Typography
              style={{ fontSize: '1.5rem',}}
              variant="alpha"
              >
                Excel table schema
            </Typography>
          <FormatTable data={contentSchema}/> 
          </>
        }
      
      </GridItem>

      </Grid>

      
      
    </div>
  );
};

export default HomePage;
