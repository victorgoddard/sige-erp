<script lang="ts">
  import type { PageData } from './$types';
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import {
    reportBreadcrumbs,
    reportCards
  } from '$lib/components/form/ChartsForm.svelte';

  let { data }: { data: PageData } = $props();

  type ReportChart = {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }>;
  };

  function getChartMaxValue(chart: ReportChart) {
    const values = chart.datasets.flatMap((dataset) => dataset.data);
    return Math.max(1, ...values);
  }

  function getBarHeight(value: number, maxValue: number) {
    if (value <= 0 || maxValue <= 0) return 0;
    const height = (value / maxValue) * 100;
    // Garante uma altura mínima para barras com valor > 0 para que sejam visíveis
    return Math.max(8, height);
  }

  function getVariationClass(variation: string) {
    if (variation.startsWith('-')) return 'is-negative';
    if (variation.startsWith('+')) return 'is-positive';
    return 'is-neutral';
  }
</script>

<svelte:head>
  <title>Relatórios</title>
</svelte:head>

<Breadcrumbs items={reportBreadcrumbs} />

<section class="reports-page">
  <div class="reports-container">
    <div class="reports-content">
      <div class="charts-column">
        
        <article class="report-card chart-card">
          <h2>{reportCards.openOrdersTitle}: {data.openOrdersTotal} em aberto</h2>
          <p class="chart-description">Histórico dos últimos 6 meses</p>

          <div class="bar-chart" aria-label="Total de ordens de compra por mês">
            <div class="chart-lines" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div class="bars" aria-label="Barras do relatorio de ordens de compra">
              {#each data.openOrdersChart.labels as _, labelIndex}
                <div class="bar-group">
                  <div class="bar-pair">
                    {#each data.openOrdersChart.datasets as dataset}
                    {@const value = Number(dataset.data[labelIndex] ?? 0)}
                    {#if value > 0}
                      <div class="bar-wrapper">
                        <span
                          class="bar"
                          style={`height: ${getBarHeight(value, getChartMaxValue(data.openOrdersChart as ReportChart))}%; background: ${dataset.backgroundColor}; border: 1px solid ${dataset.borderColor}`}
                        >
                        </span>
                        <div class="bar-tooltip">
                          <strong>{value}</strong>
                          <small>{dataset.label}</small>
                        </div>
                      </div>
                    {:else}
                      <div class="bar-wrapper bar-empty"></div>
                    {/if}
                    {/each}
                  </div>
                  <small class="x-label">{data.openOrdersChart.labels[labelIndex]}</small>
                </div>
              {/each}
            </div>
          </div>

          <div class="chart-legend">
            {#each data.openOrdersChart.datasets as dataset}
              <div class="legend-item">
                <span style={`background: ${dataset.backgroundColor}; border: 1px solid ${dataset.borderColor}`}></span>
                <small>{dataset.label}</small>
              </div>
            {/each}
          </div>
        </article>

        <article class="report-card chart-card">
          <h2>{reportCards.lowStockTitle}: {data.lowStockTotal}</h2>
          <p class="chart-description">
            Produtos abaixo do estoque mínimo | Faltam: {data.lowStockUnitsTotal ?? 0} un
          </p>

          <div class="bar-chart" aria-label="Quantidade de produtos abaixo do estoque mínimo">
            <div class="chart-lines" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div class="bars" aria-label="Barras do relatorio de estoque minimo">
              {#each data.lowStockChart.labels as _, labelIndex}
                <div class="bar-group">
                  <div class="bar-pair">
                    {#each data.lowStockChart.datasets as dataset}
                    {@const value = Number(dataset.data[labelIndex] ?? 0)}
                    {#if value > 0}
                      <div class="bar-wrapper">
                        <span
                          class="bar"
                          style={`height: ${getBarHeight(value, getChartMaxValue(data.lowStockChart as ReportChart))}%; background: ${dataset.backgroundColor}; border: 1px solid ${dataset.borderColor}`}
                        >
                        </span>
                        <div class="bar-tooltip">
                          <strong>{value}</strong>
                          <small>{dataset.label}</small>
                        </div>
                      </div>
                    {:else}
                       <div class="bar-wrapper bar-empty"></div>
                    {/if}
                    {/each}
                  </div>
                  <small class="x-label" title={data.lowStockChart.labels[labelIndex]}>
                    {data.lowStockChart.labels[labelIndex]}
                  </small>
                </div>
              {/each}
            </div>
          </div>

          <div class="chart-legend">
            {#each data.lowStockChart.datasets as dataset}
              <div class="legend-item">
                <span style={`background: ${dataset.backgroundColor}; border: 1px solid ${dataset.borderColor}`}></span>
                <small>{dataset.label}</small>
              </div>
            {/each}
          </div>
        </article>

      </div>

      <aside class="report-card metric-card">
        <div class="metric-icon" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <h2>{reportCards.balanceTitle}</h2>

        <div class="metric-value-row">
          <strong>{data.financialMetric.amount}</strong>
          <small class={`metric-variation ${getVariationClass(data.financialMetric.variation)}`} aria-live="polite">
            {data.financialMetric.variation}
          </small>
        </div>
      </aside>
    </div>
  </div>
</section>

<style>
  .reports-page {
    width: 100%;
    padding: 2.8rem 2rem 2rem;
  }

  .reports-container {
    width: 100%;
    max-width: 1100px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
  }

  .reports-content {
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    gap: 2rem;
  }

  .charts-column {
    width: 100%;
    max-width: 700px;
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
  }

  .report-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
    padding: 1.5rem;
  }

  .metric-card {
    flex: 0 0 280px;
    min-height: 12rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: sticky;
    top: 2rem;
  }

  .chart-card h2,
  .metric-card h2 {
    margin: 0;
    text-align: center;
    font-size: 1.1rem;
    color: #0f172a;
    font-weight: 700;
  }

  .chart-description {
    margin: 0.4rem 0 1.5rem;
    text-align: center;
    font-size: 0.8rem;
    color: #64748b;
    font-weight: 500;
  }

  .bar-chart {
    position: relative;
    width: 100%;
    height: 12rem; /* Mais alto para caber os tooltips e a visualização do mês */
    padding: 0.5rem 0 1.5rem;
    border-radius: 8px;
  }

  /* Linhas de fundo do gráfico */
  .chart-lines {
    position: absolute;
    inset: 0 0 1.5rem 0; /* Espaço para as labels em baixo */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    pointer-events: none;
    z-index: 0;
  }

  .chart-lines span {
    display: block;
    width: 100%;
    height: 0;
    border-top: 1px dashed #cbd5e1;
  }

  .bars {
    position: relative;
    z-index: 1;
    height: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: space-around;
    gap: 0.5rem;
  }

  .bar-group {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    height: 100%;
    gap: 0.5rem;
  }

  .bar-pair {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 4px;
  }

  .bar-wrapper {
    position: relative;
    display: flex;
    align-items: flex-end;
    height: 100%;
    flex: 0 1 20px; /* Largura máxima da barra */
    min-width: 12px;
  }
  
  .bar-empty {
    width: 12px;
  }

  .bar {
    width: 100%;
    border-radius: 6px 6px 0 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.3);
    cursor: pointer;
  }

  /* Efeitos Hover na Barra */
  .bar-wrapper:hover .bar {
    filter: brightness(1.15) saturate(1.2);
    transform: scaleY(1.02);
    transform-origin: bottom;
  }

  /* Tooltip Flutuante moderno em cima da barra */
  .bar-tooltip {
    position: absolute;
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%) translateY(10px);
    background: #1e293b;
    color: white;
    padding: 0.4rem 0.6rem;
    border-radius: 6px;
    font-size: 0.7rem;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s ease;
    pointer-events: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    z-index: 10;
  }

  .bar-tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 4px;
    border-style: solid;
    border-color: #1e293b transparent transparent transparent;
  }

  .bar-wrapper:hover .bar-tooltip {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(0);
  }

  .bar-tooltip strong {
    font-size: 0.85rem;
    font-weight: 700;
  }

  .bar-tooltip small {
    color: #94a3b8;
    font-size: 0.65rem;
  }

  .x-label {
    display: block;
    width: 100%;
    text-align: center;
    font-size: 0.75rem;
    color: #475569;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .chart-legend {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem 1.5rem;
    width: 100%;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #f1f5f9;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .legend-item span {
    width: 12px;
    height: 12px;
    border-radius: 3px;
  }

  .legend-item small {
    font-size: 0.75rem;
    font-weight: 600;
    color: #475569;
  }

  .metric-icon {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 4px;
    height: 24px;
    margin-bottom: 1rem;
    color: #0ea5e9;
  }

  .metric-icon span {
    display: block;
    width: 6px;
    background: currentColor;
    border-radius: 999px;
  }

  .metric-icon span:nth-child(1) { height: 12px; }
  .metric-icon span:nth-child(2) { height: 18px; }
  .metric-icon span:nth-child(3) { height: 24px; }

  .metric-card h2 {
    margin-bottom: 0.5rem;
    font-size: 1rem;
  }

  .metric-card strong {
    display: inline-block;
    font-size: 1.75rem;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.2;
  }

  .metric-value-row {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
    margin-top: 0.5rem;
  }

  .metric-variation {
    font-size: 0.8rem;
    font-weight: 700;
    padding: 0.2rem 0.6rem;
    border-radius: 999px;
    background: #f1f5f9;
  }

  .metric-variation.is-positive {
    color: #15803d;
    background: #dcfce7;
  }

  .metric-variation.is-negative {
    color: #b91c1c;
    background: #fee2e2;
  }

  .metric-variation.is-neutral {
    color: #475569;
  }

  @media (max-width: 900px) {
    .reports-page {
      padding: 1.5rem 1rem;
    }

    .reports-content {
      flex-direction: column;
      align-items: stretch;
    }

    .charts-column {
      max-width: 100%;
    }

    .metric-card {
      position: static;
      width: 100%;
      flex: initial;
    }

    .bar-chart {
      height: 14rem;
    }
  }
</style>