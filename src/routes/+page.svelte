<script lang="ts">
  import { Package, Users, FileText, PieChart, Wallet } from "@lucide/svelte";

  import HomeViewContent from "$lib/components/home/HomeViewContent.svelte";

  const menuItems = [
    {
      label: "Produto",
      icon: Package,
      href: "/product",
    },
    {
      label: "Fornecedores",
      icon: Users,
      href: "/fornecedores",
    },
    {
      label: "Ordens de Compra",
      icon: FileText,
      href: "/purchase-orders",
    },
    {
      label: "Fluxo de Caixa",
      icon: Wallet,
      href: "/cash-flow",
    },
    {
      label: "Relatórios",
      icon: PieChart,
      href: "/charts",
    },
  ];
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>

<div class="layout">
  <main class="content">
    <section class="page-content">
      <div class="form-card">
        <HomeViewContent />
      </div>
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
    color: black;
  }

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .page-content {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    justify-content: center;
    align-items: center;
  }

  .form-card {
    background: white;
    border-radius: 18px;
    border: 1px solid #e5e7eb;
    padding: 2rem;
    margin-top: 6rem;
    width: 30rem;
    height: 10rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  @media (max-width: 1200px) {
    .layout {
      flex-direction: column;
    }
  }
</style>
