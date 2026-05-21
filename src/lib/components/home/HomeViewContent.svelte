<script lang="ts">
 import { Package } from 'lucide-svelte';

</script>

<div class="table-wrapper">
  <Package class="icon" size={64} />
  <p class="label">Selecione um módulo para continuar</p>
</div>

<style>
  .table-wrapper {
    background: white;
    border-radius: 18px;
    overflow: hidden;

    text-align: center;
  }

  .label{
    display: block;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 1rem;
    font-weight: 500;

    font-family: Inter, sans-serif;
  }

  .icon{
    display: block;
    color: #9ca3af;
    margin: 0 auto 0.5rem auto;

  }

</style>