import { Box, Card, Tooltip, Typography } from '@mui/material';

// import { CONFIG } from 'src/config-global';

// import VideoModal from '../app-video-modal/video-modal';

// const imageSrc='./assets/images/emailImg.jpg'

import imageSrc from '../../assets/images/emailImg.jpg'

export default function AppBigCard({
  getHelp,
  isVideo,
  coverSrc,
  items,
  style,
  action,
  videoLink,
  tooltip,
  thumbnailName,
  bigcardtitle,
  bigcardsubtitle,
  learnMoreLink = '#', // Added default prop for learn more link
}) {
  return (
    <Card sx={{ p: 5 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          justifyContent: 'space-between',
          alignItems:{ xs: 'flex-start', lg: 'center'} ,
          mb: 0,
          gap: 3,
        }}
      >
        <Box width={{ xs: '100%', lg: '60%' }}>
          <Box>
            <Box sx={{ mb: 1 }}>
              <Typography variant="h6">
                <Tooltip arrow placement="top" title={tooltip}>
                 <span>
                  {bigcardtitle}

                 </span>
                </Tooltip>
              </Typography>

              <Typography color="#637381" fontSize="14px" fontWeight={500} mt={1}>
                {bigcardsubtitle}
              </Typography>
            </Box>
            <Box component="ul" sx={style} p={1} pb={2}>
              {items.map((item, index) => (
                <li key={index}>
                  <Typography variant="body2" fontWeight={500} color="#637381">
                    {item}{' '}
                   
                  </Typography>
                </li>
              ))}
            </Box>

            {action}
          </Box>
        </Box>
        <Box  sx={{
    display: {
      xs: 'none', // hidden on extra-small
      sm: 'none', // hidden on small
      md: 'none', // hidden on medium
      lg: 'block', // visible on large and above
    },
  }}>
        <img style={{ height: 200, marginRight: 50 }} src={imageSrc} alt="Email verification process" />

        </Box>
      </Box>
    </Card>
  );
}