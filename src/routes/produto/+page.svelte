<script lang="ts">
  import {
    Package,
    Users,
    FileText,
    PieChart,
    Wallet,
    Plus,
    Edit,
    Trash2,
    X,
    ChevronUp,
    ChevronDown
  } from '@lucide/svelte';
  
  import { enhance } from '$app/forms';
  import type { PageData, ActionData } from './$types';

  let { data, form }: { data: PageData; form: ActionData } = $props();

  let editId = $state<number | null>(null);
  let inputName = $state('');
  let inputPrice = $state<number | string>('');
  let inputQuantity = $state<number | string>('');

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

  function handleEdit(product: any) {
    editId = product.id;
    inputName = product.name;
    inputPrice = product.price;
    inputQuantity = product.quantity;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelEdit() {
    editId = null;
    inputName = '';
    inputPrice = '';
    inputQuantity = '';
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
    <h2>Produtos</h2>
  </div>

  {#if form?.error}
    <div style="color: #dc2626; background: #fee2e2; padding: 1rem; border-radius: 8px;">
      {form.error}
    </div>
  {/if}

  <div class="form-card dark-card">
    <form 
      method="POST" 
      action={editId ? '?/update' : '?/create'} 
      use:enhance={() => {
        return async ({ result, update }) => {
          if (result.type === 'success') cancelEdit();
          update();
        };
      }}
      class="add-product-form"
    >
      {#if editId}
        <input type="hidden" name="id" value={editId} />
      {/if}
      
      <div class="input-group">
        <label for="productName">Nome do Produto</label>
        <input
          type="text"
          id="productName"
          name="name" 
          bind:value={inputName}
          placeholder="Ex: Cabo Flexível"
          class="form-input dark-input"
          required
        />
      </div>

      <div class="input-group">
        <label for="productPrice">Preço Unitário</label>
        <input
          type="number"
          id="productPrice"
          name="price"
          bind:value={inputPrice}
          placeholder="R$ 0,00"
          step="any"
          min="0"
          class="form-input dark-input"
          required
        />
      </div>

      <div class="input-group">
        <label for="productQuantity">Quantidade</label>
        <input
          type="number"
          id="productQuantity"
          name="quantity"
          bind:value={inputQuantity}
          placeholder="Ex: 100"
          min="0"
          class="form-input dark-input"
          required
        />
      </div>

      <div style="display: flex; gap: 0.5rem; height: 46px;">
        <button type="submit" class="btn-primary">
          <Plus size={20} />
          {editId ? 'Atualizar' : 'Adicionar'}
        </button>

        {#if editId}
          <button type="button" class="btn-primary" style="background: #ef4444;" onclick={cancelEdit}>
            <X size={20} />
          </button>
        {/if}
      </div>
    </form>
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
            <td class="actions-col" style="display: flex; justify-content: flex-end; gap: 0.5rem;">
              
              <button type="button" class="btn-icon edit" aria-label="Editar produto" onclick={() => handleEdit(product)}>
                <Edit size={18} />
              </button>

              <form method="POST" action="?/delete" use:enhance>
                <input type="hidden" name="id" value={product.id} />
                <button type="submit" class="btn-icon delete" aria-label="Excluir produto">
                  <Trash2 size={18} />
                </button>
              </form>

            </td>
          </tr>
        {:else}
          <tr>
            <td colspan="5" class="empty-state">Nenhum produto cadastrado no banco de dados.</td>
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

  .page-header h2 {
    margin: 0;
    color: #1f2937;
    font-size: 2rem;
  }

  .dark-card {
    background: linear-gradient(180deg, #071826 0%, #03111d 100%);
    border-radius: 18px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    padding: 2rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  .add-product-form {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr auto;
    gap: 1.5rem;
    align-items: flex-end;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .input-group label {
    font-weight: 500;
    color: rgba(255, 255, 255, 0.85);
    font-size: 0.9rem;
    letter-spacing: 0.02em;
  }

  .dark-input {
    padding: 0.75rem 1rem;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 8px;
    font-size: 1rem;
    outline: none;
    transition: all 0.2s;
    background-color: rgba(255, 255, 255, 0.04);
    color: white;
  }

  .dark-input::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }

  .dark-input:focus {
    border-color: #00b4b6;
    background-color: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 0 3px rgba(0, 180, 182, 0.2);
  }

  .btn-primary {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #00b4b6;
    color: white;
    padding: 0 1.5rem;
    height: 46px;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    transition: background-color 0.2s, transform 0.1s;
    white-space: nowrap;
  }

  .btn-primary:hover {
    background: #00d2d3;
  }
  
  .btn-primary:active {
    transform: translateY(1px);
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

  @media (max-width: 1024px) {
    .add-product-form {
      grid-template-columns: 1fr 1fr;
    }
    
    .btn-primary {
      grid-column: span 2;
      justify-content: center;
    }
  }

  @media (max-width: 640px) {
    .add-product-form {
      grid-template-columns: 1fr;
    }
    
    .btn-primary {
      grid-column: span 1;
    }
    
    .data-table th, .data-table td {
      padding: 1rem;
    }
  }
</style>