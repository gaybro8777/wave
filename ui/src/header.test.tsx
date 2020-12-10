import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { View } from './header'
import * as T from './qd'

const
  name = 'header',
  hashName = `#${name}`,
  label = 'label',
  headerProps: T.Card<any> = {
    name,
    state: { items: [{ name, label }] },
    changed: T.box(false)
  }

describe('Header.tsx', () => {

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<View {...headerProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

  it('Sets args - init', () => {
    render(<View {...headerProps} />)
    expect(T.qd.args[name]).toBe(false)
  })

  it('Sets args and calls sync on click', () => {
    const syncMock = jest.fn()
    T.qd.sync = syncMock

    const { getByText } = render(<View {...headerProps} />)
    fireEvent.click(getByText(label))

    expect(T.qd.args[name]).toBe(true)
    expect(syncMock).toHaveBeenCalled()
    expect(window.location.hash).toBe('')
  })

  it('Does not set args, calls sync on click, updates browser hash when name starts with hash', () => {
    const syncMock = jest.fn()
    T.qd.sync = syncMock
    headerProps.state.items[0].name = hashName

    const { getByText } = render(<View {...headerProps} />)
    fireEvent.click(getByText(label))

    expect(T.qd.args[hashName]).toBe(false)
    expect(syncMock).toHaveBeenCalledTimes(0)
    expect(window.location.hash).toBe(hashName)
  })
})