'use strict'

const treeSelectPrompt = require('.')

const choices = [
	{title: 'File "A"', value: 'file-a.jpg'},
	{title: 'File "B"', value: 'file-b.pdf'},
	{title: 'Directory "Stuff"', value: 'stuff', children: [
		{title: 'File "C"',  value: 'stuff/file-c.txt'},
		{title: 'File "D"',   value: 'stuff/file-d.js'}
	]},
	{title: 'File "E"',  value: 'file-e.css'}
]

treeSelectPrompt('Please choose a file.', choices)
// .on('data', (data) => console.log('Changed to', selected(data.value)))
.on('abort', (item) => console.log('Your aborted, having chosen', item))
.on('submit', (item) => console.log('You chose', item))
