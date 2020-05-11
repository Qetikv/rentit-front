<template>
  <div>
    <section>
      <div class="columns">
        <div class="column">
          <b-field label="Customer Email">
            <b-input v-model="customerEmail"></b-input>
          </b-field>
        </div>
        <div class="column">
          <b-field label="Site address">
            <b-input v-model="siteAddress"></b-input>
          </b-field>
        </div>
        <div class="column" style="display: flex;align-items: flex-end;">
          <button
            class="button is-primary"
            v-on:click="submitPO"
            :disabled="!plantId"
          >Create Purchase Order</button>
        </div>
        <div class="column" style="display: flex;align-items: flex-end;color:red">
          <p v-if="plantId!=null">Plant selected</p>
          <p v-else>Select Plant from the availbale plants list</p>
        </div>
      </div>
    </section>
    <table class="table is-table-bordered is-table-striped is-fullwidth">
      <thead>
        <tr>
          <th class="has-text-center">Name</th>
          <th class="has-text-center">Start Date</th>
          <th class="has-text-center">End Date</th>
          <th class="has-text-center">Price</th>
          <th class="has-text-center">Subtotal</th>
          <th class="has-text-center">Actions</th>
        </tr>
      </thead>
      <tbody v-if="orders">
        <tr v-for="order in orders" :key="order._id">
          <td>{{order.plant.name}}</td>
          <td>{{order.rentalPeriod.startDate}}</td>
          <td>{{order.rentalPeriod.endDate}}</td>
          <td class="has-text-right">{{order.plant.price}}</td>
          <td class="has-text-right">{{order.total}}</td>
          <a :to="order._links.cancel.href" class="button is-danger is-outlined">Remove</a>
        </tr>
      </tbody>
      <p v-else>No Order</p>
    </table>
  </div>
</template>
<script>
export default {
  name: "OrderData",
  props: ["plantId"],
  data: function() {
    return {
      selectedPlant: "",
      customerEmail: "",
      siteAddress: "",
      startDate: undefined,
      endDate: undefined,
      availablePlatnts: [],
      orders: []
    };
  },

  methods: {
    submitPO: function() {
      let body = {
        plant: {
          _id: this.selectedPlant
        },
        nameOfConstructionSite: this.customerEmail,
        rentalPeriod: {
          startDate: this.startDate.toLocaleDateString("lt-LT", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
          }),
          endDate: this.endDate.toLocaleDateString("lt-LT", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
          })
        }
      };

      this.$api
        .post("sales/orders", body)
        .then(data => {
          console.log(data);
        })
        .catch(error => {
          console.log(error.message);
          this.$buefy.snackbar.open({
            type: "is-danger",
            message: "Something went wrong with purchase order submition."
          });
        });
    },
    getOrders() {
      this.$api
        .get(`sales/orders`)
        .then(data => {
          this.orders = data.data;
          console.log(this.orders);
        })
        .catch(error => {
          console.log(error.message);
        });
    }
  },
  mounted() {
    this.getOrders();
  }
};
</script>