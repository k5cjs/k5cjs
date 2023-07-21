# Documentation for `<kc-dropdown>` Component

## Introduction
The `<kc-dropdown>` component is a custom dropdown element designed for web applications. It provides a simple and interactive way to present a list of options to users in a dropdown format. The dropdown can be triggered by clicking on a button, and a modal containing the available options will be displayed.

## Usage
To use the `<kc-dropdown>` component, include the provided HTML code snippet in your web application's source code. The component utilizes the following elements and attributes:

### Elements
1. `<kc-dropdown>`: The main container element that wraps the dropdown content.
2. `<button icon>`: The trigger button for the dropdown. This button displays the specified icon and can include optional text.

### Attributes
1. `icon`: This attribute is required and determines the icon that will be displayed as the trigger for the dropdown. The icon can be specified using HTML or by using a library like Font Awesome or Material Icons.

## Example
```html
<kc-dropdown>
  <button icon>
    <!-- Place your icon HTML here, for example using Font Awesome -->
    <i class="fas fa-bars"></i>
    Options
  </button>
  <div class="modal">
    <span (click)="click(1)">Item 1</span>
    <span (click)="click(2)">Item 2</span>
    <span (click)="click(3)">Item 3</span>
  </div>
</kc-dropdown>
```

<demo src="dropdown"/>
