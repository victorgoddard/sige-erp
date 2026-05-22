<script lang="ts">
  import './layout.css';
  import {
    Package,
    Users,
    FileText,
    PieChart,
    Wallet
  } from '@lucide/svelte';

  let { children } = $props();

  const menuItems = [
    {
      label: 'Produto',
      icon: Package,
      href: '/product'
    },
    {
      label: 'Fornecedores',
      icon: Users,
      href: '/fornecedores'
    },
    {
      label: 'Ordens de Compra',
      icon: FileText,
      href: '/purchase-orders'
    },
    {
      label: 'Fluxo de Caixa',
      icon: Wallet,
      href: '/cash-flow'
    },
    {
      label: 'Relatórios',
      icon: PieChart,
      href: '/charts'
    }
  ];
</script>

<div class="layout">
  <aside class="sidebar">
    <div class="company-section">
      <div class="company-avatar">
        A
      </div>

      <span>Andar 1001</span>
    </div>

    <nav class="menu">
      {#each menuItems as item}
        {@const Icon = item.icon}
        <a
          class="menu-item"
          href={item.href}>
          <Icon size={22} />

          <span>{item.label}</span>
        </a>
      {/each}
    </nav>
  </aside>

  <main class="content">
    <header class="topbar">
      <div class="topbar-overlay"></div>

      <div class="topbar-content">
        <h1></h1>

        <div class="user-area">
          <div class="avatar">
            J
          </div>

          <span>João Cardoso</span>
        </div>
      </div>
    </header>

    <section>
      {@render children?.()}
    </section>
  </main>
</div>