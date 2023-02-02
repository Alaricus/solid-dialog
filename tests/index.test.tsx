import { fireEvent, render, screen } from '@solidjs/testing-library';
import { describe, expect, it, vi } from 'vitest';
import Modal from '../src/index';

describe('Modal', () => {
  describe('Basic Operation', () => {
    let modalIsOpen = true;
    const closeModalSpy = vi.fn(() => { modalIsOpen = false; });

    it('should render a modal with text and button, then dismiss it on button click', async () => {
      render(() => (
        <Modal
          isShown={modalIsOpen}
          closeModal={closeModalSpy}
        >
          Test Modal
        </Modal>
      ));

      const dialog = screen.getByText('Test Modal');
      const button = screen.getByText('OK');

      expect(dialog).toHaveAttribute('open');

      fireEvent.click(button);
      await Promise.resolve();

      expect(closeModalSpy).toHaveBeenCalledTimes(1);
      expect(dialog).not.toHaveAttribute('open');
    });
  });
});
