<script lang="ts">
  import type { PageProps } from "./$types";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import UpdatePage from "$lib/components/buttons/UpdatePage.svelte";
  import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";
  import { applyAction, enhance } from "$app/forms";
  import { showToast } from '$lib/components/toast/toastStore';

  let { data }: PageProps = $props();
  let {
    suppliers,
    total,
    variavelYagoTeste 
  } = $derived(data);
  let isLoading = $state(false);
  let supplierEditing = $state<(typeof suppliers)[0] | null>(null);
  let isNew = $state(true);
  let texto = $state(page.url.searchParams.get("texto") ?? "");
  let errors = $state<Record<string, string> | null>(null);

  function getPreview(content: string): string {
    return content
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  async function filtrarPorTexto() {
    isLoading = true;

    const next = new URL(page.url);

    if (texto.trim() === '') {
      next.searchParams.delete('texto');
    } else {
      next.searchParams.set('texto', texto.trim());
    }

    next.searchParams.delete('page');

    await goto(next.toString(), {
      replaceState: true,
      noScroll: true,
      keepFocus: true,
    });

    isLoading = false;
  }
</script>

<svelte:head>
  <title>Fornecedores</title>
</svelte:head>

<Breadcrumbs items={[
  { href: '/', label: 'Home' },
  { href: '/fornecedores', label: 'Fornecedores' }
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

    return async ({ result, update }) => {
      if (result.status === 200) {
        showToast(`${isNew ? "Fornecedor cadastrado" : "Fornecedor atualizado"} com sucesso!`, "success");
        goto("/fornecedores");
      } else {
        await applyAction(result);

        if (result.type === 'failure') {
          if (result.data?.errors) {
            errors = result.data.errors as Record<string, string>;
          }
          if (result.data?.exception) {
            showToast(result.data.exception as string, "error");
          } else {
            showToast("Ocorreu um erro!", "error");
          }
        }

        isLoading = false;
      }
    };
  }}
>
  <div class="w-full flex justify-between">
    <h1 class="text-2xl font-bold mb-1">{isNew ? "Adicionar" : "Editar"} Fornecedor</h1>
    <!-- {#if !isNew}
      <UpdatedBy
        createdAt={entidade?.createdAt ? new Date(entidade?.createdAt.getTime() / 1000).toLocaleString() : 'N/A'}
        updatedAt={entidade?.updatedAt ? new Date(entidade?.updatedAt).toLocaleString() : 'N/A'}
      />
    {/if} -->
  </div>
  <div class="w-full divider"></div>
  <!-- <input type="hidden" name="id" value={supplierEditing ? supplierEditing.id : ''} /> -->

  <div class="w-full md:w-3/12 pr-5">
    <label for="name" class="label">
      <span class="label-text">Nome <span class="text-red-500">*</span></span>
    </label>
    <input
      placeholder="Nome do fornecedor"
      type="text"
      id="name"
      name="name"
      class="input input-bordered w-full {errors?.name ? 'input-error' : ''}"
      value={supplierEditing ? supplierEditing.name : ''}>
    {#if errors?.name}
      <span class="text-error text-sm">{errors.name}</span>
    {/if}
  </div>

  <!-- <div class="w-full md:w-2/12">
    <label for="active" class="label">
      <span class="label-text">Ativo</span>
    </label>
    <select id="active" name="active" class="select select-bordered w-full {errors?.active ? 'input-error' : ''}">
      <option value="true" selected={entidade?.active === true}>Sim</option>
      <option value="false" selected={entidade?.active === false}>Nao</option>
    </select>
    {#if errors?.active}
      <span class="text-error text-sm">{errors.active}</span>
    {/if}
  </div> -->

  <div class="w-full flex justify-end mt-5 pr-5">
    <button type="submit" class="btn btn-success" disabled={isLoading}>
      {#if isLoading}
        <span class="loading loading-spinner"></span>
        Enviando...
      {:else}
        Enviar
      {/if}
    </button>
  </div>
</form>

</div>

<div class="flex flex-wrap justify-end">
  <div class="w-full mt-3 lg:w-4/12 lg:pl-3 lg:mt-0">
    <div class="join w-full">
      <input
        type="text"
        name="textoFilter"
        id="textoFilter"
        placeholder="Filtrar por texto"
        bind:value={texto}
        onkeydown={(e) => {
          if (e.key === 'Enter') {
            filtrarPorTexto();
          }
        }}
        class="input input-bordered join-item w-full"
      />
      <button class="btn join-item" type="button" onclick={filtrarPorTexto}>Filtrar</button>
    </div>
  </div>
  <div class="w-full mt-3 lg:w-2/12 lg:pl-3 lg:mt-0">
    <div class="dropdown dropdown-end w-full">
      <a href="/fornecedores/novo" class="btn w-full btn-success">
        Adicionar
      </a>
    </div>
  </div>
</div>

<div class="w-full mt-5">
  {#if isLoading}
    <div class="rounded-xl border border-base-content min-h-48 flex items-center justify-center">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
  {:else}
    <div class="overflow-x-auto overflow-y-auto max-h-125 rounded-xl border border-base-content">
      <table class="table w-full min-w-175">
        <thead class="sticky top-0 bg-base-100 z-10 shadow-sm">
          <tr>
            <th class="w-3/12">Título</th>
            <th class="w-8/12">Conteúdo</th>
            <th class="w-1/12">Ações</th>
          </tr>
        </thead>
        <tbody>
          {#if suppliers.length === 0}
            <tr>
              <td colspan="12" class="text-center">
                  Nenhum fornecedor encontrado
              </td>
            </tr>
          {:else }
            {#each suppliers as supplier}
              <tr>
                <td>{supplier.name}</td>
                <td>
                  <div class="dropdown dropdown-left">
                    <div tabindex="0" role="button" class="btn m-1">...</div>
                    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
                    <ul
                      tabindex="0"
                      class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
                    >
                      <li>
                        <a
                          class="btn btn-success"
                          href="/home/supplier/{supplier.id}">Editar
                        </a>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
    <UpdatePage
      entityName="fornecedor"
      displayItems={suppliers.length}
      totalItems={total}
      pluralName="fornecedores"
    />
  {/if}
  
</div>

<style>
  :global(body) {
    margin: 0;
    background: #f5f6fa;
    font-family: Inter, sans-serif;
  }

  .layout {
    display: flex;
    min-height: 100vh;
  }

  .sidebar {
    width: 260px;
    background: linear-gradient(180deg, #071826 0%, #03111d 100%);
    color: white;
    display: flex;
    flex-direction: column;
    border-right: 4px solid #00b4b6;
  }

  .company-section {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 2rem 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .company-avatar,
  .avatar {
    width: 54px;
    height: 54px;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.15);
    font-weight: 700;
    font-size: 1.1rem;
    border: 2px solid rgba(255, 255, 255, 0.35);
  }

  .company-section span {
    font-size: 1.35rem;
    font-weight: 500;
  }

  .menu {
    display: flex;
    flex-direction: column;
    padding: 2rem 0;
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    height: 60px;
    padding: 0 2rem;
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.82);
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.2s;

    text-decoration: none;
  }

  .menu-item:hover {
    background: rgba(255, 255, 255, 0.06);
  }

  .menu-item.active {
    color: #00d2d3;
    background: rgba(0, 210, 211, 0.08);
  }

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .topbar {
    position: relative;
    height: 96px;
    background: linear-gradient(90deg, #041420 0%, #071f32 45%, #00b4b6 100%);
    overflow: hidden;
  }

  .topbar-overlay {
    position: absolute;
    right: 22%;
    top: -40px;
    width: 320px;
    height: 180px;
    background: rgba(255, 255, 255, 0.08);
    transform: rotate(35deg);
  }

  .topbar-content {
    position: relative;
    z-index: 2;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
  }

  .topbar h1 {
    color: white;
    font-size: 2.2rem;
    margin: 0;
    font-weight: 700;
  }

  .user-area {
    display: flex;
    align-items: center;
    gap: 1rem;
    color: white;
    font-size: 1.1rem;
    font-weight: 500;
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
    border-radius: 18px;
    border: 1px solid #e5e7eb;
    padding: 2rem;
  }

  @media (max-width: 1200px) {
    .layout {
      flex-direction: column;
    }

    .sidebar {
      width: 100%;
      border-right: none;
      border-bottom: 4px solid #00b4b6;
    }
  }
</style>