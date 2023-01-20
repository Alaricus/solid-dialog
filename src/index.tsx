import type { Component, JSX } from 'solid-js';
import { createSignal, createEffect, onMount, onCleanup } from 'solid-js';

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
  maxMobileWidth?: number;
}

const Modal: Component<ModalProps> = props => {
  const [bdColor, setBdColor] = createSignal('rgba(0, 0, 0, 0.2)');
  const [bdFilter, setBdFilter] = createSignal('blur(5px)');
  let modalRef: HTMLDialogElement | undefined;

  const defaultMobileWidth = 500;

  function processModalCSS(cssJSON: JSX.CSSProperties): string {
    let css = '';
    Object.entries(cssJSON).forEach((entry: [string, string]) => {
      css += `${entry[0]}: ${entry[1]};`;
    });
    return css;
  }

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
    <dialog ref={modalRef} class="solidDialog">
      { props.children }
      <button type='button' onClick={dismiss}>{props.dismissText || 'OK'}</button>
      <style>
        {`
          @media (max-width: ${props.maxMobileWidth || defaultMobileWidth}px) {
            .solidDialog {
              text-align: center;
              margin: 0;
              min-height: 100vh;
              min-width: 100vw;
              border: none;
              border-radius: 0;
            }
            .solidDialog:modal {
              display: flex;
              flex-direction: column;
              justify-content: center;
            }
          }

          @media (min-width: ${props.maxMobileWidth ? props.maxMobileWidth + 1 : defaultMobileWidth + 1}px) {
            .solidDialog {
              text-align: center;
              border: 1px solid #111111;
              border-radius: 5px;
              min-height: 0;
              min-width: 0;
              ${props.modalStyles && processModalCSS(props.modalStyles)}
            }
            .solidDialog::backdrop {
              background-color: ${bdColor()};
              backdrop-filter: ${bdFilter()};
            }
          }
        `}
      </style>
    </dialog>
  );
};

export default Modal;
