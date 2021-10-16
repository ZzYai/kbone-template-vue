<template>
    <div class="homeMain">
        <homeTabbar @changePage="changePage" />
        <router-view></router-view>
    </div>
</template>

<script>
import homeTabbar from "../../components/homeTabbar.vue"
export default {
    components:{
        homeTabbar
    },
    data(){
        return{
            
        }
    },
    methods:{
        changePage(val){
            switch(val){
                case 1: this.$router.push({
                    path:'/home/homeAddr'
                })
                break;
                case 2: this.$router.push({
                    path:'/home/sayMessage'
                })
                break;
                case 3: this.$router.push({
                    path:'/home/bussinessList'
                })
                break;
                case 4: this.$router.push({
                    path:'/home/mine'
                })
                break;
                case 5: this.$router.push({
                    path:'/home/industryChain'
                })
                break;
            }
            this.$store.commit("pageActive/setPageActive",val)
        }
    }
}
</script>

<style scoped>
    .homeMain{
        height: 100%;
        width: 100%;
        /* overflow: hidden; */
    }
</style>