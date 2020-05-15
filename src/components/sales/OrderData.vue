<template>
  <div>
    <section>
      <div class="columns">
        <div class="column">
          <b-field label="Start date *">
            <b-datepicker
              placeholder="Click to select..."
              icon="calendar-today"
              v-model.lazy="startDate"
            ></b-datepicker>
          </b-field>
        </div>
        <div class="column">
          <b-field label="End date *">
            <b-datepicker
              placeholder="Click to select..."
              icon="calendar-today"
              v-model.lazy="endDate"
            ></b-datepicker>
          </b-field>
        </div>
        <div class="column">
          <b-field label="Customer Email *">
            <b-input v-model="customerEmail"></b-input>
          </b-field>
        </div>
        <div class="column">
          <b-field label="Site address *">
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
<!-- accept reject cancel
 if accept 
   dispatch cancel
   if dispatch
     deliver refuse
       if deliver 
         return -->
    <table class="table is-table-bordered is-table-striped is-fullwidth">
      <thead>
        <tr>
          <th class="has-text-center">Name</th>
          <th class="has-text-center">Start Date</th>
          <th class="has-text-center">End Date</th>
          <th class="has-text-center">Status</th>
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
          <td>{{order.status}}</td>
          <td>{{order.plant.price}}</td>
          <td>{{order.total}}</td>
          <td>
            <router-link class="button is-success is-outlined" :to="`/edit-order/${order._id}`" >Edit</router-link>
            <button v-if="order._links.accept" v-on:click="sendPOrequest(order._links.accept.href)" class="button is-success is-outlined" >Accept</button>
            <button v-if="order._links.cancel" v-on:click="sendPOrequest(order._links.cancel.href)" class="button is-warnign is-outlined">Cancel</button>
            <button v-if="order._links.reject" v-on:click="sendPOrequest(order._links.reject.href)" class="button is-danger is-outlined">Reject</button>
            <button v-if="order._links.dispatch" v-on:click="sendPOrequest(order._links.reject.href)" class="button is-warnign is-outlined">Dispatch</button>
            <button v-if="order._links.refuse" v-on:click="sendPOrequest(order._links.reject.href)" class="button is-warnign is-outlined">Refuse</button>
            <button v-if="order._links.deliver" v-on:click="sendPOrequest(order._links.reject.href)" class="button is-warnign is-outlined">Deliver</button>
          </td>
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
      customerEmail: "",
      siteAddress: "",
      startDate: undefined,
      endDate: undefined,
      availablePlatnts: [],
      orders: [],  
    };
  },
  methods: {
    sendPOrequest(url){
      this.$api
        .patch(`${url}/`)
        .then((data) => {
          console.log(data);
          this.getOrders()
        })
        .catch(error => {
          console.log(error.message);
        });     
    },
    validatePO() {
      const today = new Date()
      if (this.startDate == null || this.endDate == null || this.customerEmail == null || this.siteAddress == null)
            this.$buefy.snackbar.open({
                type: "is-danger",
                message: "Fill the stared inputs!"
            });
        else if(this.startDate > this.endDate )    
            this.$buefy.snackbar.open({
                type: "is-danger",
                message: "Start should be greater!"
            });
        else if(this.startDate < today || this.endDate < today)
            this.$buefy.snackbar.open({
                type: "is-danger",
                message: "Dates should be greater than today!"
            });
        else return true;
    },
    generatePOBody() {
      const body = {
        plant: {
          _id: this.plantId
        },
        nameOfConstructionSite: this.siteAddress,
        contactEmail: this.customerEmail,
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
      return body;
    },
    submitPO: function() {
      if (this.validatePO()) {
        this.$api
          .post("sales/orders/", this.generatePOBody())
          .then(data => { 
            console.log(data);
            this.getOrders()
          })
          .catch(error => {
            this.$buefy.snackbar.open({
              type: "is-danger",
              message: error.response.data.message
            });
          });
      }
    },
    getOrders() {
      this.$api
        .get(`sales/orders/`)
        .then(data => {
          this.orders = data.data;
          console.log(data.data);
          
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
<style>

</style>



