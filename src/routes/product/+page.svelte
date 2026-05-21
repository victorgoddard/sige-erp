<script lang="ts">
  import {
    Package,
    Users,
    FileText,
    PieChart,
    Wallet
  } from '@lucide/svelte';

  import PurchaseOrderForm from '$lib/components/form/PurchaseOrderForm.svelte';
  import PurchaseOrdersTable from '$lib/components/purchase-orders/PurchaseOrdersTable.svelte';

  import { purchaseOrders } from '$lib/mock/purchase-order';

  import type { Product, Supplier } from '$lib/types/purchase-order';

  const suppliers: Supplier[] = [
    {
      id: '1',
      name: 'Vogel Tecnologia'
    },
    {
      id: '2',
      name: 'Constrular Materiais'
    },
    {
      id: '3',
      name: 'EletroMais'
    }
  ];

  const products: Product[] = [
    {
      id: '1',
      name: 'Parafuso 4x40'
    },
    {
      id: '2',
      name: 'Bucha 6mm'
    },
    {
      id: '3',
      name: 'Cabo Flexível 2,5mm'
    }
  ];

  const menuItems = [
    {
      label: 'Produto',
      icon: Package,
      active: true
    },
    {
      label: 'Fornecedores',
      icon: Users
    },
    {
      label: 'Ordens de Compra',
      icon: FileText
    },
    {
      label: 'Fluxo de Caixa',
      icon: Wallet
    },
    {
      label: 'Relatórios',
      icon: PieChart
    }
  ];
</script>

<svelte:head>
  <title>Produto</title>
</svelte:head>

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
        <button
          class:active={item.active}
          class="menu-item"
          type="button"
        >
          <Icon size={22} />

          <span>{item.label}</span>
        </button>
      {/each}
    </nav>
  </aside>

  <main class="content">
    <header class="topbar">
      <div class="topbar-overlay"></div>

      <div class="topbar-content">
        <h1>Produto</h1>

        <div class="user-area">
          <div class="avatar">
            J
          </div>

          <span>João Cardoso</span>
        </div>
      </div>
    </header>

    <section class="page-content">
      <div class="page-header">
        <h2>Produto</h2>
      </div>

      <div class="form-card">
        <PurchaseOrderForm
          {suppliers}
          {products}
        />
      </div>

      <PurchaseOrdersTable
        orders={purchaseOrders}
      />
    </section>
  </main>
</div>

<style>
  :global(body) {
    margin: 0;
    background: #f5f6fa;
    font-family: Inter, sans-serif;
  }

  .layout {
    display: flex;
    min-height: 100vh;
  }

  .sidebar {
    width: 260px;
    background: linear-gradient(180deg, #071826 0%, #03111d 100%);
    color: white;
    display: flex;
    flex-direction: column;
    border-right: 4px solid #00b4b6;
  }

  .company-section {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 2rem 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .company-avatar,
  .avatar {
    width: 54px;
    height: 54px;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.15);
    font-weight: 700;
    font-size: 1.1rem;
    border: 2px solid rgba(255, 255, 255, 0.35);
  }

  .company-section span {
    font-size: 1.35rem;
    font-weight: 500;
  }

  .menu {
    display: flex;
    flex-direction: column;
    padding: 2rem 0;
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    height: 60px;
    padding: 0 2rem;
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.82);
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.2s;
  }

  .menu-item:hover {
    background: rgba(255, 255, 255, 0.06);
  }

  .menu-item.active {
    color: #00d2d3;
    background: rgba(0, 210, 211, 0.08);
  }

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .topbar {
    position: relative;
    height: 96px;
    background: linear-gradient(90deg, #041420 0%, #071f32 45%, #00b4b6 100%);
    overflow: hidden;
  }

  .topbar-overlay {
    position: absolute;
    right: 22%;
    top: -40px;
    width: 320px;
    height: 180px;
    background: rgba(255, 255, 255, 0.08);
    transform: rotate(35deg);
  }

  .topbar-content {
    position: relative;
    z-index: 2;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
  }

  .topbar h1 {
    color: white;
    font-size: 2.2rem;
    margin: 0;
    font-weight: 700;
  }

  .user-area {
    display: flex;
    align-items: center;
    gap: 1rem;
    color: white;
    font-size: 1.1rem;
    font-weight: 500;
  }

  .page-content {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .page-header h2 {
    margin: 0;
    color: #1f2937;
    font-size: 2rem;
  }

  .form-card {
    background: white;
    border-radius: 18px;
    border: 1px solid #e5e7eb;
    padding: 2rem;
  }

  @media (max-width: 1200px) {
    .layout {
      flex-direction: column;
    }

    .sidebar {
      width: 100%;
      border-right: none;
      border-bottom: 4px solid #00b4b6;
    }
  }
</style>