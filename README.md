# solid-dialog
Customizable and accessible modals for solid-js.

## Features
* Uses the HTML `<dialog>` tag, providing native accessibility and reducing the package size by avoiding the use of countless `<div>`s and custom backdrop implementations.

* Allows for comprehensive in-depth customization via standard CSS.

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
A modal accepts the following props:

property | required | type
-|-|-
`isShown` | **yes** | `boolean`
`closeModal` | **yes** | `() => void`
`children` | **yes** | `JSX.Element`
`dismissText` | no | `string`
`maxMobileWidth` | no | `number`
`mobileStyles` | no | `{`<br>&nbsp;&nbsp;`dialog: JSX.CSSProperties,`<br>&nbsp;&nbsp;`modal: JSX.CSSProperties,`<br>&nbsp;&nbsp;`backdrop: JSX.CSSProperties,`<br>&nbsp;&nbsp;`button: JSX.CSSProperties`<br>`}`
`desktopStyles` | no | `{`<br>&nbsp;&nbsp;`dialog: JSX.CSSProperties,`<br>&nbsp;&nbsp;`modal: JSX.CSSProperties,`<br>&nbsp;&nbsp;`backdrop: JSX.CSSProperties,`<br>&nbsp;&nbsp;`button: JSX.CSSProperties`<br>`}`
`disableDefaultMobileStyles` | no | `boolean`
`disableDefaultDesktopStyles` | no | `boolean`
`disableDismissMethods` | no | `boolean`

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
This sets the maximum viewport width (in pixels) at which the mobile version of the modal will display. The default is 500 pixels.

### `mobileStyles` and `desktopStyles`
These are objects with 4 optional properties (`dialog`, `modal`, `backdrop`, and `button`) each representing the CSS styles to be applied to the different areas of the modal. It could look like this:

```javascript
<Modal
  isShown={modalIsOpen()}
  closeModal={closeModal}
  desktopStyles={{
    dialog: desktopDialogCSS, // object defined elsewhere
    backdrop: desktopBackdropCSS, // object defined elsewhere
    button: desktopButtonCSS, // object defined elsewhere
  }}
  mobileStyles={{
    dialog: { background: 'lightskyblue' },
    button: { border: '2px dashed orange' },
  }}
>
  This is a styled modal.
</Modal>
```

### `disableDefaultMobileStyles`
Pass this property if you want to disable default mobile styles and write everything from scratch via the `.solidDialog` class. Here is what you'll be disabling:

```css
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
```

### `disableDefaultDesktopStyles`
Pass this property if you want to disable default mobile styles and write everything from scratch via the `.solidDialog` class. Here is what you'll be disabling:

```css
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
```

### `disableDismissMethods`
Pass this property if you want to remove the default dismiss button. This is dangerous because it means that your users will not be able to close the modal by clicking the button or hitting the Esc key or clicking on the backdrop. You will need to provide your own button with a function that finds the containing `<dialog>` and calls its `.close()` method. It could look like this:

```jsx
  const closeButtonlessModal: JSX.EventHandler<Node, Event> = e => {
    let currentParent: Node | null | undefined = e.currentTarget?.parentNode;
    while (currentParent?.nodeName
      && currentParent.nodeName !== 'BODY'
      && currentParent.nodeName !== 'DIALOG'
    ) {
      currentParent = currentParent?.parentElement;
    }
    if (currentParent && currentParent.nodeName === 'DIALOG') {
      const currentDialog = currentParent as HTMLDialogElement;
      setButtonlessIsOpen(false);
      currentDialog.close();
    } else {
      throw new Error('Unable to find Dialog parent of custom button.');
    }
  };
```
and then the modal can be used like this:

```jsx
  <Modal
    isShown={buttonlessIsOpen()}
    closeModal={() => undefined}
    disableDismissMethods
  >
    <p>this is a modal with the default button disabled</p>
    <button
      type="button"
      onClick={closeButtonlessModal}
    >
      external exit button
    </button>
  </Modal>
```
Notice how even though the modal isn't using the `closeModal` prop anymore, we are still providing it with a function. The reason for that is that we want to keep that prop a requred one as it is the most common scenario. Giving it a function that does nothing allows us to continue doing that.

## Style Precedence / Specificity
### id / props
The styles you pass through props will be set via a CSS id. That makes them the most specific and they will take precedense over both the default and the global styles.

### class / defaults
Unless you disable the default styles, they will take over if you decide not to use the props. They are set via CSS classes.

### class / global
If you do disable the defaults and pass nothing through props, you have the option to use global styles. You can always just style the `<dialog>` tag, but to help differentiate between other dialogs you may have on your page, there is a CSS class called `.solidDialog` that's specific to this package.

You can also use it in conjunction with props and defaults, but keep in mind that it will override only those CSS properties that are not set in either of the above. It's helpful for providing styles that should be common to all modals. It could look like this:

```css
.solidDialog {
  background-color: lightblue;
}
```

## Footguns
Shooting yourself in the foot is possible but not encouraged. Here are a few ways:

### CSS
The component accepts all CSS but it doesn't know what the styles actually do. It is entirely possible to style it in such a way that it will appear off-screen or impossible to close, or the text will be impossible to read. Just as it is your own responsibility to style the rest of your site in a way that makes it usable, it is your responsibility to style this component in a similar manner.

### a11y
While the modal is accessible in is default form, it has no way of being aware of accessibility (or lack thereof) of any components you pass into it. You can also style it in a way that could make it less accessible. Just as with the rest of the CSS it is your responsibility to ensure compliance in the code and styles that you produce.

### Modals Everywhere All at Once
You can open multiple modals if you so desire. Although you will be able to close them all in sequence and resume your normal activities, this may not be a good experience. In particular, mind the fact that the backdrops (if translucent) will combine both their colors and their filters to create some modern art that may not be aesthetically pleasing.

That said, rules were meant to be broken (so long as you understand them). Good luck!