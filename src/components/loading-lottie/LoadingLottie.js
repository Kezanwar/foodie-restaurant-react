import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../../assets/lottie/foodie-loading.json';

const lottieOptions = {
  animationData,
  loop: true,
  autoplay: true
  //   rendererSettings: {
  //     preserveAspectRatio: 'xMidYMid slice'
  //   }
};

const styles = { scale: '0.6', marginBottom: '-100px' };

const LoadinLottie = () => {
  return <Lottie style={styles} options={lottieOptions} />;
};

export default LoadinLottie;
