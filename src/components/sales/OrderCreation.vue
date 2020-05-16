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
    // plantNotSelected: true
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
    // handleCatalogQuery: function(query) {
    //   if (query.name && query.startDate && query.endDate) {
    //     let params = {
    //       name: query.name,
    //       startDate: query.startDate.toLocaleDateString("lt-LT", {
    //         year: "numeric",
    //         month: "2-digit",
    //         day: "2-digit"
    //       }),
    //       endDate: query.endDate.toLocaleDateString("lt-LT", {
    //         year: "numeric",
    //         month: "2-digit",
    //         day: "2-digit"
    //       })
    //     };
    //     axios
    //       .get("http://localhost:8090/api/sales/plants", { params: params })
    //       .then(response => {
    //         this.activeTab = 1;
    //         this.plants = response.data._embedded.plantInventoryEntryDToes;
    //         this.order.rentalPeriod.startDate = params.startDate;
    //         this.order.rentalPeriod.endDate = params.endDate;
    //       })
    //       .catch(function(error) {
    //         console.log("Error", error.message);
    //         this.activeTab = 1;
    //       });
    //   }
    // },

    // handlePlantSelection: function(plant) {
    //     this.order.plant = plant;
    //     this.activeTab = 2;
    // },
    // handlePOCreation: function() {
    //   let body = {
    //     plant: {
    //       _id: this.order.plant._id,
    //       name: this.order.plant.name,
    //       description: this.order.plant.description,
    //       price: this.order.plant.price
    //     },
    //     rentalPeriod: {
    //       startDate: this.order.rentalPeriod.startDate,
    //       endDate: this.order.rentalPeriod.endDate
    //     },
    //     status: "OPEN"
    //   };
    //   axios
    //     .post("http://localhost:8090/api/sales/orders", body)
    //     .then(response => {
    //       console.log(response.message);
    //       this.$buefy.snackbar.open(
    //         "Purchase order submitted. Waiting for confirmation."
    //       );
    //     })
    //     .catch(error => {
    //       console.log(error.message);
    //       this.$buefy.snackbar.open({
    //         type: "is-danger",
    //         message: "Something went wrong with purchase order submition."
    //       });
    //     });
    // }
  }
};
</script>