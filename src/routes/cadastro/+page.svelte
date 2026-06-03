<script lang="ts">
  import { page } from '$app/stores';
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>

<div class="layout">
  <main class="content">
    <section class="page-content">

  <div class="total-card login-card">
    <div class="login-card-header">
      <h3>Criar conta</h3>
      <p>Preencha os dados abaixo para se cadastrar</p>
    </div>

    <form method="POST" action="?/create" class="login-form">

      <label class="login-field" for="name">
        <span>Nome</span>
        <input
          id="name"
          type="text"
          name="name"
          placeholder="Digite seu nome"
        />
      </label>

      <label class="login-field" for="email">
        <span>E-mail</span>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="Digite seu e-mail"
        />
      </label>

      <label class="login-field" for="password">
        <span>Senha</span>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="Digite sua senha"
        />
      </label>

      <label class="login-field" for="confirmPassword">
        <span>Confirmar senha</span>
        <input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          placeholder="Digite novamente sua senha"
        />
      </label>

      <div class="create-account">
        <a href="/login">Já possui conta? Entrar</a>
      </div>

      <button class="login-button" type="submit">
        Criar conta
      </button>
    </form>
  </div>

</section>

  </main>
</div>

<style>
.total-card {
  box-sizing: border-box;
  background: white;
  border: 1px solid #dfe5eb;
  border-radius: 8px;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.04);
}

:global(body) {
  margin: 0;
  background: #f5f6fa;
  font-family: Inter, sans-serif;
}

.layout {
  display: flex;
  min-height: 100vh;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.page-content {
  padding: 2rem;
}

.login-card {
  width: 100%;
  max-width: 420px;
  margin: 2rem auto 0;
  padding: 2rem;
}

.login-card-header {
  margin-bottom: 1.75rem;
}

.login-card-header h3 {
  margin: 0;
  color: #172033;
  font-size: 1.55rem;
  font-weight: 800;
}

.login-card-header p {
  margin: 0.45rem 0 0;
  color: #64748b;
  font-size: 0.95rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.login-field {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.login-field span {
  color: #172033;
  font-size: 0.9rem;
  font-weight: 700;
}

.login-field input {
  width: 100%;
  height: 48px;
  box-sizing: border-box;
  border: 1px solid #d7dee7;
  border-radius: 8px;
  padding: 0 1rem;
  color: #1f2937;
  font: inherit;
  font-size: 0.95rem;
  outline: none;
  background: #ffffff;
}

.login-field input:focus {
  border-color: #00aaa8;
  box-shadow: 0 0 0 3px rgba(0, 180, 182, 0.12);
}

.login-button {
  height: 50px;
  margin-top: 0.5rem;
  border: none;
  border-radius: 8px;
  background: linear-gradient(90deg, #00aaa8, #008f8d);
  color: white;
  font: inherit;
  font-size: 0.95rem;
  font-weight: 800;
  cursor: pointer;
}

.create-account {
  display: flex;
  justify-content: flex-end;
}

.create-account a {
  font-size: 0.9rem;
  color: #008f8d;
  text-decoration: none;
  font-weight: 600;
}

.create-account a:hover {
  text-decoration: underline;
}
</style>
