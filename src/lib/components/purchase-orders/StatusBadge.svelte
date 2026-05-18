<script lang="ts">
  import type { PurchaseOrderStatus } from '$lib/types/purchase-order';

  let { status }: { status: PurchaseOrderStatus } = $props();

  const variants: Record<PurchaseOrderStatus, { label: string; className: string }> = {
    PENDENTE: { label: 'Pendente', className: 'pending' },
    APROVADA: { label: 'Aprovada', className: 'approved' },
    RECEBIDA: { label: 'Recebida', className: 'received' }
  };
</script>

<span class={`badge ${variants[status].className}`}>
  {variants[status].label}
</span>

<style>
  .badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 110px;
    padding: 0.65rem 1rem;
    border-radius: 10px;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .pending {
    background: #fff1d6;
    color: #b7791f;
  }

  .approved {
    background: #dbeafe;
    color: #2563eb;
  }

  .received {
    background: #dcfce7;
    color: #15803d;
  }
</style>