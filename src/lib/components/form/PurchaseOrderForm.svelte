<script lang="ts">
  import { enhance } from '$app/forms';
  import type { Product, Supplier } from '$lib/types/purchase-order';

  let {
    suppliers = [],
    products = []
  }: {
    suppliers?: Supplier[];
    products?: Product[];
  } = $props();

  let selectedSupplier = $state('');
  let selectedProduct = $state('');
  let quantity = $state<number | null>(null);

  let product = $derived(products.find((item) => String(item.id) === selectedProduct));
  let unitPrice = $derived(product?.price ?? 0);
  let quantityValue = $derived(quantity && quantity > 0 ? quantity : 0);
  let totalPrice = $derived(unitPrice * quantityValue);
  let canSubmit = $derived(Boolean(selectedSupplier && selectedProduct && quantityValue > 0));

  function currency(value: number) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  function resetForm() {
    selectedSupplier = '';
    selectedProduct = '';
    quantity = null;
  }
</script>

<form
  class="purchase-order-form"
  method="POST"
  action="?/create"
  use:enhance={() => {
    return async ({ result, update }) => {
      if (result.type === 'success') resetForm();
      update();
    };
  }}
>
  <div class="field large">
    <label for="supplier">Fornecedor</label>

    <select id="supplier" name="supplierId" bind:value={selectedSupplier} required>
      <option value="">Selecione o fornecedor</option>

      {#each suppliers as supplier}
        <option value={String(supplier.id)}>
          {supplier.name}
        </option>
      {/each}
    </select>
  </div>

  <div class="field large">
    <label for="product">Produto</label>

    <select id="product" name="productId" bind:value={selectedProduct} required>
      <option value="">Selecione o produto</option>

      {#each products as productOption}
        <option value={String(productOption.id)}>
          {productOption.name}
        </option>
      {/each}
    </select>
  </div>

  <div class="field small">
    <label for="quantity">Quantidade</label>

    <input
      id="quantity"
      name="quantity"
      type="number"
      min="1"
      step="1"
      bind:value={quantity}
      placeholder="Ex.: 100"
      required
    />
  </div>

  <div class="summary" aria-live="polite">
    <span>
      Valor unitario
      <strong>{currency(unitPrice)}</strong>
    </span>
    <span>
      Total
      <strong>{currency(totalPrice)}</strong>
    </span>
  </div>

  <button type="submit" disabled={!canSubmit}>
    Criar ordem
  </button>
</form>

<style>
  .purchase-order-form {
    display: grid;
    grid-template-columns: minmax(180px, 1.2fr) minmax(180px, 1.2fr) minmax(140px, 0.6fr) minmax(220px, auto) auto;
    align-items: end;
    gap: 1.25rem;
    width: 100%;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    min-width: 0;
  }

  label {
    font-size: 0.95rem;
    font-weight: 700;
    color: #1f2937;
  }

  select,
  input {
    width: 100%;
    height: 52px;
    border-radius: 8px;
    border: 1px solid #d1d5db;
    padding: 0 1rem;
    font-size: 0.95rem;
    outline: none;
    background: white;
    color: #111827;
  }

  select:focus,
  input:focus {
    border-color: #00b4b6;
    box-shadow: 0 0 0 3px rgba(0, 180, 182, 0.14);
  }

  .summary {
    min-height: 52px;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;
    align-items: stretch;
  }

  .summary span {
    display: flex;
    min-width: 0;
    flex-direction: column;
    justify-content: center;
    gap: 0.25rem;
    border-radius: 8px;
    border: 1px solid #dbeafe;
    background: #eff6ff;
    padding: 0.55rem 0.75rem;
    color: #1e3a8a;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
  }

  .summary strong {
    overflow: hidden;
    color: #111827;
    font-size: 1rem;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  button {
    height: 52px;
    border: none;
    border-radius: 8px;
    padding: 0 1.5rem;
    background: #00999b;
    color: white;
    font-size: 0.95rem;
    font-weight: 800;
    cursor: pointer;
    white-space: nowrap;
  }

  button:hover:not(:disabled) {
    background: #007f81;
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }

  @media (max-width: 1200px) {
    .purchase-order-form {
      grid-template-columns: 1fr 1fr;
    }

    button {
      width: 100%;
    }
  }

  @media (max-width: 760px) {
    .purchase-order-form,
    .summary {
      grid-template-columns: 1fr;
    }
  }
</style>
