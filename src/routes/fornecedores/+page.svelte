<script lang="ts">
  import type { PageProps } from "./$types";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import UpdatePage from "$lib/components/buttons/UpdatePage.svelte";
  import Breadcrumbs from "$lib/components/Breadcrumbs.svelte";

  let { data }: PageProps = $props();
  let {
    suppliers,
    total,
  } = $derived(data);
  let isLoading = $state(false);
  let texto = $state(page.url.searchParams.get("texto") ?? "");

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

<div class="flex flex-wrap justify-end">
  <div class="w-full mt-3 lg:w-4/12 lg:pl-3 lg:mt-0">
    <div class="join w-full">
      <input
        type="text"
        name="textoFilter"
        id="textoFilter"
        placeholder="Digite um nome"
        bind:value={texto}
        onkeydown={(e) => {
          if (e.key === 'Enter') {
            filtrarPorTexto();
          }
        }}
        class="input join-item w-full"/>
      <button class="btn join-item" type="button" onclick={filtrarPorTexto}>Filtrar</button>
    </div>
  </div>
  <a class="btn btn-success ml-3" href="/fornecedores/novo">Novo fornecedor</a>
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
            <th class="w-3/12">Nome</th>
            <th class="w-3/12">Telefone</th>
            <th class="w-8/12">Condição de Pagamento</th>
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
                <td>{supplier.telefone}</td>
                <td>{supplier.condicaoPagamento}</td>
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
                          href="/fornecedores/editar/{supplier.id}">Editar
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
