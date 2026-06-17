<script lang="ts">
  import {
    Plus,
    Edit,
    Trash2,
    ChevronUp,
    ChevronDown
  } from '@lucide/svelte';
  
  import { enhance } from '$app/forms';
  import type { ActionData } from './$types';
  import { showToast } from '$lib/components/toast/toastStore';

  interface Product {
    id: number;
    name: string;
    price: number;
    quantity: number;
    minimumStockQuantity: number;
    fornecedorId: number | null;
    supplierName: string | null;
  }

  let { data, form }: { data: { products: Product[] }; form: ActionData } = $props();

  let sortColumn = $state<string | null>(null);
  let sortDirection = $state<'asc' | 'desc'>('asc');

  let sortedProducts = $derived.by(() => {
    let arr = [...data.products];
    if (!sortColumn) return arr;
    
    return arr.sort((a: any, b: any) => {
      let valA = a[sortColumn as string];
      let valB = b[sortColumn as string];
      
      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortDirection === 'asc' 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA);
      }
      
      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  });

  function handleSort(column: string) {
    if (sortColumn === column) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortColumn = column;
      sortDirection = 'asc';
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
</script>

<svelte:head>
  <title>Produtos</title>
</svelte:head>

<section class="page-content">
  <div class="page-header">
    <div class="flex justify-between items-center">
      <h2>Produtos</h2>
      <a href="/produto/novo" class="btn btn-success">
        <Plus size={20} />
        Novo
      </a>
    </div>
  </div>

  <div class="grid-card">
    <table class="data-table">
      <thead>
        <tr>
          <th class="sortable" onclick={() => handleSort('id')}>
            <div class="th-content">
              ID
              {#if sortColumn === 'id'}
                {#if sortDirection === 'asc'}<ChevronUp size={14} />{:else}<ChevronDown size={14} />{/if}
              {/if}
            </div>
          </th>
          <th class="sortable" onclick={() => handleSort('name')}>
            <div class="th-content">
              Nome do Produto
              {#if sortColumn === 'name'}
                {#if sortDirection === 'asc'}<ChevronUp size={14} />{:else}<ChevronDown size={14} />{/if}
              {/if}
            </div>
          </th>
          <th class="sortable" onclick={() => handleSort('price')}>
            <div class="th-content">
              Preço Unitário
              {#if sortColumn === 'price'}
                {#if sortDirection === 'asc'}<ChevronUp size={14} />{:else}<ChevronDown size={14} />{/if}
              {/if}
            </div>
          </th>
          <th class="sortable" onclick={() => handleSort('quantity')}>
            <div class="th-content">
              Quantidade
              {#if sortColumn === 'quantity'}
                {#if sortDirection === 'asc'}<ChevronUp size={14} />{:else}<ChevronDown size={14} />{/if}
              {/if}
            </div>
          </th>
          <th class="sortable" onclick={() => handleSort('minimumStockQuantity')}>
            <div class="th-content">
              Estoque Mínimo
              {#if sortColumn === 'minimumStockQuantity'}
                {#if sortDirection === 'asc'}<ChevronUp size={14} />{:else}<ChevronDown size={14} />{/if}
              {/if}
            </div>
          </th>
          <th class="sortable" onclick={() => handleSort('supplier')}>
            <div class="th-content">
              Fornecedor
              {#if sortColumn === 'supplier'}
                {#if sortDirection === 'asc'}<ChevronUp size={14} />{:else}<ChevronDown size={14} />{/if}
              {/if}
            </div>
          </th>
          <th class="actions-col">Ações</th>
        </tr>
      </thead>
      <tbody>
        {#each sortedProducts as product (product.id)}
          <tr>
            <td class="id-col">#{String(product.id).padStart(4, '0')}</td>
            <td class="name-col">{product.name}</td>
            <td class="price-col">{formatCurrency(product.price)}</td>
            <td class="quantity-col">{product.quantity} un.</td>
            <td class="quantity-col">{product.minimumStockQuantity} un.</td>
            <td class="supplier-col">{product.supplierName || '-'}</td>
            <td class="actions-col" style="display: flex; justify-content: flex-end; gap: 0.5rem;">
              
              <a href="/produto/editar/{product.id}" class="btn-icon edit" aria-label="Editar produto">
                <Edit size={18} />
              </a>

              <form method="POST" action="?/delete" use:enhance={() => {
                return async ({ result }) => {
                  if (result.type === 'success') {
                    showToast('Produto deletado com sucesso!', 'success');
                  }
                };
              }}>
                <input type="hidden" name="id" value={product.id} />
                <button type="submit" class="btn-icon delete" aria-label="Excluir produto">
                  <Trash2 size={18} />
                </button>
              </form>

            </td>
          </tr>
        {:else}
          <tr>
            <td colspan="7" class="empty-state">Nenhum produto cadastrado no banco de dados.</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</section>

<style>
  :global(body) {
    margin: 0;
    background: #f5f6fa;
    font-family: Inter, sans-serif;
  }

  .page-content {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .page-header div {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .grid-card {
    background: white;
    border-radius: 18px;
    border: 1px solid #e5e7eb;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
  }

  .data-table th,
  .data-table td {
    padding: 1.25rem 1.5rem;
    text-align: left;
    border-bottom: 1px solid #f3f4f6;
  }

  .data-table th {
    background: #071826;
    font-weight: 600;
    color: white;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .sortable {
    cursor: pointer;
    user-select: none;
    transition: background-color 0.2s;
  }

  .sortable:hover {
    background: #0a2438 !important;
  }

  .th-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .data-table tr:last-child td {
    border-bottom: none;
  }

  .data-table tr:hover td {
    background: #f9fafb;
  }

  .id-col {
    color: #6b7280;
    font-family: monospace;
    width: 80px;
  }

  .name-col {
    font-weight: 500;
    color: #1f2937;
  }

  .price-col, .quantity-col {
    color: #4b5563;
  }

  .actions-col {
    width: 120px;
    text-align: right !important;
  }

  .btn-icon {
    background: transparent;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    border-radius: 6px;
    color: #9ca3af;
    transition: all 0.2s;
  }

  .btn-icon.edit:hover {
    color: #3b82f6;
    background: #eff6ff;
  }

  .btn-icon.delete:hover {
    color: #ef4444;
    background: #fef2f2;
  }

  .empty-state {
    text-align: center !important;
    color: #6b7280;
    font-style: italic;
    padding: 3rem !important;
  }

  @media (max-width: 640px) {
    .data-table th, .data-table td {
      padding: 1rem;
    }
  }
</style>