import React from 'react';
import { Card, Box, Typography, CardContent } from '@mui/material';

const workingSteps = [
  {
    id: 1,
    title: 'Creation',
    description:
      'Investigator generates case, handpicks data for investigation, assembling crucial information for further analysis.',
  },
  {
    id: 2,
    title: 'Upload',
    description:
      'Then uploads, normalizes, validates, and ingests data, ensuring accurate and reliable information for processing',
  },
  {
    id: 3,
    title: 'Analyze',
    description:
      'AI engine extracts entity names, analyzes fund flows, detects suspicious transactions, unveiling potential irregularities',
  },
  {
    id: 4,
    title: 'Generation',
    description:
      'Data is generated and normalized, ensuring consistency and compatibility for seamless processing and analysis',
  },
  {
    id: 5,
    title: 'Report',
    description:
      'Reports are generated and made accessible for viewing, presenting comprehensive insights and findings.',
  },
];

function Steps() {
  return (
    <>
      {workingSteps.map((step, i) => (
        <Card
          sx={{
            // width: "28%",
            width: '320px',
            textAlign: 'center',
            bgcolor: 'white',
            my: '2%',
            mx: '1%',
            zIndex: '1'
          }}
          elevation={0}
          key={i}
        >
          <Box
            sx={{
              height: '100px',
              width: '100px',
              margin: 'auto',
              display: 'flex',
              mt: 6,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography
              variant="h2"
              color={'#6CBCFC'}
              fontSize={'5rem'}
              fontWeight="900"
            >
              {step.id}
            </Typography>
          </Box>
          <CardContent>
            <Typography
              variant="h4"
              color="primary.main"
              mt={4}
              mb={2}
              fontSize={'2rem'}
              fontWeight="700"
            >
              {step.title}
            </Typography>
            <Typography color="primary.light" fontWeight="600">
              {step.description}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </>
  );
}

export default Steps;
