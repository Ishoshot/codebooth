<script lang="ts">
  // let foo = 200;
</script>

<div id="page-wrapper">
  <!-- /* --------------------------- Header --------------------------------- */ -->
  <header id="header">
    <nav id="nav-bar">
      <ul>
        <li><a class="nav-link" href="#features">Features</a></li>
        <li><a class="nav-link" href="#demo">Demo</a></li>
        <li><a class="nav-link" href="#developer">Developer</a></li>
      </ul>
    </nav>
  </header>

  <!-- /* --------------------------- Hero --------------------------------- */ -->
  <section id="hero">
    <div class="codebooth-bg" />

    <div class="introduction">
      <h2>Hi, I'm CodeBooth and I reside in Visual Studio Code</h2>
      <p>
        I am aware you write a lot of code, and you just can't do without that
        completely-personalized and templated code of yours. <br />
        Say-no-more, I can help you with your personal code repository. Sounds cool
        innit? Sure it does! 😃
      </p>
      <button type="button" class="learnMore secondary">Learn More</button>
    </div>
  </section>

  <!-- /* --------------------------- Content --------------------------------- */ -->
  <div class="container">
    <!-- /* --------------------------- Features --------------------------------- */ -->
    <section id="features">
      <div class="grid">
        <div class="icon"><i class="fa fa-3x fa-industry" /></div>
        <div class="desc">
          <h2>Increased Productivity</h2>
          <p>
            A Booth for anyone that codes. We add efficiency to your work by
            helping you get answers to your toughest coding issues, share
            knowledge with your friends and developers worldwide and networking
            all at the same time.
          </p>
        </div>
      </div>
      <div class="grid">
        <div class="icon" style="margin-right:3rem;">
          <i class="fa fa-3x fa-laptop" />
        </div>
        <div class="desc">
          <h2>Centralized Workspace</h2>
          <p>
            A Booth for anyone that codes. We provide a one-place-to-go booth to
            get solutions to coding issues, and find amazing code snippets
            without having to leave your DEV environ.
          </p>
        </div>
      </div>
      <div class="grid">
        <div class="icon">
          <i class="fa fa-3x fa-object-group" aria-hidden="true" />
        </div>
        <div class="desc">
          <h2>Reach Developers Worldwide</h2>
          <p>
            Level up with codebooth! Share and get solutions to more than 5
            million developers, connect with people and find the perfect
            candidate if you're looking to build a team.
          </p>
        </div>
      </div>

      <div class="grid">
        <div class="icon">
          <i class="fa fa-3x fa-rocket" aria-hidden="true" />
        </div>
        <div class="desc">
          <h2>Showcase your Products</h2>
          <p>
            Accelerate the discovery of your products or services through our
            Advertising platform. We catalyze your product to its potential
            users and increase awareness of your product or service across the
            developers' network.
          </p>
        </div>
      </div>
    </section>

    <!-- /* --------------------------- Demo --------------------------------- */ -->
    <section id="demo">
      <!-- svelte-ignore a11y-missing-attribute -->
      <iframe
        width="100%"
        height="400"
        src="https://www.youtube.com/embed/2uwmLgseBA0"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      />
    </section>

    <!-- /* --------------------------------- Pricing -------------------------------- */ -->
    <section id="pricing">
      <div class="product" id="tenor">
        <div class="level">Code Hydrogen</div>
        <h2>$600</h2>
        <ol>
          <li>Lorem ipsum.</li>
          <li>Lorem ipsum.</li>
          <li>Lorem ipsum dolor.</li>
          <li>Lorem ipsum.</li>
        </ol>
      </div>
      <div class="product" id="bass">
        <div class="level">Code Helium</div>
        <h2>$900</h2>
        <ol>
          <li>Lorem ipsum.</li>
          <li>Lorem ipsum.</li>
          <li>Lorem ipsum dolor.</li>
          <li>Lorem ipsum.</li>
        </ol>
      </div>
      <div class="product" id="valve">
        <div class="level">Code Lithium</div>
        <h2>$1200</h2>
        <ol>
          <li>Plays similar to a Trumpet</li>
          <li>Great for Jazz Bands</li>
          <li>Lorem ipsum dolor.</li>
          <li>Lorem ipsum.</li>
        </ol>
      </div>
    </section>

    <!-- /* --------------------------- Developer ---------------------------- */ -->
    <footer id="developer">
      <div class="profile-card">
        <div class="card-header">
          <div class="pic">
            <img
              src="https://res.cloudinary.com/oluwatobi/image/upload/c_fit,w_500/v1625336372/codebooth/Oluwatobi_xejkx4.jpg"
              alt="avatar"
            />
          </div>
          <p class="name">Oluwatobi Ishola</p>
          <span class="descr">Software Enginner</span>
          <div class="social">
            <a href="/">
              <i class="fab fa-facebook-f" />
            </a>

            <a href="/">
              <i class="fab fa-twitter" />
            </a>

            <a href="/">
              <i class="fab fa-instagram" />
            </a>

            <a href="/">
              <i class="fab fa-telegram" />
            </a>

            <a href="/">
              <i class="fab fa-github" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</div>

<style scoped>
  /** global element styling **/
</style>
