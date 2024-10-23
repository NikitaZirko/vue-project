import {createFetch} from "@vueuse/core";
import {computed} from 'vue';
import config from './config'

const useHttp = createFetch({
    baseUrl: config.BASE_URL,
    options: {
        beforeFetch({ options }) {
            options.headers.Token = config.TOKEN;

            return { options }
        }
    }
});

const useGetOrders = (query) => {

    const url = computed(() => {
        const url = new URL('/orders', config.BASE_URL);

        if (query.dateFrom) {
            url.searchParams.set('dateFrom', query.dateFrom)
        }

        if (query.dateTo) {
            url.searchParams.set('dateTo', query.dateTo)
        }

        if (query.orderStatus) {
            url.searchParams.set('orderStatus', query.orderStatus)
        }

        return url.pathname + url.search;
    });

    return useHttp(url, {
        refetch: true,
        onFetchError(ctx) {
            if (ctx.response?.ok) {
                ctx.error = false
            } else {
                ctx.error = new Error('Error fetch orders')
            }
            return ctx.data = []
        }
    }).json();
};

const useGetOrder = (id) => {

    const url = `/order/${id}`;

    return useHttp(url, {
        onFetchError(ctx) {
            if (ctx.response.ok) {
                ctx.error = false
            } else {
                ctx.error = new Error('Error fetch order')
            }
            return ctx
        }
    }).json();
};

export {
    useGetOrders,
    useGetOrder,
};
