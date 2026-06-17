import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { Status } from '$lib/enums/orderStatus';
import { productTable } from '$lib/server/db/tables/product';
import { purchaseOrderTable } from '$lib/server/db/tables/purchase-order';
import { and, eq, ne } from 'drizzle-orm';

type CookieReader = {
    get: (name: string) => string | undefined;
};

type ReportDataset = {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
};

type ReportChart = {
    labels: string[];
    datasets: ReportDataset[];
};

const OPEN_ORDERS_COLORS = {
    border: '#0f766e',
    background: 'rgba(20, 184, 166, 0.7)'
};

const PAID_ORDERS_COLORS = {
    border: '#0284c7',
    background: 'rgba(56, 189, 248, 0.7)'
};

const STOCK_DEFICIT_COLORS = {
    border: '#b91c1c',
    background: 'rgba(248, 113, 113, 0.7)'
};

const STOCK_CURRENT_COLORS = {
    border: '#d97706',
    background: 'rgba(251, 191, 36, 0.7)'
};

function readUserId(cookies: CookieReader) {
    const session = cookies.get('session');
    if (!session) return null;
    try {
        const parsed = JSON.parse(session);
        const userId = Number(parsed?.userId);
        return Number.isInteger(userId) && userId > 0 ? userId : null;
    } catch {
        return null;
    }
}

function getPurchaseOrderFilterByUser(userId: number | null) {
    return userId ? eq(purchaseOrderTable.idUser, userId) : undefined;
}

function truncateLabel(value: string, maxLength = 14) {
    if (value.length <= maxLength) return value;
    return `${value.slice(0, maxLength - 1)}...`;
}

function formatCurrencyBRL(value: number) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function buildOpenOrdersChart(
    labels: string[],
    openOrdersData: number[],
    paidOrdersData: number[]
): ReportChart {
    return {
        labels,
        datasets: [
            {
                label: 'Ordens em aberto',
                data: openOrdersData,
                borderColor: OPEN_ORDERS_COLORS.border,
                backgroundColor: OPEN_ORDERS_COLORS.background
            },
            {
                label: 'Ordens pagas',
                data: paidOrdersData,
                borderColor: PAID_ORDERS_COLORS.border,
                backgroundColor: PAID_ORDERS_COLORS.background
            }
        ]
    };
}

function buildLowStockChart(labels: string[], deficitData: number[], quantityData: number[]): ReportChart {
    return {
        labels,
        datasets: [
            {
                label: 'Déficit para mínimo',
                data: deficitData,
                borderColor: STOCK_DEFICIT_COLORS.border,
                backgroundColor: STOCK_DEFICIT_COLORS.background
            },
            {
                label: 'Estoque atual',
                data: quantityData,
                borderColor: STOCK_CURRENT_COLORS.border,
                backgroundColor: STOCK_CURRENT_COLORS.background
            }
        ]
    };
}

export const load = (async ({ depends, cookies }) => {
    depends('reports:list');

    const userId = readUserId(cookies);

    try {
        const userPurchaseOrderFilter = getPurchaseOrderFilterByUser(userId);

        const userOrdersRows = userPurchaseOrderFilter
            ? await db
                    .select({ 
                        status: purchaseOrderTable.status,
                        totalPrice: purchaseOrderTable.totalPrice
                    })
                    .from(purchaseOrderTable)
                    .where(userPurchaseOrderFilter)
            : await db
                    .select({ 
                        status: purchaseOrderTable.status,
                        totalPrice: purchaseOrderTable.totalPrice
                    })
                    .from(purchaseOrderTable);

        const userOpenOrdersRows = userPurchaseOrderFilter
            ? await db
                    .select({ orderId: purchaseOrderTable.orderId })
                    .from(purchaseOrderTable)
                    .where(and(userPurchaseOrderFilter, ne(purchaseOrderTable.status, Status.Paid)))
            : await db
                .select({ orderId: purchaseOrderTable.orderId })
                .from(purchaseOrderTable)
                .where(ne(purchaseOrderTable.status, Status.Paid));

        const productRows = await db
            .select({
                name: productTable.name,
                quantity: productTable.quantity,
                minimumStockQuantity: productTable.minimumStockQuantity
            })
            .from(productTable);

        const shouldFallbackToGlobalData =
            userId !== null &&
            userOrdersRows.length === 0 &&
            userOpenOrdersRows.length === 0;

        let ordersRows = userOrdersRows;
        let openOrdersRows = userOpenOrdersRows;

        if (shouldFallbackToGlobalData) {
            const [globalOrdersRows, globalOpenOrdersRows] = await Promise.all([
                db.select({ 
                    status: purchaseOrderTable.status,
                    totalPrice: purchaseOrderTable.totalPrice
                }).from(purchaseOrderTable),
                db
                    .select({ orderId: purchaseOrderTable.orderId })
                    .from(purchaseOrderTable)
                    .where(ne(purchaseOrderTable.status, Status.Paid))
            ]);

            ordersRows = globalOrdersRows;
            openOrdersRows = globalOpenOrdersRows;
        }

        // Contagem de ordens para o gráfico geral
        const openOrdersCount = ordersRows.filter((order) => order.status !== Status.Paid).length;
        const paidOrdersCount = ordersRows.filter((order) => order.status === Status.Paid).length;

        // CÁLCULO DO SALDO FINANCEIRO: Soma direta de todas as ordens com status Pago
        const totalPaidSum = ordersRows
            .filter((order) => order.status === Status.Paid)
            .reduce((total, order) => total + Number(order.totalPrice || 0), 0);

        const lowStockProducts = productRows
            .filter((product) => product.quantity < product.minimumStockQuantity)
            .map((product) => ({
                name: product.name,
                deficit: product.minimumStockQuantity - product.quantity,
                quantity: product.quantity
            }))
            .sort((a, b) => b.deficit - a.deficit);

        const criticalProducts = lowStockProducts.slice(0, 7);
        const lowStockLabels =
            criticalProducts.length > 0 ? criticalProducts.map((product) => truncateLabel(product.name)) : ['Sem dados'];
        const lowStockDeficitData =
            criticalProducts.length > 0 ? criticalProducts.map((product) => product.deficit) : [0];
        const lowStockQuantityData =
            criticalProducts.length > 0 ? criticalProducts.map((product) => product.quantity) : [0];
        const lowStockTotalUnits = lowStockProducts.reduce(
            (total, product) => total + Math.max(product.deficit, 0),
            0
        );

        return {
            openOrdersTotal: openOrdersRows.length,
            lowStockTotal: lowStockProducts.length,
            lowStockUnitsTotal: lowStockTotalUnits,
            openOrdersChart: buildOpenOrdersChart(['Geral'], [openOrdersCount], [paidOrdersCount]),
            lowStockChart: buildLowStockChart(lowStockLabels, lowStockDeficitData, lowStockQuantityData),
            financialMetric: {
                amount: formatCurrencyBRL(totalPaidSum),
                variation: 'Total acumulado pago'
            }
        };
    } catch (error) {
        console.error(error);

        return {
            openOrdersTotal: 0,
            lowStockTotal: 0,
            openOrdersChart: buildOpenOrdersChart(['Geral'], [0], [0]),
            lowStockChart: buildLowStockChart(['Sem dados'], [0], [0]),
            financialMetric: {
                amount: formatCurrencyBRL(0),
                variation: 'Sem dados'
            }
        };
    }
}) satisfies PageServerLoad;