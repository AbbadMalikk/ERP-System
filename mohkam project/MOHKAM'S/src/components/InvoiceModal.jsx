// InvoiceModal.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import Invoice from './Invoice';

const InvoiceModal = ({ order, onClose }) => {
  return ReactDOM.createPortal(
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <Invoice order={order} />
      </div>
    </div>,
    document.body
  );
};

export default InvoiceModal;
