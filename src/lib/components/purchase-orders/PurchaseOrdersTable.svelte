<script lang="ts">
  import { enhance } from '$app/forms';
  import { Edit, Trash2 } from '@lucide/svelte';
  import type { StatusType } from '$lib/enums/orderStatus';
  import type { Product, PurchaseOrder, Supplier } from '$lib/types/purchase-order';
  import StatusBadge from './StatusBadge.svelte';
  import { showToast } from '../toast/toastStore';

  let {
    orders = [],
    suppliers = [],
    products = [],
    statuses = []
  }: {
    orders?: PurchaseOrder[];
    suppliers?: Supplier[];
    products?: Product[];
    statuses?: StatusType[];
  } = $props();

  function currency(value: number) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
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
        <th>Valor Unitário</th>
        <th>Valor Total</th>
        <th>Status</th>
        <th class="actions-col">Ações</th>
      </tr>
    </thead>

    <tbody>
      {#each orders as order (order.id)}
        <tr>
          <td class="order-code">{order.orderNumber}</td>
          <td>{order.date}</td>
          <td>{order.supplier.name}</td>
          <td>{order.product.name}</td>
          <td>{order.quantity}</td>
          <td>{currency(order.unitPrice)}</td>
          <td class="total-cell">{currency(order.totalPrice)}</td>
          <td>
            <StatusBadge status={order.status} />
          </td>

          <td class="actions-col">
            <div class="action-buttons">
              <a href="/ordemcompra/editar/{order.id}" class="btn-icon edit" title="Editar ordem" aria-label="Editar ordem">
                <Edit size={17} />
              </a>

              <form
                method="POST"
                action="?/delete"
                use:enhance={() => {
                  return async ({ result, update }) => {
                    if (result.type === 'success') {
                      showToast('Ordem de compra deletada com sucesso!', 'success');
                    }
                    update();
                  };
                }}
              >
                <input type="hidden" name="orderId" value={order.id} />
                <button
                  type="submit"
                  class="btn-icon delete"
                  title="Excluir ordem"
                  aria-label="Excluir ordem"
                >
                  <Trash2 size={17} />
                </button>
              </form>
            </div>
          </td>
        </tr>
      {:else}
        <tr>
          <td colspan="9" class="empty-state">
            Nenhuma ordem de compra cadastrada no banco de dados.
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .table-wrapper {
    overflow-x: auto;
    background: white;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
  }

  table {
    width: 100%;
    min-width: 1120px;
    border-collapse: collapse;
  }

  thead {
    background: #071826;
  }

  th {
    color: white;
    text-align: left;
    padding: 1rem 1.1rem;
    font-size: 0.86rem;
    font-weight: 800;
    white-space: nowrap;
  }

  td {
    padding: 1rem 1.1rem;
    border-bottom: 1px solid #edf2f7;
    color: #374151;
    font-size: 0.92rem;
    vertical-align: middle;
  }

  tbody tr {
    border-bottom: 1px solid #edf2f7;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  .order-code,
  .total-cell {
    color: #111827;
    font-weight: 800;
  }

  .actions-col {
    width: 150px;
    text-align: right;
  }

  .action-buttons {
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.45rem;
  }

  .btn-icon {
    width: 36px;
    height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: white;
    color: #374151;
    cursor: pointer;
  }

  .btn-icon:hover:not(:disabled) {
    background: #f9fafb;
  }

  .btn-icon:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }

  .edit {
    color: #0369a1;
  }

  .save {
    color: #047857;
  }

  .delete,
  .cancel {
    color: #b91c1c;
  }

  .empty-state {
    height: 140px;
    text-align: center;
    color: #6b7280;
    font-weight: 700;
  }
</style>
