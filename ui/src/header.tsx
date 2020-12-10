import * as Fluent from '@fluentui/react'
import React from 'react'
import { stylesheet } from 'typestyle'
import { cards, CardEffect } from './layout'
import { NavGroup, XNav } from './nav'
import { bond, Box, box, Card, S, B } from './qd'
import { clas, getTheme } from './theme'
import { Command, View as Toolbar } from './toolbar'

const
  theme = getTheme(),
  iconSize = 24,
  css = stylesheet({
    lhs: {
      width: iconSize + 15,
      height: iconSize + 15,
      cursor: 'default',
    },
    burger: {
      $nest: {
        '&:hover': {
          color: theme.colors.page, // TODO improve
          cursor: 'pointer',
        },
      },
    },
    icon: {
      fontSize: iconSize,
      height: iconSize,
      width: iconSize,
    },
    title: {
      ...theme.font.s24,
      ...theme.font.w3,
    },
    subtitle: {
      position: 'relative',
      top: -5, // nudge up slightly to account for padding
      ...theme.font.s12,
    },
  })


/**
 * Render a card containing a HTML page inside an inline frame (iframe).
 *
 * Either a path or content can be provided as arguments.
 */
interface State {
  /** The title. */
  title: S
  /** The subtitle, displayed below the title. */
  subtitle: S
  /** The icon type, displayed to the left. */
  icon?: S
  /** The icon's color. */
  icon_color?: S
  /** The navigation menu to display when the header's icon is clicked. */
  nav?: NavGroup[]
  /** Items that should be displayed on the right side of the header. */
  items?: Command[]
}

const
  Navigation = bond(({ items, isOpenB }: { items: NavGroup[], isOpenB: Box<B> }) => {
    const
      hideNav = () => isOpenB(false),
      render = () => (
        <Fluent.Panel
          isLightDismiss
          type={Fluent.PanelType.smallFixedNear}
          isOpen={isOpenB()}
          onDismiss={hideNav}
          hasCloseButton={false}
        >
          <XNav items={items} />
        </Fluent.Panel>
      )
    return { render, isOpenB }
  })

export const
  View = bond(({ name, state, changed }: Card<State>) => {
    const
      navB = box(false),
      showNav = () => navB(true),
      render = () => {
        const
          { title, subtitle, icon, icon_color, nav, items } = state,
          burger = nav
            ? (
              <Fluent.Stack horizontal verticalAlign='center' className={clas(css.burger, css.lhs)} onClick={showNav}>
                <Fluent.FontIcon className={css.icon} iconName='GlobalNavButton' />
              </Fluent.Stack>
            ) : (
              <Fluent.Stack horizontal verticalAlign='center' className={css.lhs}>
                <Fluent.FontIcon className={css.icon} iconName={icon ?? 'WebComponents'} style={{ color: theme.color(icon_color) }} />
              </Fluent.Stack>
            )

        return (
          <Fluent.Stack data-test={name} horizontal verticalAlign='center'>
            {burger}
            <Fluent.StackItem grow={1}>
              <div className={css.title}>{title}</div>
              <div className={css.subtitle}>{subtitle}</div>
            </Fluent.StackItem>
            {nav && <Navigation items={nav} isOpenB={navB} />}
            {items && <Toolbar name={`${name}-toolbar`} changed={changed} state={{ items }} />}
          </Fluent.Stack>
        )
      }
    return { render, changed }
  })

cards.register('header', View, CardEffect.Raised)