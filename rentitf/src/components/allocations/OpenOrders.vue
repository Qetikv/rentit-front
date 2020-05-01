<!-- eslint-disable vue/no-use-v-if-with-v-for,vue/no-confusing-v-for-v-if -->
<template>
    <div>
    <table class="table is-striped is-fullwidth">
        <thead>
            <tr>
                <th class="has-text-center">Plant</th>
                <th class="has-text-center">Rental period</th>
                <th class="has-text-center">Price</th>
                <th class="has-text-center">Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(order, order_index) in orders" :key="order_index">
                <td>
                    {{order.plant.name}} <br/>
                    <a class="button is-link is-small is-outlined"
                        @click="plantModal(order.plant)">
                        See details
                    </a>
                </td>
                <td>{{order.rentalPeriod.startDate}} / {{order.rentalPeriod.endDate}}</td>
                <td class="has-text-right"></td>
                <td>
                <a v-for="(link, rel) in order._links" :key="rel"  v-if="rel !== 'self' && rel !== 'fetch'"
                    v-bind:class="{ 'is-danger': link.type === 'DELETE', 'is-link': link.type !== 'DELETE' }"
                    class="button is-small is-outlined"
                    @click="followLink(link, rel, order_index)">
                    {{rel}}
                </a>                    
                </td>
            </tr>
        </tbody>
    </table>
    </div>
</template>

<script>
import axios from "axios";
import Vue from "vue";
import PlantModal from "./PlantModal.vue";
import Generic from "./Generic.vue";

export default {
    name: "OpenOrders",
    data: function() {
        return {
            orders: []
        }
    },
    mounted: function() {
        axios.get("http://localhost:8090/api/sales/orders")
        .then(response => {
            this.orders = !response.data._embedded ? [] : response.data._embedded.purchaseOrderDToes;
        });
    },
    methods:{
        plantModal: function(plant) {
            this.$buefy.modal.open({
                parent: this,
                component: PlantModal,
                props: { plant: plant }
            });
        },
        followLink: function(link, rel, order_index) {
            if (link.type) {
                axios({
                    method: link.type,
                    url: link.href
                }).then(response => {
                    Vue.set(this.orders, order_index, response.data);
                }).catch(error => console.log(error));
            } else {
                axios.get(link.href)
                .then(response => {
                    let collection = [];
                    if (response.data._embedded && response.data._embedded.purchaseOrderDToes)
                        collection = response.data._embedded.purchaseOrderDToes;
                    this.$buefy.modal.open({
                        parent: this,
                        component: Generic,
                        props: {
                            title: rel,
                            collection: collection,
                            template: response.data._templates.default,
                            url: response.data._links.self.href
                        }
                    });
                })
                .catch(error => console.log(error));
                }
            }
        }
    }
</script>