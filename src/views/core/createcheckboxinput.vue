<template>
	<div>
		<div v-for="(scc,index) in options" :key="index" style="display: flex;align-items:center;margin-bottom:10px;">
			<el-input v-model="scc.optionContets" @change="change"></el-input>
			<div style="display: flex;align-items:center;width:70px;margin-left:10px;">
				<el-checkbox v-model="scc.isAnswer" @change="change" style="margin-right:5px;" title="选中代表为正确选项"></el-checkbox>
				<i class="el-icon-plus" style="cursor:pointer;margin-right:5px;" title="点击添加题目选项" @click=ClickAdd(index)></i>
				<i class="el-icon-minus" style="cursor:pointer;" title="点击删除该题目选项" @click=ClickDelete(index) v-if="deleteshow"></i>
			</div>
		</div>		
	</div>
</template>

<script>
export default {
	props: {
    options: {  // 按钮显示文本
      default: []
    }
 	},	
  data() {
    return {
			deleteshow:true
    }    
  },
  methods: {
    ClickAdd(index){
    	let addoption = {
  			isAnswer: false,
				optionContets: "",
				sort: 0
  		};
    	this.options.splice(index+1, 0, addoption);
    	this.$emit('click', this.options);
    },
    ClickDelete(index){
    	this.options.splice(index, 1);
    	this.$emit('click', this.options);
    },
    change(){
    	this.$emit('click', this.options);
    }
  },
  mounted(){
  	if(this.options.length==1){
			this.deleteshow=false;
		}
  },
  watch:{
  	options(){
  		if(this.options.length==1){
  			this.deleteshow=false;
  		}else{
  			this.deleteshow=true;
  		}
  	}
  }
}
</script>

<style>
</style>