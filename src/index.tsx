import type { Component, JSX } from 'solid-js';
import { createEffect, onMount, onCleanup, createUniqueId } from 'solid-js';

type ModalProps = {
  isShown: boolean;
  closeModal: () => void;
  children: JSX.Element;
  dismissText?: string;
  modalStyles?: JSX.CSSProperties;
  backdropStyles?: JSX.CSSProperties;
  maxMobileWidth?: number;
  disableDefaultDesktopStyles?: boolean;
  disableDefaultMobileStyles?: boolean;
  classDialog?: string;
  classButton?: string;
}

const Modal: Component<ModalProps> = props => {
  let modalRef: HTMLDialogElement | undefined;

  const defaultMobileWidth = 500;
  const dialogId = createUniqueId();

  function processCssJSON(cssJSON: JSX.CSSProperties): string {
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
    <dialog
      ref={modalRef}
      id={`sd${dialogId}`}
      classList={{
        solidDialog: true,
        innerSDMobile: !props.disableDefaultMobileStyles,
        innerSDDesktop: !props.disableDefaultDesktopStyles,
        classDialog: true,
      }}
    >
      { props.children }
      <button type='button' class={` ${classButton} `} onClick={dismiss}>{props.dismissText || 'OK'}</button>
      <style>
        {`
          @media (max-width: ${props.maxMobileWidth || defaultMobileWidth}px) {
            .innerSDMobile {
              text-align: center;
              margin: 0;
              min-height: 100vh;
              min-width: 100vw;
              border: none;
              border-radius: 0;
            }
            .innerSDMobile:modal {
              display: flex;
              flex-direction: column;
              justify-content: center;
            }
            #sd${dialogId} {}
            #sd${dialogId}:modal {}
          }

          @media (min-width: ${props.maxMobileWidth ? props.maxMobileWidth + 1 : defaultMobileWidth + 1}px) {
            .innerSDDesktop {
              text-align: center;
              border: 1px solid #111111;
              border-radius: 5px;
              min-height: 0;
              min-width: 0;
            }
            .innerSDDesktop::backdrop {
              background-color: rgba(0, 0, 0, 0.2);
              backdrop-filter: blur(5px);
            }
            #sd${dialogId} {
              ${props.modalStyles ? processCssJSON(props.modalStyles) : ''}
            }
            #sd${dialogId}::backdrop {
              ${props.backdropStyles ? processCssJSON(props.backdropStyles) : ''}
            }
          }
        `}
      </style>
    </dialog>
  );
};

export default Modal;
