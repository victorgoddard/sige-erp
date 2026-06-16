<script lang="ts">
  let supplierName = $state('');
  let supplierCnpj = $state('');
  let supplierPhone = $state('');
  let supplierEmail = $state('');
  let supplierPaymentCondition = $state('');


  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    /*const payload = {
      supplierId: selectedSupplier,
      productId: selectedProduct,
      quantity,
      unitPrice
    };*/

    //console.log(payload);
  }
</script>

<form class="purchase-order-form" onsubmit={handleSubmit}>
  <div class="field large">
    <label for="name">Nome</label>

    <input id="name"
      type="text"
      step="0.01"
      bind:value={supplierName}
      placeholder="Ex.: Vogel Tecnologia">

  </div>

  <div class="field large">
    <label for="cnpj">CNPJ</label>

    <input id="cnpj"
      type="text"
      step="0.01"
      bind:value={supplierCnpj}
      placeholder="Ex.: 12.345.678/0001-95">

  </div>

  <div class="field large">
    <label for="phone">Telefone</label>

    <input id="phone"
      type="text"
      step="0.01"
      bind:value={supplierPhone}
      placeholder="Ex.: (31) 98765-4321">

  </div>

  <div class="field large">
    <label for="email">Email</label>

    <input id="email"
      type="email"
      step="0.01"
      bind:value={supplierEmail}
      placeholder="Ex.: contato@vogeltec.com.br">

  </div>

  <div class="field large">
    <label for="paymentcondition">Condições de Pagamento</label>

    <input id="paymentcondition"
      type="text"
      step="0.01"
      bind:value={supplierPaymentCondition}
      placeholder="Ex.: 30 dias">

  </div>

  <button type="submit" class="small">
    Salvar
  </button>
</form>

<style>
  .purchase-order-form {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    align-items: end;
    gap: 1.5rem;
    width: 100%;

    flex-wrap: wrap;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .large {
    flex: 1;
  }

  .small {
    width: 180px;
  }

  label {
    font-size: 1rem;
    font-weight: 600;
    color: #1f2937;
  }

  input {
    height: 54px;
    border-radius: 12px;
    border: 1px solid #d1d5db;
    padding: 0 1rem;
    font-size: 0.95rem;
    outline: none;
    background: white;
  }

  input:focus {
    border-color: #00b4b6;
  }

  button {
    height: 54px;
    border: none;
    border-radius: 12px;
    padding: 0 2rem;
    background: linear-gradient(90deg, #00b4b6, #00999b);
    color: white;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap;
  }

  @media (max-width: 1200px) {
    .purchase-order-form {
      flex-direction: column;
      align-items: stretch;
    }

    .small {
      width: 100%;
    }
  }
</style>
