import React from 'react';
import { Card, Box, CardContent, Typography } from '@mui/material';

const cardData = [
  {
    title: 'Search People',
    description:
      'Efficiently search and locate specific targets using an extensive dataset with precision and speed.',
    imageSrc: './search-icon.svg',
  },
  {
    title: 'Detailed Report',
    description:
      'Generate comprehensive and detailed reports that provide in-depth insights and analysis.',
    imageSrc: './report-icon.svg',
  },
  {
    title: 'Scan Documents',
    description:
      'Effortlessly scan and analyze documents with accuracy and efficiency.',
    imageSrc: './document-icon.svg',
  },
];

function Cards() {
  return (
    <>
      {cardData.map((card, index) => (
        <Card
          key={index}
          sx={{ width: '340px', mx: 2, my: 2, textAlign: 'center' }}
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
            <img
              style={{
                objectFit: 'contain',
                width: '100%',
                height: '100%',
              }}
              src={card.imageSrc}
              alt=""
            />
          </Box>
          <CardContent>
            <Typography
              variant="h4"
              color="primary.main"
              fontWeight="700"
              mt={4}
              mb={2}
              fontSize={'2rem'}
            >
              {card.title}
            </Typography>
            <Typography color="primary.light">{card.description}</Typography>
          </CardContent>
        </Card>
      ))}
    </>
  );
}

export default Cards;
