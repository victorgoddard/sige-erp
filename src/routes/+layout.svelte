<script lang="ts">
  import './layout.css';
  import {
    Building2,
    ClipboardList,
    Package,
    PieChart,
    Users,
    Wallet
  } from '@lucide/svelte';
  import { page } from '$app/stores';

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
      icon: ClipboardList,
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

  const pageTitles: Record<string, string> = {
    '/': 'SIGE ERP',
    '/product': 'Produto',
    '/fornecedores': 'Fornecedores',
    '/purchase-orders': 'Ordens de Compra',
    '/cash-flow': 'Fluxo de Caixa',
    '/charts': 'Relatórios'
  };

  function currentTitle(pathname: string) {
    return pageTitles[pathname] ?? 'SIGE ERP';
  }

  const shellRoutes = new Set(['/cash-flow']);
</script>

{#if shellRoutes.has($page.url.pathname)}
<div class="layout">
  <header class="topbar">
    <h1>{currentTitle($page.url.pathname)}</h1>

    <div class="topbar-cut"></div>

    <div class="user-area">
      <div class="avatar">
        J
      </div>

      <span>João Cardoso</span>
    </div>
  </header>

  <div class="workspace">
    <aside class="sidebar">
      <div class="company-section">
        <div class="company-avatar">
          <Building2 size={18} />
        </div>

        <span>Andar 1001</span>
      </div>

      <nav class="menu" aria-label="Menu principal">
        {#each menuItems as item}
          {@const Icon = item.icon}
          <a
            class="menu-item"
            class:active={$page.url.pathname === item.href}
            href={item.href}
          >
            <Icon size={21} />

            <span>{item.label}</span>
          </a>
        {/each}
      </nav>
    </aside>

    <main class="content">
      <section class="page-slot">
        {@render children?.()}
      </section>
    </main>
  </div>
</div>
{:else}
  {@render children?.()}
{/if}
