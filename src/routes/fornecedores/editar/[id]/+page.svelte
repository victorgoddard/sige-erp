<script lang="ts">
  import type { PageProps } from "./$types";
  import { applyAction, enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";
  import { showToast } from "$lib/components/toast/toastStore";

  let { data }: PageProps = $props();
  let { supplier } = $derived(data);
  let isLoading = $state(false);
  let errors = $state<Record<string, string> | null>(null);
</script>

<svelte:head>
  <title>Editar fornecedor</title>
</svelte:head>

<Breadcrumbs items={[
  { href: '/', label: 'Home' },
  { href: '/fornecedores', label: 'Fornecedores' },
  { href: `/fornecedores/editar/${supplier.id}`, label: 'Editar' }
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
          showToast("Fornecedor atualizado com sucesso!", "success");
          await goto("/fornecedores");
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
      <div>
        <h1 class="text-2xl font-bold mb-1">Editar fornecedor</h1>
        <p class="text-sm text-base-content/70">Editando: {supplier.name}</p>
      </div>
      <a class="btn" href="/fornecedores">Voltar</a>
    </div>
    <div class="w-full divider"></div>

    <div class="w-full md:w-3/12 pr-5">
      <label for="name" class="label">
        <span class="label-text">Nome <span class="text-red-500">*</span></span>
      </label>
      <input
        placeholder="Nome do fornecedor"
        type="text"
        id="name"
        name="name"
        class="input  w-full {errors?.name ? 'input-error' : ''}"
        value={supplier.name}
      />
      {#if errors?.name}
        <span class="text-error text-sm">{errors.name}</span>
      {/if}
    </div>

    <div class="w-full md:w-3/12 pr-5">
      <label for="telefone" class="label">
        <span class="label-text">Telefone <span class="text-red-500">*</span></span>
      </label>
      <input
        placeholder="Telefone do fornecedor"
        type="text"
        id="telefone"
        name="telefone"
        class="input w-full {errors?.telefone ? 'input-error' : ''}"
        value={supplier.telefone}
        oninput={(e) => {
          const input = e.target as HTMLInputElement;
          const digits = input.value.replace(/\D/g, "").slice(0, 11);

          if (digits.length <= 10) {
            input.value = digits
              .replace(/(\d{2})(\d)/, "($1) $2")
              .replace(/(\d{4})(\d)/, "$1-$2");
          } else {
            input.value = digits
              .replace(/(\d{2})(\d)/, "($1) $2")
              .replace(/(\d{5})(\d)/, "$1-$2");
          }
        }}
      />
      {#if errors?.telefone}
        <span class="text-error text-sm">{errors.telefone}</span>
      {/if}
    </div>

    <div class="w-full md:w-3/12 pr-5">
      <label for="condicaoPagamento" class="label">
        <span class="label-text">Condicao de Pagamento <span class="text-red-500">*</span></span>
      </label>
      <input
        placeholder="Condicao de Pagamento"
        type="text"
        id="condicaoPagamento"
        name="condicaoPagamento"
        class="input w-full {errors?.condicaoPagamento ? 'input-error' : ''}"
        value={supplier.condicaoPagamento}
      />
      {#if errors?.condicaoPagamento}
        <span class="text-error text-sm">{errors.condicaoPagamento}</span>
      {/if}
    </div>

    <div class="w-full md:w-3/12 pr-5 flex flex-col">
      <label for="active" class="label">
        <span class="label-text">Ativo</span>
      </label>
      <input
        type="checkbox"
        name="active"
        class="checkbox checkbox-success"
        checked={supplier.active}
      />
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
