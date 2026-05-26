<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { BriefcaseBusiness } from '@lucide/svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  let startDate = $state('');
  let endDate = $state('');
  let loadedFilterKey = $state('');
  let isLoading = $state(false);

  const rows = $derived(data.rows);
  const totalPeriod = $derived(data.totalCents / 100);

  $effect(() => {
    const nextFilterKey = `${data.filters.startDate}|${data.filters.endDate}`;

    if (loadedFilterKey !== nextFilterKey) {
      startDate = data.filters.startDate;
      endDate = data.filters.endDate;
      loadedFilterKey = nextFilterKey;
    }
  });

  async function applyFilter() {
    isLoading = true;

    const next = new URL(page.url);
    next.searchParams.set('startDate', startDate);
    next.searchParams.set('endDate', endDate);

    await goto(next.toString(), {
      keepFocus: true,
      noScroll: true,
      replaceState: true
    });

    isLoading = false;
  }

  function formatDate(date: string) {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }

  function formatCurrency(value: number) {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }
</script>

<svelte:head>
  <title>Fluxo de Caixa</title>
</svelte:head>

<section class="cash-flow-content">
  <section class="filter-card" aria-label="Filtro por período">
    <strong>Período</strong>

    <div class="period-controls">
      <label for="startDate">
        <span>Data inicial</span>
        <input id="startDate" type="date" bind:value={startDate} />
      </label>

      <span class="range-label">até</span>

      <label for="endDate">
        <span>Data final</span>
        <input id="endDate" type="date" bind:value={endDate} />
      </label>

      <button type="button" onclick={applyFilter} disabled={isLoading}>
        {isLoading ? 'Filtrando...' : 'Filtrar'}
      </button>
    </div>
  </section>

  <section class="table-card" aria-label="Lançamentos de fluxo de caixa">
    <table>
      <thead>
        <tr>
          <th>Data do lançamento</th>
          <th>Descrição</th>
          <th>Origem</th>
          <th>Data prevista de pagamento</th>
          <th>Valor (R$)</th>
          <th>Tipo</th>
        </tr>
      </thead>

      <tbody>
        {#each rows as row}
          <tr>
            <td>{formatDate(row.launchDate)}</td>
            <td>{row.description}</td>
            <td>{row.origin}</td>
            <td>{formatDate(row.dueDate)}</td>
            <td>{formatCurrency(row.value)}</td>
            <td>
              <span class={row.type === 'A Pagar' ? 'payable' : 'receivable'}>
                {row.type}
              </span>
            </td>
          </tr>
        {:else}
          <tr>
            <td class="empty-state" colspan="6">
              Nenhum lançamento encontrado para o período informado.
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </section>

  <section class="total-card" aria-label="Saldo total do período">
    <div class="total-label">
      <BriefcaseBusiness size={24} />
      <strong>Saldo total do período:</strong>
    </div>

    <strong class="total-value">R$ {formatCurrency(totalPeriod)}</strong>
  </section>
</section>

<style>
  .cash-flow-content {
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
    padding: 1rem 1.35rem 2rem;
  }

  .filter-card,
  .table-card,
  .total-card {
    box-sizing: border-box;
    background: white;
    border: 1px solid #dfe5eb;
    border-radius: 8px;
    box-shadow: 0 12px 28px rgba(15, 23, 42, 0.04);
  }

  .filter-card {
    max-width: 640px;
    padding: 1.15rem 1.45rem 1.35rem;
  }

  .filter-card > strong {
    display: block;
    margin-bottom: 0.7rem;
    color: #172033;
    font-size: 0.95rem;
  }

  .period-controls {
    display: grid;
    grid-template-columns: minmax(180px, 1fr) auto minmax(180px, 1fr) 140px;
    align-items: center;
    gap: 1.1rem;
  }

  .period-controls label {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .period-controls label span {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  .period-controls input {
    width: 100%;
    min-width: 0;
    height: 46px;
    box-sizing: border-box;
    border: 1px solid #d7dee7;
    border-radius: 8px;
    padding: 0 0.95rem;
    color: #1f2937;
    font: inherit;
    font-size: 0.92rem;
    outline: none;
  }

  .period-controls input:focus {
    border-color: #00aaa8;
    box-shadow: 0 0 0 3px rgba(0, 180, 182, 0.12);
  }

  .range-label {
    align-self: center;
    color: #1f2937;
    font-size: 0.9rem;
    font-weight: 700;
  }

  .period-controls button {
    width: 100%;
    height: 46px;
    border: none;
    border-radius: 8px;
    background: linear-gradient(90deg, #00aaa8, #008f8d);
    color: white;
    font: inherit;
    font-size: 0.92rem;
    font-weight: 800;
    cursor: pointer;
    box-shadow: 0 8px 16px rgba(0, 143, 141, 0.22);
  }

  .period-controls button:disabled {
    cursor: progress;
    opacity: 0.75;
  }

  .table-card {
    margin-top: 1.55rem;
    overflow: hidden;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }

  thead {
    background: linear-gradient(180deg, #172833, #101d27);
  }

  th {
    height: 48px;
    padding: 0 0.65rem;
    color: white;
    font-size: 0.76rem;
    font-weight: 800;
    text-align: left;
    white-space: nowrap;
  }

  td {
    height: 60px;
    padding: 0 0.65rem;
    color: #253241;
    font-size: 0.9rem;
    border-bottom: 1px solid #dfe5eb;
    vertical-align: middle;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  th:nth-child(1),
  td:nth-child(1) {
    width: 15%;
  }

  th:nth-child(2),
  td:nth-child(2) {
    width: 32%;
  }

  th:nth-child(3),
  td:nth-child(3) {
    width: 11%;
  }

  th:nth-child(4),
  td:nth-child(4) {
    width: 22%;
  }

  th:nth-child(5),
  td:nth-child(5) {
    width: 10%;
  }

  th:nth-child(6),
  td:nth-child(6) {
    width: 10%;
  }

  .payable {
    color: #e60000;
    font-weight: 800;
    white-space: nowrap;
  }

  .receivable {
    color: #057a55;
    font-weight: 800;
    white-space: nowrap;
  }

  .empty-state {
    height: 80px;
    color: #64748b;
    text-align: center;
  }

  .total-card {
    min-height: 96px;
    margin-top: 1.55rem;
    padding: 0 2.5rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 2rem;
  }

  .total-label {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: #172033;
  }

  .total-label strong {
    font-size: 1.25rem;
  }

  .total-value {
    color: #e60000;
    font-size: 1.5rem;
    white-space: nowrap;
  }

  @media (max-width: 1100px) {
    .cash-flow-content {
      padding: 1rem;
    }

    .filter-card {
      max-width: none;
    }

    .table-card {
      overflow-x: auto;
    }

    table {
      min-width: 980px;
    }
  }

  @media (max-width: 720px) {
    .period-controls {
      grid-template-columns: 1fr;
      gap: 0.85rem;
    }

    .range-label {
      justify-self: center;
      padding-top: 0;
      text-align: center;
    }

    .total-card {
      align-items: flex-start;
      flex-direction: column;
      gap: 0.75rem;
      padding: 1.3rem;
    }

    .total-label strong {
      font-size: 1.1rem;
    }
  }
</style>
