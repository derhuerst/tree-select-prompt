'use strict'

const ui = require('cli-styles')
const esc = require('ansi-escapes')
const chalk = require('chalk')
const wrap = require('prompt-skeleton')



const TreeSelectPrompt = {

	  choiceAtCursor: function (n, values = this.values, offset = 0) {
		let i = 0
		for (let value of values) {
			if (n === (i + offset)) return value
			i++
			if (Array.isArray(value.children)) {
				const result = this.choiceAtCursor(n, value.children, i + offset)
				if (result) return result
				i += value.children.length
			}
		}
	}

	, nrOfChoices: function (values = this.values) {
		let nr = 0
		for (let value of values) {
			nr++
			if (Array.isArray(value.children))
				nr += this.nrOfChoices(value.children)
		}
		return nr
	}

	, moveCursor: function (n) {
		this.cursor = n
		this.value = this.choiceAtCursor(n).value
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
		this.moveCursor(this.nrOfChoices() - 1)
		this.render()
	}

	, up: function () {
		if (this.cursor === 0) return this.bell()
		this.moveCursor(this.cursor - 1)
		this.render()
	}
	, down: function () {
		if (this.cursor === (this.nrOfChoices() - 1)) return this.bell()
		this.moveCursor(this.cursor + 1)
		this.render()
	}
	, next: function () {
		this.moveCursor((this.cursor + 1) % this.nrOfChoices())
		this.render()
	}

	, _: function (c) { // on space key
		if (c === ' ') return this.submit()
	}



	, renderChoice: function (choice, indent, selected) {
		return ' '.repeat(+indent)
		+ chalk.gray('- ')
		+ (selected ? chalk.cyan.underline(choice.title) : choice.title)
		+ '\n'
	}

	, renderChoices: function (choices, selected, indent = 0, offset = 0) {
		let out = ''
		for (let choice of choices) {
			out += this.renderChoice(choice, indent, offset === selected)
			offset++
			if (Array.isArray(choice.children)) {
				out += this.renderChoices(choice.children, selected, indent + 4, offset)
				offset += choice.children.length
			}
		}
		return out
	}

	, render: function (first) {
		this.nrOfChoices()
		if (first) this.out.write(esc.cursorHide)
		else this.out.write(esc.eraseLines(this.nrOfChoices() + 2))

		this.out.write([
			  ui.symbol(this.done, this.aborted)
			, chalk.bold(this.msg), ui.delimiter(false)
			, (this.done ? this.choiceAtCursor(this.cursor).title : '')
		].join(' '))

		if (!this.done) this.out.write(
			'\n'
			+ this.renderChoices(this.values, this.cursor)
		)
	}
}



const defaults = {
	  values:  []
	, value:   null
	, cursor:  0

	, done:    false
	, aborted: false
}

const treeSelectPrompt = (msg, values, opt) => {
	if ('string' !== typeof msg) throw new Error('Message must be string.')
	if (!Array.isArray(values)) throw new Error('Values must be in an array.')
	if (Array.isArray(opt) || 'object' !== typeof opt) opt = {}

	let p = Object.assign(Object.create(TreeSelectPrompt), defaults, opt)
	p.msg = msg
	p.values = values
	p.value = p.values[p.cursor].value

	return wrap(p)
}



module.exports = Object.assign(treeSelectPrompt, {TreeSelectPrompt})
