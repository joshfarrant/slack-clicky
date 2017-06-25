import React from 'react';
import SolidIcon from 'react-icons/lib/ti/star';
import OutlineIcon from 'react-icons/lib/ti/star-outline';
import ThemedIcon from '../ThemedIcon';

export default props => (
  <ThemedIcon
    {...props}
    lightIcon={OutlineIcon}
    darkIcon={SolidIcon}
  />
);
