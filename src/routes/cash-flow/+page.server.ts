import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { cashFlowTable, type NewCashFlowType } from '$lib/server/db/tables/cash-flow';
import { and, asc, count, gte, lte, sql } from 'drizzle-orm';

const DEFAULT_START_DATE = '2025-05-01';
const DEFAULT_END_DATE = '2025-05-31';

const initialRows: NewCashFlowType[] = [
	{
		launchDate: '2025-05-19',
		description: 'Ordem de Compra OC0004 - Bucha 6mm',
		origin: 'OC0004',
		dueDate: '2025-05-26',
		valueCents: 1500,
		type: 'A Pagar',
		idUser: 1,
		createdAt: new Date('2025-05-19T12:00:00')
	},
	{
		launchDate: '2025-05-18',
		description: 'Ordem de Compra OC0003 - Arruela Lisa 1/4',
		origin: 'OC0003',
		dueDate: '2025-05-25',
		valueCents: 2000,
		type: 'A Pagar',
		idUser: 1,
		createdAt: new Date('2025-05-18T12:00:00')
	},
	{
		launchDate: '2025-05-15',
		description: 'Ordem de Compra OC0002 - Cabo Flexível 2,5mm',
		origin: 'OC0002',
		dueDate: '2025-05-22',
		valueCents: 75000,
		type: 'A Pagar',
		idUser: 1,
		createdAt: new Date('2025-05-15T12:00:00')
	},
	{
		launchDate: '2025-05-10',
		description: 'Ordem de Compra OC0001 - Porca Sextavada 1/4',
		origin: 'OC0001',
		dueDate: '2025-05-17',
		valueCents: 4000,
		type: 'A Pagar',
		idUser: 1,
		createdAt: new Date('2025-05-10T12:00:00')
	}
];

function normalizeDate(value: string | null, fallback: string) {
	return value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : fallback;
}

async function ensureCashFlowTable() {
	await db.run(sql`
		CREATE TABLE IF NOT EXISTS cash_flow (
			id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
			launch_date text NOT NULL,
			description text NOT NULL,
			origin text NOT NULL,
			due_date text NOT NULL,
			value_cents integer NOT NULL,
			type text NOT NULL,
			idUser integer NOT NULL,
			createdAt integer NOT NULL,
			updatedAt integer
		)
	`);
}

async function seedCashFlowIfEmpty() {
	const [totalRows] = await db.select({ total: count(cashFlowTable.id) }).from(cashFlowTable);

	if (totalRows.total === 0) {
		await db.insert(cashFlowTable).values(initialRows);
	}
}

export const load = (async ({ depends, url }) => {
	depends('cash-flow:list');

	await ensureCashFlowTable();
	await seedCashFlowIfEmpty();

	const startDate = normalizeDate(url.searchParams.get('startDate'), DEFAULT_START_DATE);
	const endDate = normalizeDate(url.searchParams.get('endDate'), DEFAULT_END_DATE);

	const periodFilter = and(
		gte(cashFlowTable.launchDate, startDate),
		lte(cashFlowTable.launchDate, endDate)
	);

	const rows = await db
		.select()
		.from(cashFlowTable)
		.where(periodFilter)
		.orderBy(asc(cashFlowTable.launchDate));

	const totalCents = rows.reduce((total, row) => total + row.valueCents, 0);

	return {
		filters: {
			startDate,
			endDate
		},
		rows: rows.map((row) => ({
			id: row.id,
			launchDate: row.launchDate,
			description: row.description,
			origin: row.origin,
			dueDate: row.dueDate,
			value: row.valueCents / 100,
			type: row.type
		})),
		totalCents
	};
}) satisfies PageServerLoad;
