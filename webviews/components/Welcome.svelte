<script lang="ts">
  let foo = 200;
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
    <div class="bg" />
    <h4 class="line-1 anim-typewriter">
      All the <span>code</span> you'll ever need awaits you at this
      <span>booth</span> right here in VS Code
    </h4>
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
        <div class="icon"><i class="fa fa-3x fa-laptop" /></div>
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
      <h2>DEMO:</h2>
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

    <!-- /* --------------------------- Developer ---------------------------- */ -->
    <footer id="developer">
      <div class="profile-card">
        <div class="card-header">
          <div class="pic">
            <img
              src="https://cactusthemes.com/blog/wp-content/uploads/2018/01/tt_avatar_small.jpg"
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
