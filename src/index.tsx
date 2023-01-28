import type { Component, JSX } from 'solid-js';
import { createEffect, onMount, onCleanup, createUniqueId, Show } from 'solid-js';

type ModalProps = {
  isShown: boolean;
  closeModal: () => void;
  children: JSX.Element;
  dismissText?: string;
  mobileStyles?: {
    dialog: JSX.CSSProperties;
    modal: JSX.CSSProperties;
    backdrop: JSX.CSSProperties;
    button: JSX.CSSProperties;
  };
  desktopStyles?: {
    dialog: JSX.CSSProperties;
    modal: JSX.CSSProperties;
    backdrop: JSX.CSSProperties;
    button: JSX.CSSProperties;
  };
  maxMobileWidth?: number;
  disableDefaultDesktopStyles?: boolean;
  disableDefaultMobileStyles?: boolean;
  disableDismissMethods?: boolean;
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

  function onCancel(e: Event) {
    if (props.disableDismissMethods) {
      e.preventDefault();
      return;
    }

    props.closeModal();
  }

  function onEsc(e: KeyboardEvent) {
    if (e.key === 'Escape' && props.disableDismissMethods) {
      e.preventDefault();
    }
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
    modalRef?.addEventListener('cancel', onCancel);
    modalRef?.addEventListener('click', onBackdropClick);
    modalRef?.addEventListener('keydown', onEsc);
  });

  createEffect(() => {
    if (props.isShown) {
      modalRef?.showModal();
    }
  });

  onCleanup(() => {
    modalRef?.removeEventListener('cancel', onCancel);
    modalRef?.removeEventListener('click', onBackdropClick);
    modalRef?.removeEventListener('keydown', onEsc);
  });

  const dismiss = () => {
    if (props.disableDismissMethods) { return; }
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
      }}
    >
      { props.children }
      <Show when={!props.disableDismissMethods}>
        <button type='button' id={`sd${dialogId}btn`} onClick={dismiss}>{props.dismissText || 'OK'}</button>
      </Show>
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

            ${props.mobileStyles?.dialog ? `#sd${dialogId} {${processCssJSON(props.mobileStyles.dialog)}}` : ''}
            ${props.mobileStyles?.modal ? `#sd${dialogId}:modal {${processCssJSON(props.mobileStyles.modal)}}` : ''}
            ${props.mobileStyles?.backdrop ? `#sd${dialogId}::backdrop {${processCssJSON(props.mobileStyles.backdrop)}}` : ''}
            ${props.mobileStyles?.button ? `#sd${dialogId}btn {${processCssJSON(props.mobileStyles.button)}}` : ''}
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
            ${props.desktopStyles?.dialog ? `#sd${dialogId} {${processCssJSON(props.desktopStyles.dialog)}}` : ''}
            ${props.desktopStyles?.modal ? `#sd${dialogId}:modal {${processCssJSON(props.desktopStyles.modal)}}` : ''}
            ${props.desktopStyles?.backdrop ? `#sd${dialogId}::backdrop {${processCssJSON(props.desktopStyles.backdrop)}}` : ''}
            ${props.desktopStyles?.button ? `#sd${dialogId}btn {${processCssJSON(props.desktopStyles.button)}}` : ''}
          }
        `}
      </style>
    </dialog>
  );
};

export default Modal;
