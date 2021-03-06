import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes, css } from 'styled-components';
import { maxWidth, SM, MD } from '../constants/widths';
import { WHITE, DARK_GRAY, LIGHT_GRAY_ALPHA } from '../constants/colors';

const Z_INDEX = 1400;
const WRAPPER_SHADE = LIGHT_GRAY_ALPHA;
const ANIMATION_DURATION = '0.3s';

// Width of the mobile as a percent for certain screen sizes
const DESKTOP_WIDTH = 50;
const TABLET_WIDTH = 75;
const MOBILE_WIDTH = 87.5;

const fadeIn = keyframes`
  0% {
    opacity: 0;
    max-height: 100vh;
  }

  100% {
    opacity: 1;
    max-height: 100vh;
  }
`;

const fadeOut = keyframes`
  0% {
    opacity: 1;
    max-height: 100vh;
  }

  100% {
    opacity: 0;
    max-height: 100vh;
  }
`;

const slideIn = width => keyframes`
  0% {
    margin-left: 100%;
  }

  100% {
    margin-left: ${100 - width}%;
  }
`;

const slideOut = width => keyframes`
  0% {
    margin-left: ${100 - width}%;
  }

  100% {
    margin-right: 100%;
  }
`;

const getSizing = (width, show) => css`
  width: ${width}%;
  margin-left: ${show ? `${100 - width}%` : '100%'};
  animation-name: ${show ? slideIn(width) : slideOut(width)};
`;

const ModalWrapper = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  left: 0;
  overflow-x: hidden;
  overflow-y: scroll;
  right: 0;
  top: 0;
  bottom: 0;
  background: ${WRAPPER_SHADE};
  z-index: ${Z_INDEX};
  animation-name: ${({ isNewlyMounted, show }) => {
    if (isNewlyMounted) return '';
    if (show) return fadeIn;
    return fadeOut;
  }};

  animation-duration: ${ANIMATION_DURATION};
  max-height: ${({ show }) => (show ? '100vh' : '0vh')};
  opacity: ${({ show }) => (show ? '1' : '0')};
`;

const ModalContent = styled.div`
  min-height: 100%;
  background: ${WHITE};
  animation-duration: ${ANIMATION_DURATION};
  box-sizing: border-box;
  padding: 10vh 0;

  ${({ show }) => getSizing(DESKTOP_WIDTH, show)}

  ${maxWidth(MD)} {
    ${({ show }) => getSizing(TABLET_WIDTH, show)}
  }

  ${maxWidth(SM)} {
    ${({ show }) => getSizing(MOBILE_WIDTH, show)}
  }
`;

const ModalClose = styled.p`
  float: right;
  margin-top: -4.16vh;
  margin-right: 4.16vw;
  transition: opacity 0.2s ease;
  font-size: 200%;
  color: ${DARK_GRAY};
  cursor: pointer;

  :hover {
    opacity: 0.5;
  }
`;

function noop(event) {
  event.stopPropagation();
}

export class Modal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isNewlyMounted: true,
    };

    this.makeNotNewlyMounted = this.makeNotNewlyMounted.bind(this);
  }

  // Avoid animations showing on load
  componentDidUpdate(prevProps) {
    const { show } = this.props;
    const { isNewlyMounted } = this.state;

    if (isNewlyMounted && prevProps.show !== show) {
      this.makeNotNewlyMounted();
    }
  }

  makeNotNewlyMounted() {
    this.setState({
      isNewlyMounted: false,
    });
  }

  render() {
    const { show, toggle, children } = this.props;
    const { isNewlyMounted } = this.state;

    return (
      <ModalWrapper show={show} onClick={toggle} isNewlyMounted={isNewlyMounted}>
        <ModalContent onClick={noop} show={show}>
          <ModalClose onClick={toggle}>
            &times;
          </ModalClose>

          { children }
        </ModalContent>
      </ModalWrapper>
    );
  }
}

Modal.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  children: PropTypes.any.isRequired, // eslint-disable-line
};

export const ModalContainer = styled.div`
  padding: 0 8vw;
  background: ${({ background }) => background || WHITE};
  padding-top: ${({ paddingTop }) => paddingTop || 0};
  padding-bottom: ${({ paddingBottom }) => paddingBottom || 0};
`;
