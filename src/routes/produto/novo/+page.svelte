<script lang="ts">
  import { applyAction, enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";
  import { showToast } from "$lib/components/toast/toastStore";
  import type { Supplier } from "$lib/types/purchase-order";

  let { data }: { data: { suppliers: Supplier[] } } = $props();
  let { suppliers } = $derived(data);
  let isLoading = $state(false);
  let errors = $state<Record<string, string> | null>(null);
</script>

<svelte:head>
  <title>Novo produto</title>
</svelte:head>

<Breadcrumbs items={[
  { href: '/', label: 'Home' },
  { href: '/produto', label: 'Produtos' },
  { href: '/produto/novo', label: 'Novo' }
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
        errors = null;

        if (result.status === 200) {
          showToast("Produto cadastrado com sucesso!", "success");
          await goto("/produto");
        } else {
          await applyAction(result);

          if (result.type === "failure") {
            if (result.data?.errors) {
              errors = { ...(result.data.errors as Record<string, string>) };
            }
            if (result.data?.exception) {
              showToast(result.data.exception as string, "error");
            } else {
              showToast("Ocorreu um erro!", "error");
            }
          }
        }
        isLoading = false;
      };
    }}
  >
    <div class="w-full flex justify-between">
      <h1 class="text-2xl font-bold mb-1">Adicionar produto</h1>
      <a class="btn" href="/produto">Voltar</a>
    </div>
    <div class="w-full divider"></div>

    <div class="w-full md:w-3/12 pr-5">
      <label for="name" class="label">
        <span class="label-text">Nome <span class="text-red-500">*</span></span>
      </label>
      <input
        placeholder="Nome do produto"
        type="text"
        id="name"
        name="name"
        class="input w-full {errors?.name ? 'input-error' : ''}"
      />
      {#if errors?.name}
        <span class="text-error text-sm">{errors.name}</span>
      {/if}
    </div>

    <div class="w-full md:w-3/12 pr-5">
      <label for="price" class="label">
        <span class="label-text">Preço <span class="text-red-500">*</span></span>
      </label>
      <input
        placeholder="0,00"
        type="number"
        id="price"
        name="price"
        step="0.01"
        min="0"
        class="input w-full {errors?.price ? 'input-error' : ''}"
      />
      {#if errors?.price}
        <span class="text-error text-sm">{errors.price}</span>
      {/if}
    </div>

    <div class="w-full md:w-3/12 pr-5">
      <label for="quantity" class="label">
        <span class="label-text">Quantidade <span class="text-red-500">*</span></span>
      </label>
      <input
        placeholder="0"
        type="number"
        id="quantity"
        name="quantity"
        step="1"
        min="0"
        class="input w-full {errors?.quantity ? 'input-error' : ''}"
      />
      {#if errors?.quantity}
        <span class="text-error text-sm">{errors.quantity}</span>
      {/if}
    </div>

    <div class="w-full md:w-3/12 pr-5">
      <label for="minimumStockQuantity" class="label">
        <span class="label-text">Quantidade mínima de estoque <span class="text-red-500">*</span></span>
      </label>
      <input
        placeholder="0"
        type="number"
        id="minimumStockQuantity"
        name="minimumStockQuantity"
        step="1"
        min="0"
        class="input w-full {errors?.minimumStockQuantity ? 'input-error' : ''}"
      />
      {#if errors?.minimumStockQuantity}
        <span class="text-error text-sm">{errors.minimumStockQuantity}</span>
      {/if}
    </div>

    <div class="w-full md:w-3/12 pr-5">
      <label for="fornecedorId" class="label">
        <span class="label-text">Fornecedor</span>
      </label>
      <select
        id="fornecedorId"
        name="fornecedorId"
        class="select w-full {errors?.fornecedorId ? 'select-error' : ''}"
      >
        <option value="">Selecione um fornecedor (opcional)</option>
        {#each suppliers as supplier (supplier.id)}
          <option value={supplier.id}>{supplier.name}</option>
        {/each}
      </select>
      {#if errors?.fornecedorId}
        <span class="text-error text-sm">{errors.fornecedorId}</span>
      {/if}
    </div>

    <div class="w-full flex justify-end mt-5 pr-5">
      <button type="submit" class="btn btn-success" disabled={isLoading}>
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
