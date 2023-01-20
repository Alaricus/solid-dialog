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
    <>
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
| `maxMobileWidth` | no       | `number`
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

### `maxMobileWidth`
This sets the maximum viewport width (in pixels) at which the mobile version of the modal will display. The default is `500` pixels.

### `modalStyles`
This is an object with representing the CSS styles to be applied to the modal. These styles will only affect the desktop version. It could look like this:

```javascript
{
  color: 'orangered',
  width: '30rem',
  border: '8px solid orange',
  'background-color': 'lightblue',
  'border-radius': '50%',
  translate: '0 -200%',
}
```

Alternatively, if you want to style all of the modals at once, you can create a global style within your CSS files. The modal has a class of `solidDialog` so just style that. It could look like this:

```css
.solidDialog {
  background-color: lightblue;
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

## Footguns

Shooting yourself in the foot is possible but not encouraged. Here are some possible ways:

### CSS

The component accepts all CSS but it doesn't know what the styles actually do. It is entirely possible to style it in such a way that it will appear off-screen or impossible to close, or the text will be impossible to read. Just as it is your own responsibility to style the rest of your site in a way that makes it usable, it is your responsibility to style this component in a similar manner.

### Modals Everywhere All at Once

You can open multiple modals if you so desire. Although you will be able to close them all in sequence and resume your normal activities, this may not be a good experience. In particular, mind the fact that the backdrops (if translucent) will combine both their colors and their filters to create some modern art that may not be aesthetically pleasing.

That said, rules were meant to be broken (so long as you understand them). Good luck!