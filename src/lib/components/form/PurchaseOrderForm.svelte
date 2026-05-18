<script lang="ts">
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
  let unitPrice = $state<number | null>(null);

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    const payload = {
      supplierId: selectedSupplier,
      productId: selectedProduct,
      quantity,
      unitPrice
    };

    console.log(payload);
  }
</script>

<form class="purchase-order-form" onsubmit={handleSubmit}>
  <div class="field large">
    <label for="supplier">Fornecedor</label>

    <select id="supplier" bind:value={selectedSupplier}>
      <option value="">Selecione o fornecedor</option>

      {#each suppliers as supplier}
        <option value={supplier.id}>
          {supplier.name}
        </option>
      {/each}
    </select>
  </div>

  <div class="field large">
    <label for="product">Produto</label>

    <select id="product" bind:value={selectedProduct}>
      <option value="">Selecione o produto</option>

      {#each products as product}
        <option value={product.id}>
          {product.name}
        </option>
      {/each}
    </select>
  </div>

  <div class="field small">
    <label for="quantity">Quantidade</label>

    <input
      id="quantity"
      type="number"
      bind:value={quantity}
      placeholder="Ex.: 100"
    />
  </div>

  <div class="field small">
    <label for="unitPrice">Valor unitário (R$)</label>

    <input
      id="unitPrice"
      type="number"
      step="0.01"
      bind:value={unitPrice}
      placeholder="Ex.: 10,50"
    />
  </div>

  <button type="submit">
    Criar ordem
  </button>
</form>

<style>
  .purchase-order-form {
    display: flex;
    align-items: end;
    gap: 1.5rem;
    width: 100%;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .large {
    flex: 1;
  }

  .small {
    width: 180px;
  }

  label {
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
  }

  select,
  input {
    height: 54px;
    border-radius: 12px;
    border: 1px solid #d1d5db;
    padding: 0 1rem;
    font-size: 0.95rem;
    outline: none;
    background: white;
  }

  select:focus,
  input:focus {
    border-color: #00b4b6;
  }

  button {
    height: 54px;
    border: none;
    border-radius: 12px;
    padding: 0 2rem;
    background: linear-gradient(90deg, #00b4b6, #00999b);
    color: white;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap;
  }

  @media (max-width: 1200px) {
    .purchase-order-form {
      flex-direction: column;
      align-items: stretch;
    }

    .small {
      width: 100%;
    }
  }
</style>