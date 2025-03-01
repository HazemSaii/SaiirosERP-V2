import React from 'react';

import { Box, Grid, Card, Skeleton } from '@mui/material'; // Make sure to import these

interface FormSkeletonProps {
  fields: number;
}

const FormSkeleton: React.FC<FormSkeletonProps> = ({ fields }) => (
    <Grid container>
      <Grid item xs={12} md={12}>
        <Card sx={{ p: 3 }}>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            {Array(fields).fill(null).map((_, index) => (
              <Skeleton key={index} height={40} width="100%" />
            ))}
          </Box>
        </Card>
      </Grid>
    </Grid>
  );

export default FormSkeleton;