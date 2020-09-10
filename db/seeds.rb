# frozen_string_literal: true

# rubocop:disable Layout/LineLength
# rubocop:disable Style/BracesAroundHashParameters

user = seed User, { email: 'user@example.com' }, {
  password: 'asdfasdf',
  password_confirmation: 'asdfasdf'
}

seed Note, { title: 'Boring meeting TODOs' }, {
  text_content: "<ul class=\"task-list\"><li class=\"checked\">Invite everyone</li><li>Get coffee</li><li>Don't fall asleep</li><li>Listen to what people say</li></ul>",
  uid: SecureRandom.uuid,
  user: user
}

seed Note, { title: 'Free Software' }, {
  text_content: "<h1>What is free software?</h1><p><br></p><p><img src=\"b0d0e098185f7a97f17d8ae81fcc0e0f941ca4fc3fef2b0fa540731f96a26752\"></p><h3><br></h3><h2>The Free Software Definition</h2><p><br></p><blockquote>The free software definition presents the criteria for whether a particular software program qualifies as free software. From time to time we revise this definition, to clarify it or to resolve questions about subtle issues. See the <a href=\"https://www.gnu.org/philosophy/free-sw.html#History\" target=\"_blank\">History section</a> below for a list of changes that affect the definition of free software.</blockquote><p><br></p><p>“Free software” means software that respects users' freedom and community. Roughly, it means that <strong>the users have the freedom to run, copy, distribute, study, change and improve the software</strong>. Thus, “free software” is a matter of liberty, not price. To understand the concept, you should think of “free” as in “free speech,” not as in “free beer”. We sometimes call it “libre software,” borrowing the French or Spanish word for “free” as in freedom, to show we do not mean the software is gratis.</p><p>We campaign for these freedoms because everyone deserves them. With these freedoms, the users (both individually and collectively) control the program and what it does for them. When users don't control the program, we call it a “nonfree” or “proprietary” program. The nonfree program controls the users, and the developer controls the program; this makes the program <a href=\"https://www.gnu.org/philosophy/free-software-even-more-important.html\" target=\"_blank\"> an instrument of unjust power</a>.</p><p><br></p><p><br></p><p>Source url: <a href=\"https://www.gnu.org/philosophy/free-sw.html\" target=\"_blank\">https://www.gnu.org/philosophy/free-sw.html</a></p>",
  uid: SecureRandom.uuid,
  images: [seed_file('b0d0e098185f7a97f17d8ae81fcc0e0f941ca4fc3fef2b0fa540731f96a26752.png')],
  user: user
}

seed Note, { title: 'Ruby on Rails' }, {
  text_content: '<h1>Imagine what you could build if you learned Ruby on Rails…</h1><p><img src="ba571884b7575d835327a60d555f482c593869d0ba268bf1b80203fb24f34108"></p><p>Learning to build a modern web application is daunting. Ruby on Rails makes it much easier and more fun. It includes <a href="http://rubyonrails.org/everything-you-need" target="_blank">everything you need</a> to build fantastic applications, and <a href="http://guides.rubyonrails.org/getting_started.html" target="_blank">you can learn it</a> with the support of <a href="http://rubyonrails.org/community" target="_blank">our large, friendly community</a>.</p><p><br></p><p><br></p><p>Source url: <a href="http://rubyonrails.org/" target="_blank">http://rubyonrails.org</a></p>',
  uid: SecureRandom.uuid,
  images: [seed_file('ba571884b7575d835327a60d555f482c593869d0ba268bf1b80203fb24f34108.png')],
  user: user
}

seed Note, { title: 'React' }, {
  text_content: "<h1>React</h1><p><br></p><p><img src=\"6f4c116a1cb164e4d1fcbf6970a0736c4437b4d0151d83de1fa33122fef35c01\" class=\"\"></p><p><br></p><p>A JavaScript library for building user interfaces</p><h3><br></h3><pre class=\"ql-syntax\" spellcheck=\"false\"><span class=\"hljs-class\"><span class=\"hljs-keyword\">class</span> <span class=\"hljs-title\">HelloMessage</span> <span class=\"hljs-keyword\">extends</span> <span class=\"hljs-title\">React</span>.<span class=\"hljs-title\">Component</span> </span>{\n" \
    "&nbsp;render() {\n" \
    "&nbsp;&nbsp;&nbsp;<span class=\"hljs-keyword\">return</span> &lt;div&gt;<span class=\"hljs-type\">Hello</span> {<span class=\"hljs-keyword\">this</span>.props.name}&lt;/div&gt;;\n" \
    "&nbsp;}\n" \
    "}\n" \
    "\n" \
    "<span class=\"hljs-type\">ReactDOM</span>.render(&lt;<span class=\"hljs-type\">HelloMessage</span> name=<span class=\"hljs-string\">\"John\"</span> /&gt;, mountNode);\n" \
    '</pre><p><br></p><p><br></p><p>Source url: <a href="https://facebook.github.io/react/" target="_blank">https://facebook.github.io/react</a></p>',
  uid: SecureRandom.uuid,
  images: [seed_file('6f4c116a1cb164e4d1fcbf6970a0736c4437b4d0151d83de1fa33122fef35c01.png')],
  user: user
}

# rubocop:enable Style/BracesAroundHashParameters
# rubocop:enable Layout/LineLength
