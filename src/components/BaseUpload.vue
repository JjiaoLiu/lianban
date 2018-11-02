<template>
  <!--图片上传-->
  <div class="base-upload">
    <label for="upload-btn" style="cursor: pointer;">
      <span v-if="pictureUrl"><img :src="pictureUrl" width="42" height="42"/></span>
      <span v-else class="upload-btn"><img src="../assets/img/icon_add_big.png" height="32" width="32" /></span>
    </label>
    <span class="tip" slot="tip"></span>
    <input type="file" class="file" name="upload-btn" id="upload-btn" style="display: none" ref="file"
           @change="change($event)" :accept="fileType">
    <span v-if="pictureUrl" style="position: absolute;top: -16px;right: -7px;cursor: pointer;height: 14px;" @click="resetImageUrl"><i class="el-icon el-icon-error"></i></span>
  </div>
</template>

<script>
  export default {
    name:"Upload",props:['pictureUrl','fileType'],methods:{
      change($event){
        var reader = new FileReader;
        var width,height;
        reader.onload = function(evt){
          var image = new Image();
          image.onload = function(){
            width = this.width;
            height = this.height;
          };
        };
        let formData = new FormData();
        formData.append('file',$event.srcElement.files[0]);
        this.$axios.post(process.env.API_HOST[3] + '/upload/image',formData).then(res => {
          if(res.data.success === true){
            this.$emit('update:pictureUrl',res.data.result)
          }else{
            this.$message.warning(res.data.msg)
          }
        })
      },resetImageUrl(){
        this.$emit('update:pictureUrl','');
      }
    }
  }
</script>

<style scoped lang="scss">
  .base-upload {
    width: 44px;
    height: 44px;
    border: 1px solid #d6d6d6;
    display: inline-block;
    position: relative;
    border-radius: 4px;
    background: #cccccc;
  }

  .upload-btn {
    width: 44px;
    height: 44px;
    line-height: 42px;
    text-align: center;
    display: inline-block;
    cursor: pointer;
  }

  img {
    vertical-align: middle;
  }

  .tip {
    color: #88a3b9;
  }

</style>
