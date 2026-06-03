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

  let { data, children } = $props();

  const shellRoutes = new Set(['/', '/fornecedores', '/charts']);

  const menuItems = [
    {
      label: 'Produto',
      icon: Package,
      href: '/produto'
    },
    {
      label: 'Fornecedores',
      icon: Users,
      href: '/fornecedores'
    },
    {
      label: 'Ordens de Compra',
      icon: ClipboardList,
      href: '/ordemcompra'
    },
    {
      label: 'Fluxo de Caixa',
      icon: Wallet,
      href: '/fluxocaixa'
    },
    {
      label: 'Relatórios',
      icon: PieChart,
      href: '/relatorios'
    }
  ];

  const pageTitles: Record<string, string> = {
    '/': 'SIGE ERP',
    '/fornecedores': 'Fornecedores',
    '/charts': 'Relatórios'
  };

  function currentTitle(pathname: string) {
    return pageTitles[pathname] ?? 'SIGE ERP';
  }
</script>

<!-- {#if shellRoutes.has($page.url.pathname)} -->
 {#if !data.hideShell}
  <div class="layout">
  
    <header class="topbar">
      <h1>{currentTitle($page.url.pathname)}</h1>

      <div class="topbar-cut"></div>

      <div class="user-area">
        <div class="avatar">
          {data.userName[0].toUpperCase() || "U"}
        </div>

        <span>{data.userName || "Usuário"}</span>
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

        <nav class="side-menu" aria-label="Menu principal">
          {#each menuItems as item}
            {@const Icon = item.icon}
            <a
              class="side-menu-item"
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
  <div class="layout">
  
    <header class="topbar">

      <div class="topbar-cut"></div>

    </header>

    {@render children?.()}
  </div>
{/if}
<!-- {:else}
  {@render children?.()}
{/if} -->

<style>
  .layout {
    min-height: 100vh;
    background: #f7f9fc;
    color: #172033;
    font-family: Inter, Arial, sans-serif;
  }

  .topbar {
    position: relative;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
    overflow: hidden;
    background: linear-gradient(90deg, #14222c 0%, #0a1720 58%, #00a8a6 100%);
    border-bottom: 3px solid #00b4b6;
  }

  .topbar h1 {
    position: relative;
    z-index: 2;
    margin: 0;
    color: white;
    font-size: 1.3rem;
    font-weight: 800;
  }

  .topbar-cut {
    position: absolute;
    right: 18%;
    width: 360px;
    height: 180px;
    background: rgba(0, 180, 182, 0.36);
    transform: skewX(-42deg);
  }

  .user-area {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 0.85rem;
    color: white;
    font-size: 0.95rem;
    font-weight: 600;
  }

  .avatar {
    width: 48px;
    height: 48px;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #e6eef5;
    color: #14222c;
    font-weight: 800;
    border: 3px solid rgba(255, 255, 255, 0.85);
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.18);
  }

  .workspace {
    display: grid;
    grid-template-columns: 190px minmax(0, 1fr);
    min-height: calc(100vh - 72px);
    min-width: 0;
  }

  .sidebar {
    min-width: 0;
    background: linear-gradient(180deg, #172833 0%, #0c1b24 100%);
    color: white;
    border-right: 4px solid #00b4b6;
  }

  .company-section {
    height: 66px;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0 1.25rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.92);
    font-size: 0.95rem;
  }

  .company-avatar {
    width: 34px;
    height: 34px;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.75);
    background: rgba(0, 180, 182, 0.24);
    flex-shrink: 0;
  }

  .side-menu {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    padding: 1.8rem 0;
  }

  .side-menu-item {
    height: 48px;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    padding: 0 1.55rem;
    color: rgba(255, 255, 255, 0.86);
    font-size: 0.9rem;
    text-decoration: none;
    transition: background 0.2s, color 0.2s;
  }

  .side-menu-item:hover {
    background: rgba(255, 255, 255, 0.06);
  }

  .side-menu-item.active {
    color: #00d2d3;
  }

  .content,
  .page-slot {
    min-width: 0;
  }

  .page-slot {
    padding: 1rem 1.35rem 2rem;
  }

  @media (max-width: 1100px) {
    .workspace {
      grid-template-columns: 1fr;
    }

    .sidebar {
      border-right: none;
      border-bottom: 4px solid #00b4b6;
      overflow: hidden;
    }

    .company-section {
      height: 58px;
    }

    .side-menu {
      flex-direction: row;
      overflow-x: auto;
      padding: 0.65rem 0.75rem;
      scrollbar-width: none;
    }

    .side-menu::-webkit-scrollbar {
      display: none;
    }

    .side-menu-item {
      height: 42px;
      padding: 0 0.9rem;
      flex-shrink: 0;
      border-radius: 8px;
    }
  }

  @media (max-width: 720px) {
    .topbar {
      height: auto;
      min-height: 82px;
      padding: 1rem;
      align-items: flex-start;
      flex-direction: column;
      gap: 0.9rem;
    }

    .topbar-cut {
      right: -120px;
      top: -30px;
    }

    .user-area {
      align-self: flex-end;
    }
  }
</style>
