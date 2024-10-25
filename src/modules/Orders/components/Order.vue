<script setup>
import {ref, inject, onMounted} from 'vue'

const dialogRef = inject('dialogRef');

const dataOrder = ref();

onMounted(() => dataOrder.value = [dialogRef.value.data.order]);

const columns = ref([
    { field: 'order.id', header: 'ID', expander: false },
    { field: 'order.uid1c', header: 'Номер заказа' },
    { field: 'order.created', header: 'Дата создания заказа' },
    { field: 'order.status.title', header: 'Статус заказа' },
    { field: 'order.client.firstname', header: 'ФИО клиента' },
    { field: 'order.client.phone', header: 'Тел. клиента' },
    { field: 'order.shop.title', header: 'Магазин' },
    { field: 'order.payment.method.title', header: 'Способ оплаты' },
    { field: 'order.payment.status.title', header: 'Статус оплаты' },
    { field: 'items.title', header: 'Наименование товара' },
    { field: 'items.quantity', header: 'Количество' },
    { field: 'items.price', header: 'Цена' },
    { field: 'items.status', header: 'Статус' },
]);

const getClientFullName = (data) => {
    const firstName = data.order.client.firstname;
    const lastName = data.order.client.lastname;

    return firstName + ' ' + lastName;
}

</script>

<template lang="pug">

DataTable(
    v-if="!dialogRef.data.error"
    resizableColumns
    :value="dataOrder")

    Column(
        v-for="col of columns"
        :key="col.field"
        :field="col.field"
        :header="col.header"
        :expander="col.expander")

        template(
            #body="slotProps"
            v-if="col.field === 'items.title'") {{ dataOrder[0].order.items[0].title }}
        template(
            #body="slotProps"
            v-if="col.field === 'items.quantity'") {{ dataOrder[0].order.items[0].quantity }}
        template(
            #body="slotProps"
            v-if="col.field === 'items.price'") {{ dataOrder[0].order.items[0].price }}
        template(
            #body="slotProps"
            v-if="col.field === 'items.status'") {{ dataOrder[0].order.items[0].status }}
        template(
            #body="slotProps"
            v-if="col.field === 'client.firstname'") {{ getClientFullName(dataOrder[0]) }}

h5.err(v-else) Обратитесь в службу поддержки:
    p {{ dialogRef.data.error }}

</template>

