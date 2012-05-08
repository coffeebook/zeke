cc = require '../'

describe 'Escaping', ->
  describe "h1 h(\"<script>alert('\"owned\" by c&a &copy;')</script>)", ->
    it "should render <h1>&lt;script&gt;alert('&quot;owned&quot; by c&amp;a &amp;copy;')&lt;/script&gt;</h1>", ->
      t = -> h1 h("<script>alert('\"owned\" by c&a &copy;')</script>")
      cc.render(t).should.equal "<h1>&lt;script&gt;alert('&quot;owned&quot; by c&amp;a &amp;copy;')&lt;/script&gt;</h1>"

describe 'AutoEscaping', ->
  describe "h1 <script>alert('\"owned\" by c&a &copy;')</script>", ->
    it "should render <h1>&lt;script&gt;alert('&quot;owned&quot; by c&amp;a &amp;copy;')&lt;/script&gt;</h1>", ->
      t = -> h1 "<script>alert('\"owned\" by c&a &copy;')</script>"
      cc.render(t, autoescape: yes).should.equal "<h1>&lt;script&gt;alert('&quot;owned&quot; by c&amp;a &amp;copy;')&lt;/script&gt;</h1>"
