cc = require '../'
cc.init() unless cc.initialized

describe 'Self Closing Tags', ->
  describe '#img(name, attr)', ->
    it 'should render', ->
      t = -> img()
      cc.render(t).should.equal '<img />'
    it 'should render with attributes', ->
      t = -> img src: 'http://foo.jpg.to'
      cc.render(t).should.equal '<img src="http://foo.jpg.to" />'
  describe '#br()', ->
    it 'should render', ->
      t = -> br()
      cc.render(t).should.equal '<br />'
  describe '#link()', ->
    it 'should render with attributes', ->
      t = -> link href: '/foo.css', rel: 'stylesheet'
      cc.render(t).should.equal '<link href="/foo.css" rel="stylesheet" />'
