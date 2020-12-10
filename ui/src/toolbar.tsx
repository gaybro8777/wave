import * as Fluent from '@fluentui/react'
import React from 'react'
import { stylesheet } from 'typestyle'
import { CardEffect, cards } from './layout'
import { bond, Card, qd, S } from './qd'

/**
 * Create a command.
 *
 * Commands are typically displayed as context menu items or toolbar button.
 */
export interface Command {
  /** An identifying name for this component. If the name is prefixed with a '#', the command sets the location hash to the name when executed. */
  name: S
  /** The text displayed for this command. */
  label?: S
  /** The caption for this command (typically a tooltip). */
  caption?: S
  /** The icon to be displayed for this command. */
  icon?: S
  /** Sub-commands, if any */
  items?: Command[]
  /** Data associated with this command, if any. */
  value?: S
  /** DEPRECATED. Use `value` instead. Data associated with this command, if any. */
  data?: S
}


/** Create a card containing a toolbar. */
interface State {
  /** Items to render. */
  items: Command[]
  /** Items to render on the right side (or left, in RTL). */
  secondary_items?: Command[]
  /** Items to render in an overflow menu. */
  overflow_items?: Command[]
}

const
  css = stylesheet({
    commandBar: {
      $nest: {
        '.ms-Button--commandBar, .ms-Button-icon, .ms-Button-menuIcon, .ms-CommandBar, &:hover': {
          background: 'inherit',
          color: 'inherit'
        }
      }
    }
  }),
  toCommands = (commands: Command[]) => commands.map(({ name, label, caption, icon, items }: Command): Fluent.ICommandBarItemProps => {
    qd.args[name] = false
    const onClick = () => {
      if (name.startsWith('#')) {
        window.location.hash = name.substr(1)
        return
      }
      qd.args[name] = true
      qd.sync()
    }
    return {
      key: name,
      text: label,
      ariaLabel: caption || label,
      title: caption,
      iconOnly: !label,
      iconProps: icon ? { iconName: icon } : undefined,
      subMenuProps: items ? { items: toCommands(items) } : undefined,
      onClick,
    }
  })

export const
  View = bond(({ name, state, changed }: Card<State>) => {
    const
      render = () => {
        const
          { items, overflow_items, secondary_items } = state,
          commands = toCommands(items),
          overflowCommands = overflow_items ? toCommands(overflow_items) : undefined,
          farCommands = secondary_items ? toCommands(secondary_items) : undefined
        return (
          <Fluent.CommandBar
            data-test={name}
            items={commands}
            overflowItems={overflowCommands}
            overflowButtonProps={{ ariaLabel: 'More' }}
            farItems={farCommands}
            ariaLabel='Use left and right arrow keys to navigate between commands.'
            className={css.commandBar}
          />
        )
      }
    return { render, changed }
  })

cards.register('toolbar', View, CardEffect.Flat)