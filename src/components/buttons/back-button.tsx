import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Button from '@mui/material/Button';

type Props = {
  label: string;
  variant?: 'text' | 'outlined' | 'contained';
  size?: 'small' | 'medium' | 'large';
  sx?: object;
};

const BackButton = ({ label, variant = 'outlined', size, sx = { mt: 5, mr: 2 } }: Props) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <Button
      variant={variant} // Default to "contained" like Next button
      size={size} // Default to "large" for consistency
      sx={sx}
      onClick={goBack}
    >
      {label || t('Back')}
    </Button>
  );
};

export default BackButton;
