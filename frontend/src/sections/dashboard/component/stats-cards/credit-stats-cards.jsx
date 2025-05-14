import {useEffect} from 'react';
import {  useSelector, useDispatch } from 'react-redux';

import { Box } from '@mui/material'; 

import { fetchCredits } from 'src/redux/slice/creditSlice'

import StatsCards from 'src/components/stats-card/stats-card';

export default function CreditStatsCards() {
  const { credits } = useSelector((state) => state.credits); 

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCredits());
  }, [dispatch]);

  const { creditsConsumed, totalCredits, creditsRemaining } = credits?.data || {};

  function calculateStats(allottedCredits, consumedCredits) {
    const remainingCredits = allottedCredits - consumedCredits;
    return {
      allotted: allottedCredits,
      consumed: consumedCredits,
      remaining: remainingCredits,
    };
  }

  const allottedCredits = 10000;
  const consumedCredits = 32;
  const stats = calculateStats(allottedCredits, consumedCredits);
  return (
    <Box
      width="100%"
      sx={{
        mb: 3,
        gap: 3,
        display: 'grid',
        flexWrap: 'wrap',
        gridTemplateColumns: {
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
        },
      }}
    >
      <StatsCards
        cardtitle="Email Credits Consumed"
        cardstats={creditsConsumed}
        icon_name="Processed.svg"
        icon_color="#10CBF3"
        bg_gradient="#10CBF3"
        tooltipTittle="Number of emails credits consumed by your account."
      />
      <StatsCards
        cardtitle="Email Credits Remaining"
        cardstats={creditsRemaining}
        icon_name="Complete.svg"
        icon_color="#1D88FA"
        bg_gradient="#1D88FA"
        tooltipTittle="Number of emails credits remaining in your account."
      />
      <StatsCards
        cardtitle="Total Number of Credits Alloted"
        cardstats={totalCredits}
        icon_name="2card.png"
        icon_color="#28a645"
        bg_gradient="#28a645"
        tooltipTittle="Number of Credits alloted you."
      />
    </Box>
  );
}
