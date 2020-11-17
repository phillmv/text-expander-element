import query from '../dist/query'

describe('text-expander single word parsing', function() {
  it('does not match empty text', function() {
    const found = query('', ':')
    assert(found == null)
  })

  it('does not match without activation key', function() {
    const found = query('cat', ':', {cursor: 3})
    assert(found == null)
  })

  it('matches only activation key', function() {
    const found = query(':', ':', {cursor: 1})
    assert.deepEqual(found, {text: '', position: 1})
  })

  it('matches trailing activation key', function() {
    const found = query('hi :', ':', {cursor: 4})
    assert.deepEqual(found, {text: '', position: 4})
  })

  it('matches start of text', function() {
    const found = query(':cat', ':', {cursor: 4})
    assert.deepEqual(found, {text: 'cat', position: 1})
  })

  it('matches end of text', function() {
    const found = query('hi :cat', ':', {cursor: 7})
    assert.deepEqual(found, {text: 'cat', position: 4})
  })

  it('matches middle of text', function() {
    const found = query('hi :cat bye', ':', {cursor: 7})
    assert.deepEqual(found, {text: 'cat', position: 4})
  })

  it('matches only at word boundary', function() {
    const found = query('hi:cat', ':', {cursor: 6})
    assert(found == null)
  })

  it('matches last activation key word', function() {
    const found = query('hi :cat bye :dog', ':', {cursor: 16})
    assert.deepEqual(found, {text: 'dog', position: 13})
  })

  it('matches closest activation key word', function() {
    const found = query('hi :cat bye :dog', ':', {cursor: 7})
    assert.deepEqual(found, {text: 'cat', position: 4})
  })

  it('does not match with a space between cursor and activation key', function() {
    const found = query('hi :cat bye', ':', {cursor: 11})
    assert(found == null)
  })
})

describe('text-expander multi word parsing', function() {
  it('does not match empty text', function() {
    const found = query('', ':', {multiWord: true})
    assert(found == null)
  })

  it('does not match without activation key', function() {
    const found = query('cat', ':', {cursor: 3, multiWord: true})
    assert(found == null)
  })

  it('matches only activation key', function() {
    const found = query(':', ':', {cursor: 1, multiWord: true})
    assert.deepEqual(found, {text: '', position: 1})
  })

  it('matches trailing activation key', function() {
    const found = query('hi :', ':', {cursor: 4, multiWord: true})
    assert.deepEqual(found, {text: '', position: 4})
  })

  it('matches start of text', function() {
    const found = query(':cat', ':', {cursor: 4, multiWord: true})
    assert.deepEqual(found, {text: 'cat', position: 1})
  })

  it('matches end of text', function() {
    const found = query('hi :cat', ':', {cursor: 7, multiWord: true})
    assert.deepEqual(found, {text: 'cat', position: 4})
  })

  it('matches middle of text', function() {
    const found = query('hi :cat bye', ':', {cursor: 7, multiWord: true})
    assert.deepEqual(found, {text: 'cat', position: 4})
  })

  it('matches only at word boundary', function() {
    const found = query('hi:cat', ':', {cursor: 6, multiWord: true})
    assert(found == null)
  })

  it('matches last activation key word', function() {
    const found = query('hi :cat bye :dog', ':', {cursor: 16, multiWord: true})
    assert.deepEqual(found, {text: 'dog', position: 13})
  })

  it('matches closest activation key word', function() {
    const found = query('hi :cat bye :dog', ':', {cursor: 7, multiWord: true})
    assert.deepEqual(found, {text: 'cat', position: 4})
  })

  it('matches with a space between cursor and activation key', function() {
    const found = query('hi :cat bye', ':', {cursor: 11, multiWord: true})
    assert.deepEqual(found, {text: 'cat bye', position: 4})
  })

  it('does not match with a dot between cursor and activation key', function() {
    const found = query('hi :cat. bye', ':', {cursor: 11, multiWord: true})
    assert(found == null)
  })

  it('does not match with a space between text and activation key', function() {
    const found = query('hi : cat bye', ':', {cursor: 7, multiWord: true})
    assert(found == null)
  })
})

describe('text-expander limits the lookBack after commit', function() {
  it('does not match if lookBackIndex is bigger than activation key index', function() {
    const found = query('hi :cat bye', ':', {cursor: 11, multiWord: true, lookBackIndex: 7})
    assert(found == null)
  })

  it('matches if lookBackIndex is lower than activation key index', function() {
    const found = query('hi :cat bye :dog', ':', {cursor: 16, multiWord: true, lookBackIndex: 7})
    assert(found, {text: 'dog', position: 13})
  })
})
