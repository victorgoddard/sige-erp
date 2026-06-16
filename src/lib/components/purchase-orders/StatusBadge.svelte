<script lang="ts">
  import { Status, type StatusType } from '$lib/enums/orderStatus';

  let { status }: { status: StatusType } = $props();

  const variants: Record<StatusType, { label: string; className: string }> = {
    [Status.Pending]: { label: Status.Pending, className: 'pending' },
    [Status.Processing]: { label: Status.Processing, className: 'processing' },
    [Status.AwaitingAproval]: { label: Status.AwaitingAproval, className: 'awaiting' },
    [Status.Approved]: { label: Status.Approved, className: 'approved' }
  };

  let variant = $derived(variants[status] ?? { label: status, className: 'neutral' });
</script>

<span class={`badge ${variant.className}`}>
  {variant.label}
</span>

<style>
  .badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 112px;
    padding: 0.55rem 0.8rem;
    border-radius: 8px;
    font-size: 0.82rem;
    font-weight: 700;
    line-height: 1;
    white-space: nowrap;
  }

  .pending {
    background: #fff7ed;
    color: #c2410c;
  }

  .processing {
    background: #e0f2fe;
    color: #0369a1;
  }

  .awaiting {
    background: #fef9c3;
    color: #a16207;
  }

  .approved {
    background: #dcfce7;
    color: #15803d;
  }

  .neutral {
    background: #f3f4f6;
    color: #4b5563;
  }
</style>
