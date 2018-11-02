<template>
  <!--活动-->
  <div>
    <div class="base-upload">
      <div v-for="(image,index) in imageList_sc" :index="index" class="label" v-if="!image.isDel">
        <div>
          <img :src="image" width="100%" height="100%" @click="outerVisible = true">
          <em @click="deleteI(index)" class="delete">×</em>
        </div>
      </div>
      <label for="upload-btn" class="label">
        <img src="../assets/img/icon_add_big.png" class="icon_add" width="22" height="22"/><span style="line-height: 60px"></span></label>
      <input type="file" class="file" name="upload-btn" id="upload-btn" style="display: none" ref="file"
             @change="change($event)" :accept="fileType">
    </div>
    <el-dialog :visible.sync="outerVisible">
      <el-carousel trigger="click">
        <el-carousel-item v-for="(image,index) in imageList_sc" :key="index" v-if="!image.isDel">
          <img :src="image" width="100%" height="100%">
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "UploadGroup", props: ['imageList_sc', 'fileType'], data() {
      return {outerVisible: false}
    }, methods: {
      change($event) {
        let file = $event.target.files[0];
        if (file.size > 2 * 1024 * 1024) {
          this.$message('上传图片大小不能超过2M');
          return false
        }
        let formData = new FormData();
        formData.append('file', $event.srcElement.files[0]);
        this.$axios.post(process.env.API_HOST[3] + '/upload/image', formData).then(res => {
          if (res.status === 200 && res.data.success === true) {
            this.imageList_sc.push(res.data.result);
            this.$emit('update:imageList_sc', this.imageList_sc)
          } else {
            this.$message.warning(res.data.msg)
          }
        })
      }, deleteI(index) {
        this.imageList_sc.splice(index, 1);
        this.$emit('update:imageList_sc', this.imageList_sc)
      }
    },
  }
</script>

<style scoped lang="scss">
  @import "./../assets/mixin/all";

  .base-upload {
    @include use-flex(center, flex-start)
  }

  .label {
    width: 60px;
    cursor: pointer;
    height: 60px;
    margin-right: 20px;
    text-align: center;
    border: 1px solid #e6e6e6;
    border-radius: 4px;
    background: #f0f4fa;
    position: relative;
  }

  .base-upload img {
    width: 60px;
    cursor: pointer;
    height: 60px;
  }

  .icon_add {
    vertical-align: middle;
  }

  .delete {
    width: 16px;
    height: 16px;
    position: absolute;
    background: #88a3b9;
    border-radius: 8px;
    line-height: 16px;
    text-align: left;
    padding: 1px 3px;
    font-size: 16px;
    right: -8px;
    top: -8px;
    color: #ffffff;
    cursor: pointer;
  }
</style>
