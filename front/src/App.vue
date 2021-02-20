<template>
  <MinutesWeek msg="Minutes Week" />
  <SearchBox msg="Search Box" />
  <VideoList msg="Video List" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MinutesWeek from "./components/MinutesWeek.vue";
import SearchBox from "./components/SearchBox.vue";
import VideoList from "./components/VideoList.vue";
import { YoutubeDataAPIService } from "./services/YoutubeDataAPIService";

export default defineComponent({
  name: "App",
  components: { MinutesWeek, SearchBox, VideoList },
  mounted() {
    const service = YoutubeDataAPIService();

    const fetchData = async () => {
      const data = await service.searchByTerm("term", "[1,2,3,4,5,6,7]");
      console.log(data);
    };

    fetchData();
  }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
