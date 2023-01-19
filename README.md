# solid-dialog

Customizable and accessible modals for solid-js.

## Features

* Uses the HTML `<dialog>` tag, providing native accessibility and reducing the package size by avoiding the use of countless `<div>`s and custom backdrop implementations.

* Is fully customizable via regular CSS.

## Setup

### Install

```bash
npm i solid-dialog
```

 or

```bash
yarn add solid-dialog
```

### Import

```typescript
import Modal from 'solid-dialog';
```

## Basic Usage

```typescript
const App: Component = () => {
  const [modalIsOpen, setModalIsOpen] = createSignal(false);
  const closeModal = () => setModalIsOpen(false);

  return (
    </>
      <h1>This is a Solid App</h1>
      <button
        type='button'
        onClick={() => setModalIsOpen(true)}
      >
        show modal
      </button>
      <Modal
        isShown={modalIsOpen()}
        closeModal={closeModal}
      >
        The modal is being displayed!
      </Modal>
    </>
  );
};
```

## Advanced Usage

The modal has the following properties:

| property         | required | type    |
|------------------|----------|---------|
| `isShown`        | **yes**  | `boolean` |
| `closeModal`     | **yes**  | `() => void` |
| `children`       | **yes**  | `JSX.Element`
| `dismissText`    | no       | `string`
| `modalStyles`    | no       | `JSX.CSSProperties`
| `backdropStyles` | no       | object with two optional `string` properties: `background-color` and `backdrop-filter`

Here is what they do and how to use them:

### `isShown`

This is what is responsible for the modal being displayed or hidden. The most common case would be to pass a signal as shown in the Basic Usage section above.

### `closeModal`

This is a function that will be invoked when the user clicks on the dismiss button, or presses the Esc key on their keyboard, or clicks on the backdrop. This function would usually set the signal passed to the `isShown` property to `false`.

### `children`
This is the contents of the modal. Normally it would be any JSX that's placed between `<Modal>` and `</Modal>`.

### `dismissText`
This is the text that will be displayed on the dismiss button. The default is "OK".

### `modalStyles`
This is an object with representing the CSS styles that you want applied to the modal. It could look like this:

```javascript
{
  color: 'orangered',
  width: '30rem',
  border: '8px solid orange',
  'background-color': 'lightorange',
  'border-radius': '50%',
  translate: '0 -200%',
}
```

Alternatively, if you want to style all of the modals at once, you can create a global style within your CSS files. The modal has a class of `solidDialog` so just style that. It could look like this:

```css
.solidDialog {
  background-color: lightorange;
}
```

### `backdropStyles`
This is an object, just like above, but it's restricted to two properties only: `background-color` and `backdrop-filter`. The former takes any valid CSS way of setting a colore, while the latter take any valid CSS filters. For example:

```javascript
{
  'background-color': 'rgba(0, 150, 0, 0.2)',
  'backdrop-filter': 'invert(90%) blur(3px)',
}
```

Just as with `modalStyles` this can be set in a CSS file instead. For example:

```css
.solidDialog::backdrop {
  background-color: rgba(0, 150, 0, 0.2);
  backdrop-filter: invert(90%) blur(3px);
}
```
