<template>
	<div>
		<div @click="uploadImg" :style=" 'width:'+ ImgWidth + 'px;height:' + ImgHeight + 'px;border: 1px solid #DCDFE6;line-height:' + ImgHeight + 'px;text-align: center;' ">
			<span style="font-size:30px;color:#DCDFE6;" v-if="ImgUrl == ''" >+</span>
			<img :src="ImgUrl" :style=" 'width:'+ ImgWidth +'px;height:'+ ImgHeight +'px;'" v-if="ImgUrl != '' "/>
		</div>
		<input type="file" ref="fileInput"  capture="camera" accept="image/jpg,image/png,image/jpeg,image/gif" @change ="onFileChange" style="display: none;"/>
	</div>
	
</template>

<script>

export default {
	props:{
		ImgUrl : String,
		ImgWidth : { default: 115 },
		ImgHeight : { default: 83 },
	},
  data() {
    return {

    }
  },
  methods: {
  	uploadImg(){
  		this.$refs.fileInput.click();  		
  	},
  	//上传图片
    onFileChange(e){
    	let files = e.target.files || e.dataTransfer.files;
    	var reader = new FileReader();
      reader.readAsDataURL(files[0]); // 读出 base64
      reader.onloadend = () => {
        // 图片的 base64 格式, 可以直接当成 img 的 src 属性值        
        let dataURL = reader.result;//base64       
        this.$emit("listenToChildEvent",dataURL);
      }	
    }
  },
  mounted(){
  	console.log(this.ImgWidth)
  }
}
</script>

<style>
</style>