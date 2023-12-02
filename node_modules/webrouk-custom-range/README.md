# webroukCustomRange

Webrouk Custom Range Slider is a lightweight native JavaScript web component for custom range slider element.

- No dependencies
- Small and fast
- Fully responsive
- Support touch-devices (Android, iOS, Nexus, etc.)
- Prefixes and suffixes for your numbers ($100, 100k etc.)
- Slider writes its value right into input value field. This makes it easy to use in any html form

### Demo
---
[CodePen Example](https://codepen.io/muhammad_mabrouk/full/eYGoBMb/)

### Installation
---
Use [NPM](https://www.npmjs.com/package/webrouk-custom-range/) to download and install it directly in to your project

```sh
$ npm install webrouk-custom-range --save
```

or include js file manually

```html
<!-- webrouk-custom-range component file -->
<script src="webrouk-custom-range.js"></script>
```

### Usage
---
Using webroukCustomRange is simple. Configuration over attributes.

```html
<webrouk-custom-range start="0" end="1000" from="300" to="700" prefix-char="$">
  <!-- This input will receive the value from the component -->
  <input type="hidden">
</webrouk-custom-range>
```

### Options
| Option | Type | Description | Default |
| ----------- |    :----:   | ----------- |    :----:   |
| start | `number` | Set slider minimum value | `0` |
| end | `number` | Set slider maximum value | `100` |
| from | `number` | Set start position for left handle | `start` |
| to | `number` | Set start position for right handle | `end` |
| prefix-char | `string` | Set prefix for values. Will be set up right before the number: **$** 100 | `''` |
| suffix-char | `string` | Set suffix for values. Will be set up right after the number: 100 **k** | `''` |

### Style Customization
---
Expected CSS Variables from inside the component (optional).

```css
webrouk-custom-range {
  --w-primary-color: hsl(218, 95%, 54%);
  --w-text-color: hsl(0, 100%, 100%);
  --w-line-color: hsl(0, 0%, 93%);
}
```

### Styleable Component Parts
---
- root
- value-start
- value-end
- value-from
- value-to
- value-single
- handle
- handle-lower
- handle-upper

#### Example:

```css
webrouk-custom-range::part(value-start) {
  background-color: cornflowerblue;
}

webrouk-custom-range::part(value-end) {
  background-color: indianred;
}

webrouk-custom-range::part(value-from),
webrouk-custom-range::part(value-to) {
  background-color: blueviolet;
}

webrouk-custom-range::part(value-single) {
  background-color: seagreen;
}
```

### License
-------
webroukCustomRange is licensed [MIT](https://choosealicense.com/licenses/mit/).
It can be used for free and without any attribution, in any personal or commercial project.
