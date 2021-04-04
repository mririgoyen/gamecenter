import { useState } from 'react';
import cx from 'classnames';
import { CSSTransition } from 'react-transition-group';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';

import classes from './Modal.module.scss';

function Modal({
  children,
  hideActions,
  onClose,
  title
}) {
  const [ isClosing, setIsClosing ] = useState(false);

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 250);
  };

  return (
    <CSSTransition
      appear={true}
      classNames={{
        appear: classes.modal,
        appearActive: classes['modal-opening']
      }}
      in={true}
      timeout={500}
    >
      <div
        className={cx(classes.overlay, {
          [classes['modal-closing']]: isClosing
        })}
      >
        <div className={classes.container}>
          {title && <div className={classes.title}>{title}</div>}
          <div className={classes.content}>{children}</div>
          {!hideActions && (
            <div className={classes.actions}>
              <button onClick={closeModal}><Icon path={mdiClose} size={1} />CLOSE</button>
            </div>
          )}
        </div>
      </div>
    </CSSTransition>
  );
};

export default Modal;
