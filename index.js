'use strict'

const ui = require('cli-styles')
const esc = require('ansi-escapes')
const chalk = require('chalk')
const wrap = require('prompt-skeleton')



const TreeSelectPrompt = {

	  choiceAtCursor: function (n, values = this.values, offset = 0) {
		let i = 0
		for (let value of values) {
			if (Array.isArray(value)) {
				const result = this.choiceAtCursor(n, value, i + offset)
				i += value.length
				if (result) return result
			}
			else if (n === (i + offset)) return value
			else i++
		}
	}

	, nrOfChoices: function (values = this.values) {
		let nr = 0
		for (let i = 0; i < values.length; i++) {
			nr += Array.isArray(values[i])
				? this.nrOfChoices(values[i])
				: 1
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

	, renderChoices: function (choices, indent, selected, i) {
		let out = ''
		for (let choice of choices) {
			if (Array.isArray(choice)) {
				out += this.renderChoices(choice, indent + 4, selected, i)
				i += choice.length
			} else {
				out += this.renderChoice(choice, indent, i === selected)
				i++
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
			+ this.renderChoices(this.values, 0, this.cursor, 0)
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
