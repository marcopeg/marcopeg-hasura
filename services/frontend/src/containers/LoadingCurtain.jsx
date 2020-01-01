import React from 'react';
import { useAuth } from '../lib/auth';
import LoadingCurtainUI from '../components/LoadingCurtainUI';

const LoadingCurtain = () => {
  const { isReady, isLoading } = useAuth();
  return <LoadingCurtainUI isVisible={!isReady || isLoading} />;
};

export default LoadingCurtain
