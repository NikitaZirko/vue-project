<script setup>
import {ref, reactive} from 'vue'
import {useGetOrders, useGetOrder} from '@/services/api.js'
import { useDialog } from 'primevue/usedialog';
import Order from './components/Order.vue';

/**
 * Таблица заказов
 */
const ordersOptions = reactive({
    dateFrom: '2024-05-30',
    dateTo: '2024-06-01',
    orderStatus: '6',
});
const { isFetching, error, data, isFinished } = useGetOrders(ordersOptions);
const selectedOrder = ref();

const minDate = new Date(2024, 4, 1);
const maxDate = new Date(2024, 5, 30);
const dialog = useDialog();
const onRowSelect = async (e) => openDialogOrder(e.data.id);
const openDialogOrder = async (id) => {
    const { isFetching, error, data, isFinished } = await useGetOrder(id);

    if (!data.value) return;

    dialog.open(Order, {
        data: {
            order: data
        },
        props: {
            header: 'Данные по заказу',
            style: {
                'max-width': '90%',
            },
            maximizable: true,
            dismissableMask: true,
            modal: true
        }
    });
}
const columns = ref([
    { field: 'uid1c', header: 'Номер заказа', expander: false },
    { field: 'created', header: 'Дата создания заказа' },
    { field: 'status.title', header: 'Статус заказа' },
    { field: 'shipment.method.title', header: 'Тип отгрузки' },
    { field: 'shipment.date', header: 'Дата отгрузки' },
    { field: 'payment.method.title', header: 'Способ оплаты' },
    { field: 'shop.title', header: 'Место отгрузки' },
    { field: 'client.firstname', header: 'ФИО клиента' },
    { field: 'amount', header: 'Сумма заказа' },
    { field: 'quantity', header: 'Количество товаров в заказе' },
    { field: 'operator', header: 'Кто создал заказ' },
]);
const getSeverity = (status) => {
    switch (status) {
        case 'Заказ выполнен':
            return 'tag-success';
        case 'Заказ зарезервирован':
            return 'tag-reserved';
        case 'Заказ отменен':
            return 'tag-warn';
        default: 'tag-neutral'
    }
};

/**
 * Блок поиска заказа
 */
const numOrder = ref();
const numOrderLoading = ref(false);
const searchNumOrder = async () => {
    numOrderLoading.value = true;
    await openDialogOrder(numOrder.value);
    numOrderLoading.value = false;
}

/**
 * Блок фильтрации
 */
const dateOrderStart = ref('2024-05-30');
const dateOrderEnd = ref('2024-06-01');
const statusOrder = ref();
const filterLoading = ref(false);
const filterOrders = () => {
    if (dateOrderStart.value != ordersOptions.dateFrom) {
        ordersOptions.dateFrom = dateOrderStart.value;
    }

    if (dateOrderEnd.value != ordersOptions.dateTo) {
        ordersOptions.dateTo = dateOrderEnd.value;
    }

    if (statusOrder.value != ordersOptions.orderStatus) {
        ordersOptions.orderStatus = statusOrder.value.reduce((acc, el) => acc + el.code + ',', '');
    }
}
const statuses = ref([
    { name: 'Заказ обрабатывается', code: '1' },
    { name: 'Заказ обработан', code: '2' },
    { name: 'Не хватило товара для резервирования', code: '3' },
    { name: 'Заказ выполнен', code: '4' },
    { name: 'Заказ отменен', code: '5' },
    { name: 'Заказ зарезервирован', code: '6' }
]);
</script>

<template lang="pug">

.search
    form(@:submit.prevent="searchNumOrder").num-order
        FloatLabel.num-order__wrap(variant="in")
            IconField
                InputIcon(class="pi pi-search")
                InputText.num-order__field(id="num_order" v-model="numOrder")

            label(for="num_order") Номер заказа

        Button.num-order__btn(
            type="submit"
            label="Искать"
            icon="pi pi-send"
            :loading="numOrderLoading")

    form(@:submit.prevent="filterOrders").filter-order
        FloatLabel.filter-order__wrap(variant="in")
            IconField
                DatePicker.filter-order__field(
                    id="start_order"
                    v-model="dateOrderStart"
                    showIcon
                    :manualInput="false"
                    :minDate="minDate"
                    :maxDate="maxDate"
                    dateFormat="yy-mm-dd")
            label(for="start_order") Начало периода

        FloatLabel.filter-order__wrap(variant="in")
            IconField
                DatePicker.filter-order__field(
                    id="end_order"
                    v-model="dateOrderEnd"
                    showIcon
                    :manualInput="false"
                    :minDate="minDate"
                    :maxDate="maxDate"
                    dateFormat="yy-mm-dd")
            label(for="end_order") Конец периода

        FloatLabel.filter-order__wrap(variant="in")
            MultiSelect.filter-order__field(
                id="status_order"
                v-model="statusOrder"
                :options="statuses"
                optionLabel="name"
                filter
                variant="filled")
            label(for="status_order") Статус заказа

        Button.filter-order__btn(
            type="submit"
            label="Искать"
            icon="pi pi-send"
            :loading="filterLoading")

DataTable.list-orders(
    resizableColumns
    stripedRows
    :value="data?.orders"
    :lazy="false"
    :loading="isFetching"
    v-model:selection="selectedOrder"
    selectionMode="single"
    @rowSelect="onRowSelect"
    @rowUnselect="onRowSelect"
    paginator
    :rows="5"
    :rowsPerPageOptions="[5, 10, 20, 50]")

    template(#header)
        h5 Найдено {{ data?.orders?.length }} заказов

    Column(
        v-for="col of columns"
        :key="col.field"
        :field="col.field"
        :header="col.header"
        :expander="col.expander")

        template(
            #body="slotProps"
            v-if="col.field === 'status.title'")

            Tag(
                :value="slotProps.data.status.title"
                class="tag"
                :class="getSeverity(slotProps.data.status.title)")

    template(#empty)
        h5 Данных нет

DynamicDialog(data)
</template>

<style setup lang="scss">
.search {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;

    .num-order,
    .filter-order {
        display: flex;
        align-items: center;
        flex-direction: column;
        margin: 20px;
        padding: 20px;
        background: aliceblue;

        &__wrap {
            margin-bottom: 20px;
        }
        &__btn {
            min-width: 140px;
            height: 52px;
        }
        &__field {
            width: 245px;
        }
    }
}

.list-orders {
    margin: 20px;
}

.tag.tag-success {
    background-color: #4dcd79;
    color: #15803d;
}
.tag.tag-reserved {
    background-color: #dcfce7;
    color: #15803d;
}
.tag.tag-warn {
    background-color: #fee2e2;
    color: #b91c1c;
}
.tag.tag-neutral {
    background-color: #f1f5f9;
    color: #334155;
}


</style>
