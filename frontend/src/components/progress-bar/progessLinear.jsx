/* eslint-disable consistent-return */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Typography } from '@mui/material';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { varAlpha } from 'src/theme/styles';

// Import the necessary actions

export default function ProgressLinear() {
  const dispatch = useDispatch();
  const { progress, isStartVerification } = useSelector((state) => state.fileUpload);

  // Use effect to simulate uploading process
  useEffect(() => {
    if (isStartVerification) {
      const interval = setInterval(() => {
        if (progress < 100) {
          console.log('uploading')
        } else {
          clearInterval(interval); // Stop the interval when progress reaches 100
        }
      }, 100); // Update progress every 100ms

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [isStartVerification, progress, dispatch]);

  return (
    <Box sx={{ p: 3, pt: 3}}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography fontSize={14} fontWeight={500}>
          {isStartVerification ? 'Email Verification in Progress ' : 'Uploading Email List'}
        </Typography>
        <Typography fontSize={14} fontWeight={500}>{`${progress.toFixed(0)}%`}</Typography>
      </Box>

      <LinearProgress
        color={isStartVerification ? 'success' : 'warning'}
        variant="determinate"
        value={progress}
        sx={{
          width: 1,
          height: 8,
          bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.16),
          [`& .${linearProgressClasses.bar}`]: { opacity: 0.8 },
        }}
      />
    </Box>
  );
}
