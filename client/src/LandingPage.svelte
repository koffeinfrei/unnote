<div class="flex center">
  <div class="hidden-sm"></div>

  <div class="full 1000">
    <h1>unnote</h1>

    <div class="section">
      <strong>
        The note taking app that doesn't suck.
        <br /><br />
        Privacy first, fast, simple &amp; from every device - <br />wherever you are.
      </strong>
    </div>

    <div class="flex one two-500 four-1000 section">
      <div>
        <h3>Fast</h3>
        Focus on speed.<br />
        No-frills UX that doesn't get in your way.<br />
        Lightweight. ~ 210 kB gzipped.
      </div>
      <div>
        <h3>Simple</h3>
        Easy to use.<br />
        Don't get lost in 1000 options, and just focus on your notes.
      </div>
      <div>
        <h3>Secure</h3>
        High-secure encrypted storage in a datacenter in Switzerland.
        Accessible worldwide - with just a browser or as a PWA mobile app.
      </div>
      <div>
        <h3>Safe</h3>
        Protected under the <a href="https://www.kmu.admin.ch/kmu/en/home/facts-and-trends/digitization/data-protection/new-federal-act-on-data-protection-nfadp.html">New Federal Act on Data Protection (nFADP)</a>.
        No data access under the patriot act or any other funny business.<br />
        Free and open source software.
      </div>
    </div>

    <div class="flex one center section">
      <article class="card two-third-800 half-1000">
        <img src={ScreenshotDesktop} />
        <footer>
          <h4>Browser / Full width</h4>
        </footer>
      </article>
    </div>

    <div class="flex one center section">
      <article class="card half third-800 fourth-1000">
        <img src={ScreenshotMobile1} />
        <footer>
          <h4>Mobile / PWA - Note view</h4>
        </footer>
      </article>
      <article class="card half third-800 fourth-1000">
        <img src={ScreenshotMobile2} />
        <footer>
          <h4>Mobile / PWA - List view</h4>
        </footer>
      </article>
    </div>

    <h2>Features</h2>

    <ul>
      <li>A solid richtext editor which works properly without ruining the formatting</li>
      <li>Task lists (aka. todo lists)</li>
      <li>
        PWA, so it can be installed as an app on any mobile device<br>
        Supports "share to" on mobile phones. Pretty much any image or text based content can be saved in unnote
      </li>
      <li>Autosave</li>
      <li>Permanent edit mode. There's no switching between read and edit mode. Just edit, always</li>
      <li>Pseudo offline support, so you don't lose data when the connection is bad or even missing. The next time the internet is up again your edits will be synced to the server</li>
      <li>An always available and easy to use search</li>
      <li>A donkey logo</li>
      <li>Free and open source software. There is no vendor lock-in and there will never be any weird business going on with your data</li>
    </ul>

    <footer class="footer">
      <div class="footer-section">
        © 2018 - {new Date().getFullYear()} by Alexis Reigel &amp; Panter AG
      </div>

      <div class="footer-section">
        Made with ☕️ by
        <a href="https://www.koffeinfrei.org">Koffeinfrei (Alexis Reigel)</a> &amp;
        <a href="https://www.panter.ch">The Panters</a>
      </div>

      <div>
        This is free and open source software. Source code on <a href="https://github.com/koffeinfrei/unnote" target="_blank">GitHub</a>
      </div>
    </footer>
  </div>

  <div class="hidden-sm"></div>
</div>

<script>
  import ScreenshotDesktop from './images/screenshot_desktop.png'
  import ScreenshotMobile1 from './images/screenshot_mobile_1.png'
  import ScreenshotMobile2 from './images/screenshot_mobile_2.png'
</script>

<style lang="sass">
  @import './stylesheets/variables'

  .section
    margin-bottom: $picnic-separation * 4

  footer
    font-size: $font-size-md
    text-align: center

  .footer
    margin-top: $picnic-separation * 10

  .footer-section
    margin-bottom: $picnic-separation

  article
    footer
      border-top: $picnic-border
</style>
