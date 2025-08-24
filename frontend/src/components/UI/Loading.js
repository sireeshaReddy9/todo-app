import React from 'react';

const Loading = ({ message = "Loading..." }) => (
  <div className="loading">{message}</div>
);

export default Loading;
