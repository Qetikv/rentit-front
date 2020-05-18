<template>
  <section>
    <b-tabs type="is-toggle" expanded v-model="activeTab">
      <b-tab-item label="Available Plants">
        <catalog-query @selectPlant="setPlant"></catalog-query>
      </b-tab-item>
      <!-- <b-tab-item label="Select plant">
            <query-result :plants="plants" @selectPlant="handlePlantSelection">
            </query-result>
      </b-tab-item>-->
      <b-tab-item label="Purchase Plant">
        <order-data v-bind:plantId="selectedPlantId"></order-data>
      </b-tab-item>
      <b-tab-item label="Maintenance Task" :disabled="plantNotSelected">
        <maintenance-task v-bind:plantId="selectedPlantId" v-if="plantNotSelected == false"></maintenance-task>
      </b-tab-item>
    </b-tabs>
  </section>
</template>

<script>
import CatalogQuery from "./CatalogQuery.vue";
// import QueryResult from "./QueryResult.vue";
import OrderData from "./OrderData.vue";
import MaintenanceTask from "./MaintenanceTask.vue";

// import axios from "axios";

export default {
  name: "OrderCreation",
  components: {
    CatalogQuery,
    // QueryResult,
    OrderData,
    MaintenanceTask
  },
  data: function() {
    return {
      activeTab: 0,
      plants: [],
      order: {
        plant: {},
        rentalPeriod: {}
      },
    selectedPlantId: null,
    };
  },
  computed: {
    plantNotSelected: function(){
      return this.selectedPlantId == null ? true : false
    }
  },
  methods: {
    setPlant(value){
        this.selectedPlantId = value
    },
  }
};
</script>