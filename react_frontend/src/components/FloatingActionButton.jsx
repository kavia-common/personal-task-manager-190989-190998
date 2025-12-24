import React from 'react';

/**
 * PUBLIC_INTERFACE
 * FloatingActionButton: Circular button fixed at bottom-right.
 */
function FloatingActionButton({ onClick, label = 'Add task' }) {
  return (
    <button className="fab" onClick={onClick} aria-label={label} title={label}>
      +
    </button>
  );
}

export default FloatingActionButton;
