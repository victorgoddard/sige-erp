<script lang="ts">
  import type { ActionData, PageData } from './$types';
  import PurchaseOrdersTable from '$lib/components/purchase-orders/PurchaseOrdersTable.svelte';

  let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head>
  <title>Ordens de Compra</title>
</svelte:head>

<section class="page-content">
  <div class="page-header">
    <div class="flex justify-between items-center">
      <h2>Ordens de Compra</h2>
      <a href="/ordemcompra/novo" class="btn btn-success">
        <span>+</span>
        Nova
      </a>
    </div>
  </div>

  <PurchaseOrdersTable
    orders={data.orders}
    suppliers={data.suppliers}
    products={data.products}
    statuses={data.statuses}
  />
</section>

<style>
  :global(body) {
    margin: 0;
    background: #f5f6fa;
    font-family: Inter, sans-serif;
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

  .page-header div {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  @media (max-width: 760px) {
    .page-content {
      padding: 1rem;
    }
  }
</style>
