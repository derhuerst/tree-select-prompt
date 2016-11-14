# tree-select-prompt

**A prompt to select an item from a tree.**

[![asciicast](https://asciinema.org/a/92713.png)](https://asciinema.org/a/92713)

[![npm version](https://img.shields.io/npm/v/tree-select-prompt.svg)](https://www.npmjs.com/package/tree-select-prompt)
[![dependency status](https://img.shields.io/david/derhuerst/tree-select-prompt.svg)](https://david-dm.org/derhuerst/tree-select-prompt#info=dependencies)
[![dev dependency status](https://img.shields.io/david/dev/derhuerst/tree-select-prompt.svg)](https://david-dm.org/derhuerst/tree-select-prompt#info=devDependencies)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/tree-select-prompt.svg)

*tree-select-prompt* uses [*cli-styles*](https://github.com/derhuerst/cli-styles) to have a look & feel consistent with other prompts.


## Installing

```
npm install tree-select-prompt
```


## Usage

```js
const treeSelectPrompt = require('tree-select-prompt')

const choices = [
	{title: 'File "A"', value: 'file-a.jpg'},
	{title: 'File "B"', value: 'file-b.pdf'},
	{title: 'Directory "Stuff"', value: 'stuff', children: [
		{title: 'File "C"',  value: 'stuff/file-c.txt'},
		{title: 'File "D"',   value: 'stuff/file-d.js'}
	]},
	{title: 'File "E"',  value: 'file-e.css'}
]

// All these are optional.
const opts = {
	  hint:    '– Space to expand. Return to select.'
	, cursor:  0
}

treeSelectPrompt('Please choose a file.', choices, opts)
.on('data', (item) => console.log('Changed to', item))
.on('abort', (item) => console.log('Aborted with', item))
.on('submit', (item) => console.log('Submitted with', item))
```


## Related

- [`mail-prompt`](https://github.com/derhuerst/mail-prompt)
- [`date-prompt`](https://github.com/derhuerst/date-prompt)
- [`number-prompt`](https://github.com/derhuerst/number-prompt)
- [`select-prompt`](https://github.com/derhuerst/select-prompt)
- [`multiselect-prompt`](https://github.com/derhuerst/multiselect-prompt)
- [`tree-select-prompt`](https://github.com/derhuerst/tree-select-prompt)
- [`text-prompt`](https://github.com/derhuerst/text-prompt)
- [`cli-autocomplete`](https://github.com/derhuerst/cli-autocomplete)


## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/tree-select-prompt/issues).
