<script lang="ts">
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";
  import { showToast } from "$lib/components/toast/toastStore";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
  let { order, suppliers, statuses } = $derived(data);

  let isLoading = $state(false);
  let selectedSupplier = $state('');
  let selectedProduct = $state('');
  let quantity = $state<number | null>(null);
  let selectedStatus = $state('');
  let products = $state<Array<{ id: number; name: string; price: number; quantity: number }>>([]);
  let isLoadingProducts = $state(false);

  let product = $derived(products.find((item) => String(item.id) === selectedProduct));
  let unitPrice = $derived(product?.price ?? 0);
  let quantityValue = $derived(quantity && quantity > 0 ? quantity : 0);
  let totalPrice = $derived(unitPrice * quantityValue);
  let isLocked = $derived(order.status === 'Pago');
  let canSubmit = $derived(!isLocked && Boolean(selectedSupplier && selectedProduct && quantityValue > 0));

  function currency(value: number) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  async function loadProductsForSupplier(supplierId: string) {
    products = [];

    if (!supplierId) {
      return;
    }

    isLoadingProducts = true;

    try {
      const response = await fetch(`/ordemcompra/produtos/${supplierId}`);

      if (!response.ok) {
        showToast("Não foi possível carregar os produtos do fornecedor.", "error");
        return;
      }

      const data = await response.json() as {
        products: Array<{ id: number; name: string; price: number; quantity: number }>;
      };

      products = data.products ?? [];

      if (selectedProduct) {
        const currentProductExists = products.some((item) => String(item.id) === selectedProduct);
        if (!currentProductExists) {
          selectedProduct = '';
        }
      }
    } catch {
      showToast("Não foi possível carregar os produtos do fornecedor.", "error");
    } finally {
      isLoadingProducts = false;
    }
  }

  onMount(async () => {
    selectedSupplier = String(order.supplierId);
    selectedProduct = String(order.productId);
    quantity = order.quantity ?? null;
    selectedStatus = order.status;

    if (selectedSupplier) {
      await loadProductsForSupplier(selectedSupplier);
    }
  });
</script>

<svelte:head>
  <title>Editar ordem de compra</title>
</svelte:head>

<Breadcrumbs items={[
  { href: '/', label: 'Home' },
  { href: '/ordemcompra', label: 'Ordens de Compra' },
  { href: `/ordemcompra/editar/${order.id}`, label: 'Editar' }
]} />

<div class="flex flex-wrap">
  <form
    method="POST"
    class="w-full flex flex-wrap p-6 rounded-xl shadow-md mb-10"
    use:enhance={({ cancel }) => {
      if (isLoading) {
        cancel();
        return;
      }
      isLoading = true;

      return async ({ result }) => {
        if (result.status === 200) {
          showToast("Ordem de compra atualizada com sucesso!", "success");
          await goto("/ordemcompra");
        } else if (result.type === "failure") {
          if (result.data?.error) {
            showToast(result.data.error as string, "error");
          } else {
            showToast("Ocorreu um erro!", "error");
          }
        }
        isLoading = false;
      };
    }}
  >
    <div class="w-full flex justify-between">
      <div>
        <h1 class="text-2xl font-bold mb-1">Editar ordem de compra</h1>
        <p class="text-sm text-base-content/70">Editando: {order.orderNumber}</p>
        {#if isLocked}
          <p class="text-sm text-error font-semibold mt-1">Pedido pago. Edição bloqueada.</p>
        {/if}
      </div>
      <a class="btn" href="/ordemcompra">Voltar</a>
    </div>
    <div class="w-full divider"></div>

    <div class="w-full md:w-3/12 pr-5">
      <label for="supplier" class="label">
        <span class="label-text">Fornecedor <span class="text-red-500">*</span></span>
      </label>
      <select
        id="supplier"
        name="supplierId"
        bind:value={selectedSupplier}
        onchange={async (event) => {
          if (isLocked) return;
          selectedSupplier = (event.currentTarget as HTMLSelectElement).value;
          await loadProductsForSupplier(selectedSupplier);
        }}
        class="select select-bordered w-full"
        disabled={isLocked}
        required
      >
        <option value="">Selecione o fornecedor</option>
        {#each suppliers as supplier}
          <option value={String(supplier.id)}>
            {supplier.name}
          </option>
        {/each}
      </select>
    </div>

    <div class="w-full md:w-3/12 pr-5">
      <label for="product" class="label">
        <span class="label-text">Produto <span class="text-red-500">*</span></span>
      </label>
      <select
        id="product"
        name="productId"
        bind:value={selectedProduct}
        class="select select-bordered w-full"
        disabled={isLocked || !selectedSupplier || isLoadingProducts}
        required
      >
        <option value="">
          {#if isLoadingProducts}
            Carregando produtos...
          {:else if selectedSupplier}
            Selecione o produto
          {:else}
            Selecione o fornecedor primeiro
          {/if}
        </option>
        {#each products as product}
          <option value={String(product.id)}>
            {product.name}
          </option>
        {/each}
      </select>
    </div>

    <div class="w-full md:w-3/12 pr-5">
      <label for="quantity" class="label">
        <span class="label-text">Quantidade <span class="text-red-500">*</span></span>
      </label>
      <input
        id="quantity"
        name="quantity"
        type="number"
        min="1"
        step="1"
        bind:value={quantity}
        placeholder="Ex.: 100"
        class="input input-bordered w-full"
        disabled={isLocked}
        required
      />
    </div>

    <div class="w-full md:w-3/12 pr-5">
      <label for="status" class="label">
        <span class="label-text">Status</span>
      </label>
      <select
        id="status"
        name="status"
        bind:value={selectedStatus}
        class="select select-bordered w-full"
        disabled={isLocked}
      >
        <option value="">Selecione o status</option>
        {#each statuses as status}
          <option value={status}>
            {status}
          </option>
        {/each}
      </select>
    </div>

    <div class="w-full flex gap-6 mt-6 pr-5">
      <div>
        <div class="label">
          <span class="label-text">Valor unitário</span>
        </div>
        <div class="text-lg font-bold">{currency(unitPrice)}</div>
      </div>
      <div>
        <div class="label">
          <span class="label-text">Total</span>
        </div>
        <div class="text-lg font-bold">{currency(totalPrice)}</div>
      </div>
    </div>

    <div class="w-full flex justify-end mt-5 pr-5">
      <button type="submit" class="btn btn-success" disabled={isLoading || !canSubmit}>
        {#if isLoading}
          <span class="loading loading-spinner"></span>
          Salvando...
        {:else}
          Salvar
        {/if}
      </button>
    </div>
  </form>
</div>
