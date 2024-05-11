import React from 'react';
import { ClimbingBoxLoader } from 'react-spinners';

const LoadingPage = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      {/* <Puff color="#FFFFFF" height={100} width={100} /> */}
      <ClimbingBoxLoader color="#000" size={50} />

    </div>
  );
};

export default LoadingPage;
