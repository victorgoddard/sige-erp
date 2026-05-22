<script lang="ts" module>
	export const reportBreadcrumbs = [
		{ href: '/', label: 'Base' },
		{ href: '/charts', label: 'Relatórios' }
	];

	export const reportCards = {
		openOrdersTitle: 'Total de ordens de compra em aberto',
		lowStockTitle: 'Quantidade de produtos abaixo do estoque mínimo',
		balanceTitle: 'Saldo financeiro'
	};

	export const chartLegend = [
		{
			label: 'Baixo',
			color: '#8edfdc'
		},
		{
			label: 'Médio',
			color: '#29c4be'
		},
		{
			label: 'Alto',
			color: '#0f766e'
		}
	];

	export function getBarColor(index: number): string {
		const positionInGroup = index % 3;

		if (positionInGroup === 0) return chartLegend[0].color;
		if (positionInGroup === 1) return chartLegend[1].color;
		return chartLegend[2].color;
	}

	export function hasGroupSpacing(index: number): boolean {
		return (index + 1) % 3 === 0;
	}
</script>
