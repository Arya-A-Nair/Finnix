import React from 'react';
import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';
import Footer from '../../components/Landing/Footer/Footer';
import ScrollToTopButton from '../../components/Landing/ScrollToTopButton/ScrollToTopButton';
import Cards from '../../components/Landing/Cards';
import Steps from '../../components/Landing/Steps';

function Home() {
  const theme = useTheme();
  return (
    <>
      <Box
        id="home"
        component="section"
        className="container"
        justifyContent="initial"
        flexDirection={{
          xl: 'row',
          lg: 'row',
          md: 'row',
          sm: 'column',
          xs: 'column',
        }}
      >
        <Typography
          fontSize={{
            xl: '4rem',
            lg: '3rem',
            md: '2rem',
            sm: '2rem',
            xs: '1.6rem',
          }}
          width={{ xl: '60%', lg: '60%', md: '60%', sm: '80%', xs: '100%' }}
          color="primary"
          fontWeight="700"
          textAlign={{
            xl: 'left',
            lg: 'left',
            md: 'left',
            sm: 'center',
            xs: 'center',
          }}
        >
          Fast track investigations with{' '}
          <span
            style={{
              color: theme.palette.primary.light,
            }}
          >
            Automated Data
          </span>{' '}
          Analytics
        </Typography>
        <Box
          width={{
            xl: '56vw',
            lg: '56vw',
            md: '56vw',
            sm: '100%',
            xs: '100%',
          }}
        >
          <img
            style={{
              objectFit: 'cover',
              width: '100%',
              height: '100%',
            }}
            src="/home-photo.png"
            alt=""
          />
        </Box>
      </Box>
      <Box id="features" className="container" justifyContent="center">
        <Box display="flex" alignItems="center" flexDirection="column">
          <Typography
            variant="h3"
            color="primary"
            textAlign="center"
            fontWeight={'700'}
          >
            Features
          </Typography>
          <Typography
            variant="p"
            color="primary.light"
            textAlign="center"
            sx={{
              mx: 6,
              mt: 2,
              mb: 4,
            }}
          >
            This powerful tool aids in the investigation of various financial
            crimes, including embezzlement, non-performing assets, fraudulent
            investment schemes, tax fraud, money laundering, and other illicit
            financial activities.
          </Typography>
          <Box
            width={'100%'}
            bgcolor="primary.main"
            display={'flex'}
            justifyContent={'center'}
            component={Card}
            flexWrap={'wrap'}
          >
            <Cards />
          </Box>
        </Box>
      </Box>
      <Box id="stats" className="container" justifyContent="center" mt={20}>
        <Box display="flex" alignItems="center" flexDirection="column">
          <Typography
            variant="h3"
            color="primary"
            textAlign="center"
            fontWeight={'700'}
          >
            Stats
          </Typography>
          <Box
            display={'flex'}
            alignItems={'center'}
            flexDirection={{
              xl: 'row',
              lg: 'row',
              md: 'row',
              sm: 'column',
              xs: 'column',
            }}
          >
            <Typography
              fontSize={{
                xl: '2rem',
                lg: '2rem',
                md: '2rem',
                sm: '1.5rem',
                xs: '1rem',
              }}
              width={{
                xl: '60%',
                lg: '60%',
                md: '60%',
                sm: '100%',
                xs: '100%',
              }}
              color="primary"
              fontWeight={'600'}
              zIndex={2}
              m={4}
              textAlign={{
                xl: 'left',
                lg: 'left',
                md: 'left',
                sm: 'center',
                xs: 'center',
              }}
            >
              Money laundering is a serious crime in India, with over 5,000
              cases filed and 25 convictions till now. The value of bank frauds,
              a major source of money laundering, was 604 billion rupees in
              2022.
            </Typography>
            <img
              src="/stats-bg-gradient.svg"
              alt=""
              style={{ position: 'absolute', width: '50vw' }}
            />
            <Box
              width={{
                xl: '56vw',
                lg: '56vw',
                md: '56vw',
                sm: '100%',
                xs: '100%',
              }}
              className="stats-img-container"
            >
              <img
                style={{
                  objectFit: 'cover',
                  width: '100%',
                  height: '100%',
                }}
                src="./News Stats.png"
                alt=""
              />
            </Box>
          </Box>
        </Box>
      </Box>
      <Box id="working" className="container" justifyContent="center" mt={20}>
        <Box display="flex" alignItems="center" flexDirection="column">
          <Typography
            variant="h3"
            color="primary"
            textAlign="center"
            fontWeight={'700'}
          >
            Working
          </Typography>
          <Typography
            variant="p"
            color="primary.light"
            textAlign="center"
            fontWeight="600"
            sx={{
              mx: 6,
              mt: 2,
              mb: 4,
            }}
          >
            Experience the seamless functionality of our application, as it
            efficiently processes and analyzes data, uncovers patterns, detects
            anomalies, and generates comprehensive reports, empowering users
            with actionable insights and facilitating effective decision-making.
          </Typography>
          <Box
            width={'100%'}
            display={'flex'}
            justifyContent={'center'}
            flexWrap={'wrap'}
            position={'relative'}
          >
            <Steps />
          </Box>
        </Box>
      </Box>
      <Footer />
      <ScrollToTopButton />
    </>
  );
}

export default Home;
