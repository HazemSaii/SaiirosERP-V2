import React from 'react';

import { Box, Grid, Card, Skeleton } from '@mui/material'; // Make sure to import these

interface ButtonSkeletonProps {
  buttons: number;
}

const ButtonSkeleton: React.FC<ButtonSkeletonProps> = ({ buttons }) => (
    <Grid container>
      <Grid item xs={12} md={12}>
        <Card sx={{ p: 3,backgroundColor: 'transparent' }}>
          <Box
            rowGap={2}
            columnGap={2}
            display="flex"
            flexWrap="wrap"
            justifyContent="center"
            sx={{backgroundColor: 'transparent' }}
          >
            {Array(buttons).fill(null).map((_, index) => (
              <Skeleton key={index} variant="text" height={50} width={60} />
            ))}
          </Box>
        </Card>
      </Grid>
    </Grid>
  );

export default ButtonSkeleton;
