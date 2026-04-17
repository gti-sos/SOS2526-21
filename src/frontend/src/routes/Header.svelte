<svelte:head>
  <title>Grupo 21 API</title>
</svelte:head>

<div class="navbar">
  <span class="title">SOS2526-21</span>

  <nav>
    <a href="/">Home</a>

    <div class="dropdown">
      <a href="#">Frontends</a>
      <div class="submenu">
        <a href="/religious-believes-stats">Religious Believes</a>
        <a href="/aids-deaths-stats">AIDS Deaths</a>
        <a href="/aids-deaths-stats-opcional">AIDS Deaths Opcional</a>
        <a href="/react/aidsDeath"> AIDS Deaths react </a>
        <a href="/cholera-stats">Cholera</a>
        <a href="/cholera-stats-optional">Cholera Opcional</a>
        <a href="/react/cholera"> Cholera react </a>

      </div>
    </div>

    <div class="dropdown">
      <a href="#">Analytics</a>
      <div class="submenu">
        <a href="/analytics">Analytics</a>
        <a href="/analytics/religious-believes-stats">Analytics - Religious Believes</a>
        <a href="/analytics/aids-deaths-stats">Analytics - AIDS Deaths</a>
        <a href="/analytics/cholera-stats">Analytics - Cholera</a>
      </div>
    </div>

    <a href="/apis">APIs</a>
    <a href="/docs">Documentación</a>
    <a href="https://github.com/gti-sos/SOS2526-21" target="_blank" rel="noopener">GitHub</a>
  </nav>
</div>

<style>
  .navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
    height: 56px;
    background: #1a1a1a;
    color: #fff;
  }

  .title {
    font-family: monospace;
    font-size: 2.0rem;
    color: #ffffff;
  }

  nav {
    display: flex;
    align-items: center;
  }

  nav a {
    display: block;
    color: #d4d4d4;
    text-decoration: none;
    padding: 0.4rem 0.75rem;
    font-size: 0.875rem;
    transition: background 0.15s, color 0.15s;
  }

  nav a:hover {
    background: #2e2e2e;
    color: #fff;
  }

  .dropdown {
    position: relative;
    display: inline-block;
  }

  .submenu {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    background: #242424;
    border: 1px solid #333;
    min-width: 220px;
    z-index: 100;
  }

  .submenu a {
    font-size: 0.82rem;
    font-family: monospace;
    border-bottom: 1px solid #2e2e2e;
  }

  .submenu a:last-child {
    border-bottom: none;
  }

  .submenu a:hover {
    color: #a8e6a3;
  }

  .dropdown:hover .submenu {
    display: block;
  }
</style>