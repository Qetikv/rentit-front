<template>
  <section>
    <div class="columns">
      <div class="column">
        <b-field label="Plant Name">
          <b-input v-model.lazy="plantName"></b-input>
        </b-field>
      </div>
      <div class="column">
        <b-field label="Start date">
          <b-datepicker
            placeholder="Click to select..."
            icon="calendar-today"
            v-model.lazy="startDate"
          ></b-datepicker>
        </b-field>
      </div>
      <div class="column">
        <b-field label="End date">
          <b-datepicker
            placeholder="Click to select..."
            icon="calendar-today"
            v-model.lazy="endDate"
          ></b-datepicker>
        </b-field>
      </div>
      <div class="column">
        <button class="button is-primary" @click="clear">Clear</button>
      </div>
    </div>
    <div>
      <button style="float:left" class="button field is-danger" @click="selected = null" :disabled="!selected">
        <b-icon icon="close"></b-icon>
        <span>Clear selected</span>
      </button>
        <b-table :data="availablePlatnts" :columns="columns" :selected.sync="selected" focusable></b-table>
    </div>
  </section>
</template>

<script>
export default {
  name: "CatalogQuery",
  data: function() {
    return {
      plantName: "",
      startDate: null,
      endDate: null,
      availablePlatnts: [],
      selected: null,
      columns: [
        {
          field: "_id",
          label: "ID",
          width: "40",
          numeric: true
        },
        {
          field: "name",
          label: "Name"
        },
        {
          field: "description",
          label: "description"
        },
        {
          field: "price",
          label: "Price",
          centered: true
        },
      ]
    };
  },
  watch: {
    plantName: function() {
      this.getPlants();
      this.selected=null;
    },
    startDate: function() {
      this.getPlants();
      this.selected=null;
    },
    endDate: function() {
      this.getPlants();
      this.selected=null;
    },
    selected: function(){
        this.$emit("selectPlant", (this.selected != null ? this.selected._id : null));
    }
  },
  methods: {
    clear(){
      this.plantName = ""
      this.startDate = null
      this.endDate = null
    },
    getPlants() {
      const start = this.formatDate(this.startDate);
      const end = this.formatDate(this.endDate);
      this.$api
        .get(
          `inventory/plants?name=${this.plantName}&startDate=${start}&endDate=${end}`
        )
        .then(data => {
          this.availablePlatnts = data.data;
        });
    },
    formatDate(date) {
      if (date != null) {
        const d = new Date(date);
        const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
        const mo = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(
          d
        );
        const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
        return `${ye}-${mo}-${da}`;
      } else return "";
    }
  },
  mounted() {
    this.getPlants();
  }
};
</script>