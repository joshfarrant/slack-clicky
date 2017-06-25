import React from 'react';
import SolidIcon from 'react-icons/lib/ti/arrow-sync';
import OutlineIcon from 'react-icons/lib/ti/arrow-sync-outline';
import ThemedIcon from '../ThemedIcon';

export default props => (
  <ThemedIcon
    {...props}
    lightIcon={OutlineIcon}
    darkIcon={SolidIcon}
  />
);
