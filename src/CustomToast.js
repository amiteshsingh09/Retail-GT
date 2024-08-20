// CustomToast.js
import React, { forwardRef } from 'react';
import Toast from 'react-native-toast-message';

const CustomToast = forwardRef((props, ref) => {
  return <Toast ref={ref} />;
});

export default CustomToast;
