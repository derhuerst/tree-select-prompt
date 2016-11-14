'use strict'

const ui = require('cli-styles')
const esc = require('ansi-escapes')
const chalk = require('chalk')
const wrap = require('prompt-skeleton')



const flattenChoices = (choices) =>
	choices.reduce((flat, choice) => {
		if (choice.expanded && Array.isArray(choice.children))
			return flat.concat(choice, flattenChoices(choice.children))
		return flat.concat(choice)
	}, [])

const choiceAtCursor = (choices, cursor) => flattenChoices(choices)[cursor]
const nrOfChoices = (choices) => flattenChoices(choices).length



const TreeSelectPrompt = {

	  moveCursor: function (n) {
		this.cursor = n
		this.choice = choiceAtCursor(this.values, n)
		this.value = this.choice.value
		this.emit()
	}


	, reset: function () {
		this.moveCursor(0)
		this.render()
	}

	, abort: function () {
		this.done = this.aborted = true
		this.emit()
		this.render()
		this.out.write('\n')
		this.close()
	}

	, submit: function () {
		this.done = true
		this.aborted = false
		this.emit()
		this.render()
		this.out.write('\n')
		this.close()
	}



	, first: function () {
		this.moveCursor(0)
		this.render()
	}
	, last: function () {
		this.moveCursor(nrOfChoices(this.values) - 1)
		this.render()
	}

	, up: function () {
		if (this.cursor === 0) return this.bell()
		this.moveCursor(this.cursor - 1)
		this.render()
	}
	, down: function () {
		if (this.cursor === (nrOfChoices(this.values) - 1)) return this.bell()
		this.moveCursor(this.cursor + 1)
		this.render()
	}
	, next: function () {
		this.moveCursor((this.cursor + 1) % nrOfChoices(this.values))
		this.render()
	}

	, _: function (c) { // on space key
		if (c === ' ') {
			this.choice.expanded = !this.choice.expanded
			this.render()
		}
	}



	, renderChoice: function (choice, indent, selected) {
		return ' '.repeat(+indent)
		+ chalk.gray(ui.item(Array.isArray(choice.children), choice.expanded)) + ' '
		+ (selected ? chalk.cyan.underline(choice.title) : choice.title)
		+ '\n'
	}

	, renderChoices: function (choices, selected, indent = 0, offset = 0) {
		let out = ''
		for (let choice of choices) {
			out += this.renderChoice(choice, indent, offset === selected)
			offset++
			if (Array.isArray(choice.children)) {
				if (choice.expanded)
					out += this.renderChoices(choice.children, selected, indent + 4, offset)
				offset += choice.children.length
			}
		}
		return out
	}

	, render: function (first) {
		if (first) this.out.write(esc.cursorHide)
		else this.out.write(esc.eraseLines(this.previousNrOfChoices + 2))
		this.previousNrOfChoices = nrOfChoices(this.values)

		this.out.write([
			  ui.symbol(this.done, this.aborted)
			, chalk.bold(this.msg), ui.delimiter(false)
			, (this.done ? choiceAtCursor(this.values, this.cursor).title : chalk.gray(this.hint))
		].join(' '))

		if (!this.done) this.out.write(
			'\n'
			+ this.renderChoices(this.values, this.cursor)
		)
	}
}



const defaults = {
	  hint:    '– Space to expand. Return to select.'

	, values:  []
	, value:   null
	, cursor:  0
	, previousNrOfChoices: 0

	, done:    false
	, aborted: false
}

const treeSelectPrompt = (msg, values, opt) => {
	if ('string' !== typeof msg) throw new Error('Message must be string.')
	if (!Array.isArray(values)) throw new Error('Values must be in an array.')
	if (Array.isArray(opt) || 'object' !== typeof opt) opt = {}

	let p = Object.assign(Object.create(TreeSelectPrompt), defaults, opt)
	p.msg = msg
	p.values = values.map((v) => {
		v = Object.create(v)
		v.expanded = !!v.expanded
		return v
	})
	p.value = p.values[p.cursor].value

	return wrap(p)
}



module.exports = Object.assign(treeSelectPrompt, {TreeSelectPrompt})
