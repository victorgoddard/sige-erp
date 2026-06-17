import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { cashFlowTable, type NewCashFlowType } from '$lib/server/db/tables/cash-flow';
import { and, asc, count, gte, lte, sql } from 'drizzle-orm';

function getCurrentMonthRange() {
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, '0');
	const startDay = '01';
	const endDay = String(new Date(year, now.getMonth() + 1, 0).getDate()).padStart(2, '0');

	return {
		startDate: `${year}-${month}-${startDay}`,
		endDate: `${year}-${month}-${endDay}`
	};

}

function normalizeDate(value: string | null, fallback: string) {
	return value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : fallback;
}

export const load = (async ({ depends, url }) => {
	depends('cash-flow:list');

	const defaultRange = getCurrentMonthRange();
	const startDate = normalizeDate(url.searchParams.get('startDate'), defaultRange.startDate);
	const endDate = normalizeDate(url.searchParams.get('endDate'), defaultRange.endDate);

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
