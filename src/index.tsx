import type { Component, JSX } from 'solid-js';
import { createSignal, createEffect, onMount, onCleanup } from 'solid-js';

const defaultModalStyles = {
  border: '1px solid #111111',
  'border-radius': '5px',
};

type ModalProps = {
  isShown: boolean;
  closeModal: () => void;
  children: JSX.Element;
  dismissText?: string;
  modalStyles?: JSX.CSSProperties;
  backdropStyles?: {
    'background-color'?: string,
    'backdrop-filter'?: string
  };
}

const Modal: Component<ModalProps> = props => {
  const [bdColor, setBdColor] = createSignal('rgba(0, 0, 0, 0.2)');
  const [bdFilter, setBdFilter] = createSignal('blur(5px)');
  let modalRef: HTMLDialogElement | undefined;

  function onClose() {
    props.closeModal();
  }

  function onBackdropClick(e: MouseEvent) {
    const rect = modalRef?.getBoundingClientRect();
    if (rect && (
      e.clientX < rect.left || e.clientX > rect.right
      || e.clientY < rect.top || e.clientY > rect.bottom
    )) {
      dismiss();
    }
  }

  onMount(() => {
    modalRef?.addEventListener('close', onClose);
    modalRef?.addEventListener('click', onBackdropClick);
  });

  createEffect(() => {
    if (props.isShown) {
      modalRef?.showModal();
    }

    setBdColor(props.backdropStyles?.['background-color'] ?? bdColor());
    setBdFilter(props.backdropStyles?.['backdrop-filter'] ?? bdFilter());
  });

  onCleanup(() => {
    modalRef?.removeEventListener('close', onClose);
    modalRef?.removeEventListener('click', onBackdropClick);
  });

  const dismiss = () => {
    modalRef?.close();
    props.closeModal();
  };

  return (
    <dialog ref={modalRef} class="solidDialog" style={props.modalStyles || defaultModalStyles}>
      { props.children }
      <button type='button' onClick={dismiss}>{props.dismissText || 'OK'}</button>
      <style>
        {`
          .solidDialog::backdrop {
            background-color: ${bdColor()};
            backdrop-filter: ${bdFilter()};
          }
        `}
      </style>
    </dialog>
  );
};

export default Modal;
