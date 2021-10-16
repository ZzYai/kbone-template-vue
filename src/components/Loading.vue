<template>
    <Overlay :show="show" @click="show = false">
        <div class="wrapper" @click.stop>
            <Loading type="spinner" color="#1989fa" size="80px"/>
        </div>
    </Overlay>
</template>

<script>
import { Overlay } from 'vant';
import { Loading  } from 'vant';
export default {
    components:{
        Overlay,
        Loading
    },
    data(){
        return{
            show:true
        }
    }
}
</script>

<style scoped>
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width:100%;
  }
</style>