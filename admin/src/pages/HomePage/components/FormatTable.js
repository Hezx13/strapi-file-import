import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Box, Typography } from '@strapi/design-system';

const FormatTable = ({ data }) => {
    const ROW_COUNT = 6;
    const COL_COUNT = 10;

    let dataKeys = [];
     Object.keys(data).forEach(key => {
        dataKeys.push(key);
      })
      console.log(Object.keys(data))
      console.log(data)

    return <Box background="neutral100">
        <Table colCount={COL_COUNT} rowCount={ROW_COUNT}>
          <Thead>
            <Tr>
            {dataKeys.map(key => 
            <Th key={key}>
                <Typography 
                style={{textTransform: 'none'}}
                variant="sigma">{key}</Typography>
              </Th>)
            }
            </Tr>
          </Thead>
          <Tbody>
          <Tr>
            {dataKeys && dataKeys.map(entry => 
                <Td key={entry}>
                    <Typography >{data[entry]}</Typography>
                </Td>                
              )}
              </Tr>
          </Tbody>
        </Table>
      </Box>;
  }


export default FormatTable;
