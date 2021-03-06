import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const UsernameWrapper = styled.div`
  font-weight: ${({ theme }) => theme.global.font.weight.bold};
`;

const Username = ({ children }) => (
  <UsernameWrapper>
    {children}
  </UsernameWrapper>
);

Username.propTypes = {
  children: PropTypes.node.isRequired
};

export default Username;
