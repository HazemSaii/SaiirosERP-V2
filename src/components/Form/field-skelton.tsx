import React from 'react';

import { Box, Grid, Skeleton } from '@mui/material';

interface FieldSkeletonProps {
  fields?: number;
  height?: number;
  width?: string;
  columns?: { xs?: number; sm?: number; md?: number };
  gap?: number;
}

const FieldSkeleton: React.FC<FieldSkeletonProps> = ({
  fields=1,
  height = 48,
  width = '100%',
  columns = { xs: 1, sm: 1, md: 1 },
  gap = 2,
}) => (
  <Grid container>
    <Grid item xs={12}>
      <Box
        display="grid"
        rowGap={gap}
        columnGap={gap}
        gridTemplateColumns={{
          xs: `repeat(${columns.xs}, 1fr)`,
          sm: `repeat(${columns.sm}, 1fr)`,
          md: `repeat(${columns.md}, 1fr)`,
        }}
      >
        {Array.from({ length: fields }).map((_, index) => (
          <Skeleton key={index} height={height} width={width} />
        ))}
      </Box>
    </Grid>
  </Grid>
);

export default FieldSkeleton;
