import React from 'react';
import SolidIcon from 'react-icons/lib/ti/times';
import OutlineIcon from 'react-icons/lib/ti/times-outline';
import ThemedIcon from '../ThemedIcon';

export default props => (
  <ThemedIcon
    {...props}
    lightIcon={OutlineIcon}
    darkIcon={SolidIcon}
  />
);
