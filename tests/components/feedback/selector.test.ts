// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { buildSelector, findBySelector } from '@/components/feedback/selector'

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('buildSelector', () => {
  it('uses a unique id when the element has one', () => {
    document.body.innerHTML = '<section id="visit"><h2>Plan a visit</h2></section>'
    expect(buildSelector(document.getElementById('visit')!)).toBe('#visit')
  })

  it('uses a unique data attribute before falling back to a tag path', () => {
    document.body.innerHTML = '<div data-section="hero"><p>Hi</p></div><div data-section="faq"></div>'
    const el = document.querySelector('[data-section="hero"]')!
    expect(buildSelector(el)).toBe('div[data-section="hero"]')
  })

  it('anchors a tag path at the nearest ancestor with an id', () => {
    document.body.innerHTML = '<main id="main-content"><ul><li>a</li><li>b</li><li>c</li></ul></main>'
    const el = document.querySelectorAll('li')[1]
    const selector = buildSelector(el)
    expect(selector).toBe('#main-content > ul > li:nth-of-type(2)')
    expect(document.querySelector(selector)).toBe(el)
  })

  it('builds a path from body when no ancestor has an id', () => {
    document.body.innerHTML = '<div><p>one</p></div><div><p>two</p><p>three</p></div>'
    const el = document.querySelectorAll('p')[2]
    const selector = buildSelector(el)
    expect(selector).toBe('body > div:nth-of-type(2) > p:nth-of-type(2)')
    expect(document.querySelector(selector)).toBe(el)
  })

  it('ignores a duplicated id and falls back to a path', () => {
    document.body.innerHTML = '<p id="dup">a</p><p id="dup">b</p>'
    const el = document.querySelectorAll('p')[1]
    expect(document.querySelector(buildSelector(el))).toBe(el)
  })

  it('escapes ids that are not valid CSS identifiers', () => {
    document.body.innerHTML = '<div id="2026:retreat">x</div>'
    const el = document.querySelector('div')!
    expect(document.querySelector(buildSelector(el))).toBe(el)
  })
})

describe('findBySelector', () => {
  it('returns null when the selector no longer matches', () => {
    document.body.innerHTML = '<p>only</p>'
    expect(findBySelector(document, '#gone')).toBeNull()
  })

  it('returns null for an invalid selector instead of throwing', () => {
    expect(findBySelector(document, 'div[[')).toBeNull()
  })

  it('returns null when the selector matches more than one element', () => {
    document.body.innerHTML = '<p>a</p><p>b</p>'
    expect(findBySelector(document, 'p')).toBeNull()
  })
})
