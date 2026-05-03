<div class="grid">
  <a href="/integrations/ivan" class="card">
    <div class="avatar av-ivan">IA</div>
    <p>Iván Arriaza</p>
  </a>

  <a href="/integrations/maria" class="card">
    <div class="avatar av-maria">MT</div>
    <p>María Torres</p>
  </a>

  <a href="/integrations/daniel" class="card">
    <div class="avatar av-daniel">DR</div>
    <p>Daniel de la Rosa</p>
  </a>
</div>

<style>
  .grid {
    display: flex;
    gap: 1rem;
    padding: 2rem;
  }

  .card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    padding: 1.5rem 2rem;
    border: 1.5px solid #ddd;
    border-radius: 12px;
    text-decoration: none;
    color: inherit;
    transition: border-color 0.15s, background 0.15s;
  }

  .card:hover { border-color: #aaa; background: #f5f5f5; }

  .avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 14px;
  }

  .av-ivan   { background: #E6F1FB; color: #185FA5; }
  .av-maria  { background: #FBEAF0; color: #993556; }
  .av-daniel { background: #EAF3DE; color: #3B6D11; }

  p { margin: 0; font-size: 14px; }
</style>