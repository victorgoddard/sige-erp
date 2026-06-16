<script lang="ts">
  import { enhance } from '$app/forms';
  import { Edit, Save, Trash2, X } from '@lucide/svelte';
  import type { StatusType } from '$lib/enums/orderStatus';
  import type { Product, PurchaseOrder, Supplier } from '$lib/types/purchase-order';
  import StatusBadge from './StatusBadge.svelte';

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

  let editId = $state<number | null>(null);
  let editSupplierId = $state('');
  let editProductId = $state('');
  let editQuantity = $state<number | null>(null);
  let editStatus = $state<StatusType | ''>('');

  let editProduct = $derived(products.find((product) => String(product.id) === editProductId));
  let editUnitPrice = $derived(editProduct?.price ?? 0);
  let editQuantityValue = $derived(editQuantity && editQuantity > 0 ? editQuantity : 0);
  let editTotalPrice = $derived(editUnitPrice * editQuantityValue);

  function currency(value: number) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  function startEdit(order: PurchaseOrder) {
    editId = order.id;
    editSupplierId = String(order.supplier.id);
    editProductId = String(order.product.id);
    editQuantity = order.quantity;
    editStatus = order.status;
  }

  function cancelEdit() {
    editId = null;
    editSupplierId = '';
    editProductId = '';
    editQuantity = null;
    editStatus = '';
  }

  function updateFormId(orderId: number) {
    return `purchase-order-update-${orderId}`;
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
        <tr class:editing={editId === order.id}>
          <td class="order-code">{order.orderNumber}</td>
          <td>{order.date}</td>

          <td>
            {#if editId === order.id}
              <select name="supplierId" form={updateFormId(order.id)} bind:value={editSupplierId} required>
                {#each suppliers as supplier}
                  <option value={String(supplier.id)}>
                    {supplier.name}
                  </option>
                {/each}
              </select>
            {:else}
              {order.supplier.name}
            {/if}
          </td>

          <td>
            {#if editId === order.id}
              <select name="productId" form={updateFormId(order.id)} bind:value={editProductId} required>
                {#each products as product}
                  <option value={String(product.id)}>
                    {product.name}
                  </option>
                {/each}
              </select>
            {:else}
              {order.product.name}
            {/if}
          </td>

          <td>
            {#if editId === order.id}
              <input
                class="quantity-input"
                name="quantity"
                form={updateFormId(order.id)}
                type="number"
                min="1"
                step="1"
                bind:value={editQuantity}
                required
              />
            {:else}
              {order.quantity}
            {/if}
          </td>

          <td>{currency(editId === order.id ? editUnitPrice : order.unitPrice)}</td>
          <td class="total-cell">{currency(editId === order.id ? editTotalPrice : order.totalPrice)}</td>

          <td>
            {#if editId === order.id}
              <select name="status" form={updateFormId(order.id)} bind:value={editStatus} required>
                {#each statuses as status}
                  <option value={status}>
                    {status}
                  </option>
                {/each}
              </select>
            {:else}
              <StatusBadge status={order.status} />
            {/if}
          </td>

          <td class="actions-col">
            <form
              id={updateFormId(order.id)}
              method="POST"
              action="?/update"
              use:enhance={() => {
                return async ({ result, update }) => {
                  if (result.type === 'success') cancelEdit();
                  update();
                };
              }}
            >
              <input type="hidden" name="orderId" value={order.id} />
            </form>

            <div class="action-buttons">
              {#if editId === order.id}
                <button
                  type="button"
                  class="btn-icon cancel"
                  title="Cancelar edição"
                  aria-label="Cancelar edição"
                  onclick={cancelEdit}
                >
                  <X size={17} />
                </button>
              {:else}
                <button
                  type="button"
                  class="btn-icon edit"
                  title="Editar ordem"
                  aria-label="Editar ordem"
                  onclick={() => startEdit(order)}
                >
                  <Edit size={17} />
                </button>
              {/if}

              <button
                type="submit"
                form={updateFormId(order.id)}
                class="btn-icon save"
                title="Salvar ordem"
                aria-label="Salvar ordem"
                disabled={editId !== order.id}
              >
                <Save size={17} />
              </button>

              <form
                method="POST"
                action="?/delete"
                use:enhance={() => {
                  return async ({ result, update }) => {
                    if (result.type === 'success' && editId === order.id) cancelEdit();
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

  tbody tr:last-child td {
    border-bottom: none;
  }

  tbody tr.editing {
    background: #f8fafc;
  }

  select,
  input {
    width: 100%;
    min-width: 130px;
    height: 40px;
    border-radius: 8px;
    border: 1px solid #d1d5db;
    background: white;
    color: #111827;
    font-size: 0.9rem;
    outline: none;
    padding: 0 0.7rem;
  }

  select:focus,
  input:focus {
    border-color: #00b4b6;
    box-shadow: 0 0 0 3px rgba(0, 180, 182, 0.14);
  }

  .quantity-input {
    min-width: 96px;
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
