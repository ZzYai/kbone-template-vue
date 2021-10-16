<template>
  <div class="filterBtn">
    <template v-if="typeWhich == 3">
      <button
        class="whiteBtn"
        :class="{ onthis: item.name == iswho }"
        v-for="(item, index) in buttonList1"
        :key="index"
        @click="outward(item.name, typeWhich)"
      >
        {{ item.name }}
      </button>
    </template>
    <template v-if="typeWhich == 1">
      <button
        class="whiteBtn"
        :class="{ onthis: item.name == iswho }"
        v-for="(item, index) in buttonList2"
        :key="index"
        @click="outward(item.name, typeWhich)"
      >
        {{ item.name }}
      </button>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    buttonList1: {
      type: Array,
      default: () => []
    },
    buttonList2: {
      type: Array,
      default: () => []
    },
    typeWhich: {
      type: Number,
      // default : ()=>[]
    }
  },
  watch: {
    buttonList1(val) {
      this.iswho = val[0].name;
      this.$emit('imgbut1getdata', 0, 3);
    },
    buttonList2(val) {
      this.iswho = val[0].name;
      this.$emit('imgbut1getdata', 0, 1);
    }
  },
  data() {
    return {
      iswho: ''
    }
  },
  mounted() {
  },
  methods: {
    outward(val, val2) {
      this.iswho = val;
      this.$emit('imgbut1getdata', val=="全部"?0:val, val2);
    }
  }
}
</script>

<style scoped>
.filterBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 15px 0;

}
.filterBtn button {
  width: 95px;
  height: 45px;
  margin-left: 10px;
  font-size: 26px;
  outline: none;
}
.filterBtn button.onthis {
  color: azure;
  background: #ff4855;
  border: none;
}
</style>