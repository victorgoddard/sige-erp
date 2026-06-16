<script lang="ts">
  import PurchaseOrderForm from '$lib/components/form/PurchaseOrderForm.svelte';
  import PurchaseOrdersTable from '$lib/components/purchase-orders/PurchaseOrdersTable.svelte';
  import type { ActionData, PageData } from './$types';

  let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head>
  <title>Ordens de Compra</title>
</svelte:head>

<section class="page-content">
  <div class="page-header">
    <h2>Ordens de Compra</h2>
  </div>

  {#if form?.error}
    <div class="feedback error">
      {form.error}
    </div>
  {/if}

  <div class="form-card">
    <PurchaseOrderForm
      suppliers={data.suppliers}
      products={data.products}
    />
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

  .form-card {
    background: white;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    padding: 2rem;
  }

  .feedback {
    border-radius: 8px;
    padding: 1rem 1.25rem;
    font-weight: 700;
  }

  .error {
    background: #fee2e2;
    color: #b91c1c;
  }

  @media (max-width: 760px) {
    .page-content {
      padding: 1rem;
    }
  }
</style>
