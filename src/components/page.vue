<template>
    <div class="page" :style="{justifyContent:pageMode}">
        <div class="pageDiv">
            <button class="whiteBtn longBtn"  @click="pageChange(n-1)">上一页</button>
            <button  v-for="n in nums" :key="n.id"
                    :class="page==n?'redBtn' :'whiteBtn'"
                    @click="pageChange(n)">{{n}}
            </button>
            <i class="el-icon-more"></i>
            <Icon name="ellipsis" class="ellipsis"/>
            <button class="whiteBtn"  @click="pageChange(pageNum)">{{pageNum}}</button>
            <button class="whiteBtn longBtn"  @click="pageChange(n+1)">下一页</button>
            <span>跳转到</span>
            <input ref="input" type="text" @keyup="keyup" v-model="pageInput">
            <span>页</span>
            <button class="redBtn longBtn" @click="pageChange(pageInput)">跳转</button>
        </div>
        
    </div>
</template>

<script>
import { Icon } from 'vant';
export default {
    components:{
        Icon
    },
    props:{
        page:{
            type:Number,
            default:1
        },
        pageSize:{
            type:Number,
            default:1
        },
        total:{
            type:Number,
            default:0
        },
        pageCount:{
            type:Number,
            default:5
        },
        pageMode:{
            type:String,
            default:'center'
        }
    },
    computed:{
        pageNum(){
            return Math.ceil(this.total/this.pageSize)
        },
        minNum(){
            let a = this.page-Math.floor(this.pageCount/2)
            if(a<1){
                a=1
            }
            return a
        },
        maxNum(){
            let a = this.minNum+this.pageCount-1
            if(a>this.pageNum){
                a = this.pageNum
            }
            return a
        },
        nums(){
            let a = []
            for(let i=this.minNum;i<=this.maxNum;i++){
                a.push(i)
            }
            return a
        }
    },
    data(){
        return{
            // 跳转到
            pageInput:null
        }
    },
    methods:{
        keyup(){
            this.$refs.input.blur()
        },
        pageChange(val){
            if(val==this.page){
                return
            }
            if(val>this.pageNum){
                val = this.pageNum
            }
            if(val<1){
                val = 1
            }
            this.$emit("pageChange",val)
        }
    }
}
</script>

<style scoped>
.page{
    width:100%;
    display: flex;
    align-items: center;
    /* border:1px solid red; */
}
.pageDiv{
    display: flex;
    align-items: center;
    /* border:1px solid blue; */
}
.pageDiv button{
    height: 40px;
    margin-right: 10px;
    font-size: 22px;
}
.pageDiv .whiteBtn,
.pageDiv .redBtn{
    width:40px;
}
.pageDiv .longBtn{
    width:80px ;
}
.pageDiv input{
    width:40px;
    height: 40px;
    text-align: center;
    border:1px solid #CACACA;
    border-radius: 5px;
    margin-right:10px;
    font-size: 22px;
}
.pageDiv span{
    margin-right: 10px;
}
.ellipsis{
    margin-right: 10px;
}
</style>