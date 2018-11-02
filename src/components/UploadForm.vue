<template>
  <div class="base-upload" :class="size">
    <el-form :inline="true" :model="uploadForm" ref="uploadForm" :disabled="disabled">
      <div v-for="(image,index) in uploadForm.list_sc" :index="index" class="label">
        <div style="position: relative">
          <a v-if="download" :href="image.fileUrl" :download="image.fileName" target="_blank">
            <img :src="image.fileUrl" alt="点击下载">
            <em @click.stop.prevent="deleteI(index)" class="delete" v-if="!disabled">×</em>
          </a>
          <a v-if="slider">
            <img :src="image.fileUrl" @click="outerVisible = true">
            <em @click.stop.prevent="deleteI(index)" class="delete" v-if="!disabled">×</em>
          </a>
        </div>
        <el-form-item
          :prop="'list_sc.'+index+'.fileName'"
          :rules="{required: true, message: '图片名称不能为空', trigger: 'blur'}">
          <el-input v-if="!disabled" v-model.trim="image.fileName" style="width: 100%"></el-input>
          <span v-else>{{image.fileName}}</span>
        </el-form-item>
      </div>
      <label for="upload-btn" class="label" style="background: #f0f4fa;" v-if="!disabled">
        <img src="../assets/img/icon_add_big.png" class="icon_add"/><span
        style="line-height: 60px"></span></label>
      <input type="file" class="file" name="upload-btn" id="upload-btn" style="display: none" ref="file"
             @change="change($event)" :accept="fileType">
    </el-form>
    <el-dialog :visible.sync="outerVisible">
      <el-carousel trigger="click">
        <el-carousel-item v-for="(image,index) in uploadForm.list_sc" :key="index">
          <img :src="image.fileUrl" width="100%" height="100%" :alt="image.fileName">
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
  </div>
</template>

<script>
  import {Bus} from "../bus";

  export default {
    name: "UploadForm", data() {
      return {outerVisible: false, uploadForm: {list_sc: []}}
    }, props: {
      size: {type: String}, disabled: {type: Boolean}, companyId_sc: {type: String}, list_sc: {
        type: Array, default() {return []},
      }, fileType: {
        type: String
      }, download: {
        type: String
      }, slider: {
        type: String
      }, emitType: {
        type: String
      }, onType: {
        type: String
      }
    }, created() {
      Bus.$on(this.onType, () => {
        this.$refs['uploadForm'].validate((valid) => {
          if (valid) {
            Bus.$emit(this.emitType, this.uploadForm.list_sc);
          } else {
            return false
          }
        });
      })
    }, methods: {
      change($event) {
        let file = $event.target.files[0];
        if (file.size > 4 * 1024 * 1024) {
          this.$message('上传图片大小不能超过4M');
          return false
        }
        let formData = new FormData();
        formData.append('file', $event.srcElement.files[0]);
        this.$axios.post(process.env.API_HOST[3] + '/upload/image', formData).then(res => {
          if (res.data.success === true) {
            this.uploadForm.list_sc.push({
              fileUrl: res.data.result, fileName: file.name
            });
            this.$emit('update:list_sc', this.uploadForm.list_sc);
          } else {
            this.$message.warning(res.data.msg)
          }
        })
      }, deleteI(index) {
        this.uploadForm.list_sc.splice(index, 1);
      }
    }, watch: {
      list_sc: {
        handler(N, O) {
          if (N) {
            this.uploadForm.list_sc = N
          }
        }
      }
    }, destroy() {
      Bus.$off(this.onType);
      Bus.$off(this.emitType)
    }
  }
</script>

<style scoped lang="scss">

  .large {
    .label {
      width: 300px;
      margin-right: 20px;
      display: inline-block;
      vertical-align: top;
      img {
        width: 300px;
        height: 180px;
      }
    }
    label.label {
      width: 300px;
      height: 180px;
      img {
        width: 60px;
        margin-top: 60px;
        height: 60px;
      }
    }
  }

  .small {
    .label {
      width: 120px;
      margin-right: 15px;
      display: inline-block;
      vertical-align: top;
      img {
        width: 120px;
        height: 60px;
      }
    }
    label.label {
      width: 120px;
      height: 60px;
      img {
        width: 30px;
        height: 30px;
        margin-top: 15px;
      }
    }
  }

  .label {
    text-align: center;
  }

  .icon_add {
    vertical-align: top;
  }

  .base-upload img {
    cursor: pointer;
    margin-bottom: 10px;
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
