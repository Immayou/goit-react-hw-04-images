import React from 'react';
import PropTypes from 'prop-types'; 
import { createPortal} from 'react-dom';
import { Overlay, ModalWindow } from "../Modal/Modal.styled"; 

const modalRoot = document.querySelector('#modal-root')

export const Modal = ({onModalClose, children}) => {
  
   const handleKeydown = e => {
      if (e.code === 'Escape') {
        console.log(1)
        onModalClose()
      }
    }

  window.addEventListener('keydown', handleKeydown)
//   window.removeEventListener('keydown', handleKeydown)

  const handleBackdropClick = e => {
        if (e.currentTarget === e.target) {
            onModalClose()
        }
    }
  
    return createPortal(
      <Overlay onClick={handleBackdropClick}>
          <ModalWindow>
           {children}
          </ModalWindow>
          </Overlay>, 
          modalRoot);
    }


Modal.propTypes = {
    onModalClose: PropTypes.func.isRequired
}

