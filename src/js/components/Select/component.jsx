import React from 'react';
import ReactSelect from 'react-select';
import styles from './styles.scss';

const Select = props => (
  <div className={styles.wrap}><ReactSelect {...props} /></div>
);

export default Select;
