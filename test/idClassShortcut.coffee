cc = require '../'
cc.init() unless cc.initialized

describe 'ID/class shortcut (ID only)', ->
  describe "div '#myid', 'foo'", ->
    it 'should render <div id="myid">foo</div>', ->
      t = -> div '#myid', 'foo'
      cc.render(t).should.equal '<div id="myid">foo</div>'

describe 'ID/class shortcut (one class only)', ->
  describe "div '.myclass', 'foo'", ->
    it 'should render <div class="myclass">foo</div>', ->
      t = -> div '.myclass', 'foo'
      cc.render(t).should.equal '<div class="myclass">foo</div>'

describe 'ID/class shortcut (multiple classes)', ->
  describe "div '.myclass.myclass2.myclass3', 'foo'", ->
    it 'should render <div class="myclass myclass2 myclass3">foo</div>', ->
      t = -> div '.myclass.myclass2.myclass3', 'foo'
      cc.render(t).should.equal '<div class="myclass myclass2 myclass3">foo</div>'

describe 'ID/class shortcut (no string contents)', ->
  describe "img '#myid.myclass', src: '/pic.png'", ->
    it 'should render <img id="myid" class="myclass" src="/pic.png" />', ->
      t = -> img '#myid.myclass', src: '/pic.png'
      cc.render(t).should.equal '<img id="myid" class="myclass" src="/pic.png" />'

describe 'ID/class shortcut (ID only) optimized', ->
  describe "div '#myid', 'foo'", ->
    it 'should render <div id="myid">foo</div>', ->
      t = -> div '#myid', 'foo'
      cc.render(t, optimized: true, cache: on).should.equal '<div id="myid">foo</div>'
