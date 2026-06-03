<script lang="ts">
  import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
  import {
    chartLegend,
    getBarColor,
    hasGroupSpacing,
    reportBreadcrumbs,
    reportCards
  } from '$lib/components/form/ChartsForm.svelte';
  import {
    financialMetric,
    lowStockBars,
    openOrdersBars
  } from '$lib/mock/charts';
</script>

<svelte:head>
  <title>Relatórios</title>
</svelte:head>

<Breadcrumbs
  items={reportBreadcrumbs}
/>

<section class="reports-page">
  <div class="reports-container">
    <div class="reports-content">
      <div class="charts-column">
        <article class="report-card chart-card">
          <h2>{reportCards.openOrdersTitle}</h2>

          <div class="bar-chart" aria-label="Total de ordens de compra em aberto">
            <div class="chart-lines" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div class="bars">
              {#each openOrdersBars as bar, index}
                <span
                  class="bar"
                  class:group-spacing={hasGroupSpacing(index)}
                  style={`height: ${bar}%; background: ${getBarColor(index)}`}
                ></span>
              {/each}
            </div>
          </div>

          <div class="chart-legend">
            {#each chartLegend as item}
              <div class="legend-item">
                <span style={`background: ${item.color}`}></span>
                <small>{item.label}</small>
              </div>
            {/each}
          </div>
        </article>

        <article class="report-card chart-card">
          <h2>{reportCards.lowStockTitle}</h2>

          <div class="bar-chart" aria-label="Quantidade de produtos abaixo do estoque mínimo">
            <div class="chart-lines" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div class="bars">
              {#each lowStockBars as bar, index}
                <span
                  class="bar"
                  class:group-spacing={hasGroupSpacing(index)}
                  style={`height: ${bar}%; background: ${getBarColor(index)}`}
                ></span>
              {/each}
            </div>
          </div>

          <div class="chart-legend">
            {#each chartLegend as item}
              <div class="legend-item">
                <span style={`background: ${item.color}`}></span>
                <small>{item.label}</small>
              </div>
            {/each}
          </div>
        </article>
      </div>

      <aside class="report-card metric-card">
        <div class="metric-icon" aria-hidden="true">
          <span></span>
          <span></span>
        </div>

        <h2>{reportCards.balanceTitle}</h2>
        <strong>{financialMetric.amount}</strong>
        <p>{financialMetric.variation}</p>
      </aside>
    </div>
  </div>
</section>

<style>
  .reports-page {
    width: 100%;
    padding: 8rem 2rem 2rem;
  }

  .reports-container {
    width: 100%;
    display: flex;
  }

  .reports-content {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .charts-column {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 2rem;
  }

  .report-card {
    background: #f8fafc;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  }

  .chart-card {
    width: 100%;
    padding: 1rem 1.25rem 0.9rem;
  }

  .metric-card {
    flex: 0 0 260px;
    min-height: 8.7rem;
    padding: 1rem 0.8rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .chart-card h2,
  .metric-card h2 {
    margin: 0 0 0.75rem;
    text-align: center;
    font-size: 0.85rem;
    line-height: 1.2;
    color: #111827;
    font-weight: 800;
  }

  .bar-chart {
    position: relative;
    width: 100%;
    height: 9rem;
    padding: 0.25rem 0.25rem 0;
    overflow: hidden;
  }

  .chart-lines {
    position: absolute;
    inset: 0.25rem 0.25rem 0.25rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    pointer-events: none;
  }

  .chart-lines span {
    display: block;
    width: 100%;
    height: 1px;
    background: #e2e8f0;
  }

  .bars {
    position: relative;
    z-index: 1;
    height: 100%;
    display: flex;
    align-items: flex-end;
    gap: 0.5rem;
  }

  .bar {
    flex: 1;
    min-width: 0.5rem;
    border-radius: 2px 2px 0 0;
  }

  .bar.group-spacing {
    margin-right: 1.25rem;
  }

  .bar.group-spacing:last-child {
    margin-right: 0;
  }

  .chart-legend {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 65%;
    margin-top: 0.75rem;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }

  .legend-item span {
    width: 0.45rem;
    height: 0.45rem;
    border-radius: 999px;
  }

  .legend-item small {
    font-size: 0.65rem;
    font-weight: 700;
    color: #64748b;
  }

  .metric-icon {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 0.15rem;
    height: 1.2rem;
    margin-bottom: 0.5rem;
    color: #10bdb7;
  }

  .metric-icon span {
    display: block;
    width: 0.3rem;
    background: currentColor;
    border-radius: 999px;
  }

  .metric-icon span:first-child {
    height: 0.55rem;
  }

  .metric-icon span:last-child {
    height: 1rem;
  }

  .metric-card h2 {
    margin-bottom: 0.35rem;
    font-size: 0.8rem;
  }

  .metric-card strong {
    display: block;
    font-size: 0.95rem;
    font-weight: 800;
    color: #111827;
  }

  .metric-card p {
    margin: 0.3rem 0 0;
    font-size: 0.65rem;
    font-weight: 700;
    color: #14b8b6;
    text-align: center;
  }

  @media (max-width: 900px) {
    .reports-page {
      padding: 1rem;
    }

    .reports-content {
      flex-direction: column;
      align-items: stretch;
    }

    .metric-card {
      width: 100%;
      flex: initial;
    }

    .bar-chart {
      height: 6rem;
    }

    .chart-legend {
      width: 100%;
    }

    .bar.group-spacing {
      margin-right: 0.5rem;
    }
  }
</style>