<template>
  <div class="app-container">
    <place-manger v-if="this.$store.state.user.placeId == 1"></place-manger>
    <place v-else></place>
    
  </div>
</template>

<script>
import PlaceManger from "./componments/PlaceManager.vue";
import Place from "./componments/place.vue";
export default {
  components: { PlaceManger,Place },
  data() {
    return {}
  },
  created() {
   
  },
  methods: {
   
  },
};
</script>
