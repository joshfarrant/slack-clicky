import React from 'react';
import SolidIcon from 'react-icons/lib/ti/heart';
import OutlineIcon from 'react-icons/lib/ti/heart-outline';
import ThemedIcon from '../ThemedIcon';

export default props => (
  <ThemedIcon
    {...props}
    lightIcon={OutlineIcon}
    darkIcon={SolidIcon}
  />
);
