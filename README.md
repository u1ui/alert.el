# &lt;u1-alert&gt; - element
Prominent hints, alerts, and facts

## Features

- Various variants for Success, Warn, Error, and Info alerts.
- Dismissable alerts allow user to close them.
- Support for icons within alerts.
- Customizable actions through buttons in the alert.

## Usage

```html
<u1-alert open variant="info" dismissible icon="home">
    This is a dismissible success alert with an icon, and a lot of text to make it wrap. More text to make it wrap and just more and more
    <button slot=action>OK</button>
    <button slot=action>Cancel</button>
</u1-alert>
```

```css
u1-alert {
    border-width: 0 0 0 3px;
}
u1-alert::part(close) {
    opacity:0.3;
}
u1-alert::part(icon) {
    font-size:2em;
}
```

## API

### Attributes

- `variant`: Determines the type of the alert (success, warn, error, info).
- `dismissible`: Allows the alert to be closed by the user.
- `icon`: Adds an icon to the alert, if not set, the icon will be determined by the variant.
- `open`: Determines if the alert is visible or not.

### Slots

- `action`: Buttons that will be placed at the bottom of the alert.

### CSS

--color: The color of the alert, if not set, it will be determined by the variant.
::part(close): The close button.
::part(icon): The icon.

## Install

```html
<link href="https://cdn.jsdelivr.net/gh/u1ui/alert.el@x.x.x/alert.min.css" rel=stylesheet>
<script src="https://cdn.jsdelivr.net/gh/u1ui/alert.el@x.x.x/alert.min.js" type=module></script>
```

## Demos

[minimal.html](http://gcdn.li/u1ui/alert.el@main/tests/minimal.html)  
[test.html](http://gcdn.li/u1ui/alert.el@main/tests/test.html)  

## About

- MIT License, Copyright (c) 2022 <u1> (like all repositories in this organization) <br>
- Suggestions, ideas, finding bugs and making pull requests make us very happy. ♥

