<template>
  <div>
    <section>
      <div class="columns">
        <div class="column">
          <b-field label="Start Date *">
            <b-datepicker
              placeholder="Click to select..."
              icon="calendar-today"
              v-model="startDate"
            ></b-datepicker>
          </b-field>
        </div>
        <div class="column">
          <b-field label="End date *">
            <b-datepicker placeholder="Click to select..." icon="calendar-today" v-model="endDate"></b-datepicker>
          </b-field>
        </div>
        <div class="column">
          <b-field label="Description *">
            <b-input v-model="description"></b-input>
          </b-field>
        </div>
        <div class="column">
          <b-field label="Price *">
            <b-input type="number" min="1" max="1000000" v-model="price"></b-input>
          </b-field>
        </div>
        <div class="column">
          <b-field label="Type of work *">
            <b-dropdown aria-role="list" v-model="typeOfWork">
              <button class="button is-primary" slot="trigger" slot-scope="{ active }">
                <span>Type of work</span>
                <b-icon :icon="active ? 'menu-up' : 'menu-down'"></b-icon>
              </button>
              <b-dropdown-item aria-role="listitem" value="PREVENTIVE">Preventive</b-dropdown-item>
              <b-dropdown-item aria-role="listitem" value="CORRECTIVE">Corrective</b-dropdown-item>
              <b-dropdown-item aria-role="listitem" value="OPERATIVE">Operative</b-dropdown-item>
            </b-dropdown>
          </b-field>
        </div>
        <div class="column" style="display: flex;align-items: flex-end;">
          <button
            class="button is-primary"
            v-on:click="submitMTPlan"
            :disabled="!plantId"
          >Create Maintainance Plan</button>
        </div>
      </div>
    </section>
    <table class="table is-table-bordered is-table-striped is-fullwidth">
      <thead>
        <tr>
          <th class="has-text-center">Description</th>
          <th class="has-text-center">Start Date</th>
          <th class="has-text-center">End Date</th>
          <th class="has-text-center">Price</th>
          <th class="has-text-center">Type Of Work</th>
          <th class="has-text-center">Actions</th>
        </tr>
      </thead>
      <tbody v-if="tasks">
        <tr v-for="task in tasks" :key="task._id">
          <td>{{task.maintenancePeriod.startDate}}</td>
          <td>{{task.maintenancePeriod.endDate}}</td>
          <td>{{task.description}}</td>
          <td>{{task.price}}</td> 
          <td>{{task.type_of_work}}</td>
        </tr>
      </tbody> 
      <p v-else>No Plan</p>
    </table>
  </div>
</template>
<script>
export default {
  name: "MaintenanceTask",
  props: ["plantId"],
  data: function() {
    return {
      startDate: undefined,
      endDate: undefined,
      typeOfWork: "",
      price: "",
      description: "",
      availablePlatnts: [],
      tasks: []
    };
  },
  methods: {
    sendPOrequest(url) {
      this.$api
        .patch(`${url}/`)
        .then(data => {
          console.log(data);
          this.getOrders();
        })
        .catch(error => {
          console.log(error.message);
        });
    },
    validate() {
      const today = new Date();
      if (
        this.startDate == null ||
        this.endDate == null ||
        this.description == null ||
        this.price == null ||
        this.typeOfWork == null
      )
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
    generateBody() {
      const body = {
        description: this.description,
        type_of_work: this.typeOfWork,
        price: this.price,
        maintenancePeriod: {
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
    submitMTPlan: function() {
      if (this.validate()) {
        this.$api
          .post(`/inventory/maintenance/plans/${this.plantId}/tasks`, this.generateBody())
          .then(data => {
            console.log(data);
            this.getTasks();
          })
          .catch(error => {
            this.$buefy.snackbar.open({
              type: "is-danger",
              message: error.response.data.message
            });
          });
      }
    },
    getTasks() {
      this.$api
        .get(`/inventory/${this.plantId}/maintenance/plans/`)
        .then(data => {
            this.tasks = data.data[0].tasks;
        })
        .catch(error => {
          console.log(error.message);
        });
    }
  },
  mounted() {
    this.getTasks();
  }
};
</script>
<style>
</style>



