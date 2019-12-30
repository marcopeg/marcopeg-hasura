import React from 'react';
import TypeText from './TypeText';

const types = {
  text: TypeText,
};

const JournalQuestion = ({ type, ...props }) =>
  React.createElement(types[type], props);

export default JournalQuestion;
