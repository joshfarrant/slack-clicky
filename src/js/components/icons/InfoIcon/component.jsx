import React from 'react';
import SolidIcon from 'react-icons/lib/md/info';
import OutlineIcon from 'react-icons/lib/md/info-outline';
import ThemedIcon from '../ThemedIcon';

export default props => (
  <ThemedIcon
    {...props}
    lightIcon={OutlineIcon}
    darkIcon={SolidIcon}
  />
);
