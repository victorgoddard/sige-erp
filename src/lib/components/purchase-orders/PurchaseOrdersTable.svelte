<script lang="ts">
  import StatusBadge from './StatusBadge.svelte';

  import type { PurchaseOrder } from '$lib/types/purchase-order';

  let { orders = [] }: { orders?: PurchaseOrder[] } = $props();

  function currency(value: number) {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }
</script>

<div class="table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Nº da Ordem</th>
        <th>Data</th>
        <th>Fornecedor</th>
        <th>Produto</th>
        <th>Quantidade</th>
        <th>Valor Unitário (R$)</th>
        <th>Valor Total (R$)</th>
        <th>Status</th>
      </tr>
    </thead>

    <tbody>
      {#each orders as order}
        <tr>
          <td>{order.orderNumber}</td>
          <td>{order.date}</td>
          <td>{order.supplier.name}</td>
          <td>{order.product.name}</td>
          <td>{order.quantity}</td>
          <td>{currency(order.unitPrice)}</td>
          <td>{currency(order.totalPrice)}</td>
          <td>
            <StatusBadge status={order.status} />
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .table-wrapper {
    background: white;
    border-radius: 18px;
    overflow: hidden;
    border: 1px solid #e5e7eb;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  thead {
    background: linear-gradient(90deg, #06131e 0%, #081d2b 100%);
  }

  th {
    color: white;
    text-align: left;
    padding: 1.4rem 1.5rem;
    font-size: 0.95rem;
    font-weight: 700;
  }

  td {
    padding: 1.5rem;
    border-bottom: 1px solid #edf2f7;
    color: #374151;
    font-size: 0.95rem;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
</style>