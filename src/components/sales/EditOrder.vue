<template>
  <section>
    <h1>Selected Plant: {{plant.name}}</h1>
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
        <b-field label="Customer Email">
          <b-input v-model="customerEmail" disabled></b-input>
        </b-field>
      </div>
      <div class="column">
        <b-field label="Site address">
          <b-input v-model="siteAddress" disabled></b-input>
        </b-field>
      </div>
      <div class="column" style="display: flex;align-items: flex-end;">
        <button class="button is-primary" v-on:click="submitPO">Extend Purchase Order</button>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  name: "EditData",
  data: function() {
    return {
      customerEmail: "",
      siteAddress: "",
      startDate: undefined,
      endDate: undefined,
      plant: {}
    };
  },
  methods: {
    validatePO() {
      const today = new Date();
      if (this.startDate == null || this.endDate == null)
        this.$buefy.snackbar.open({
          type: "is-danger",
          message: "Fill the stared inputs!"
        });
      else if (this.startDate > this.endDate)
        this.$buefy.snackbar.open({
          type: "is-danger",
          message: "Start should be greater!"
        });
      else if (this.startDate < today || this.endDate < today)
        this.$buefy.snackbar.open({
          type: "is-danger",
          message: "Dates should be greater than today!"
        });
      else return true;
    },
    generatePOBody() {
      const body = {
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
      };
      return body;
    },
    getOrder() {
      this.$api
        .get(`/sales/orders/${this.$route.params.id}/`)
        .then(data => {
          const order = data.data;
          this.customerEmail = order.contactEmail;
          this.siteAddress = order.nameOfConstructionSite;
          this.startDate = new Date(order.rentalPeriod.startDate);
          this.endDate = new Date(order.rentalPeriod.endDate);
          this.plant = order.plant;
        })
        .catch(error => {
          console.log(error.message);
        });
    },
    submitPO() {
      if (this.validatePO()) {
        this.$api
          .patch(
            `sales/orders/${this.$route.params.id}/extend`,
            this.generatePOBody()
          )
          .then(data => {
            console.log(data);
              this.$router.push('/')
          })
          .catch(error => {
            this.$buefy.snackbar.open({
              type: "is-danger",
              message: error.response.data.message
            });
          });
      }
    }
  },
  mounted() {
    this.getOrder();
  }
};
</script>