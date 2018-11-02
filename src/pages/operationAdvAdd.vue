<template>
  <!--编辑和添加-->
  <section>
    <BaseSecHeader :title="title"></BaseSecHeader>
    <el-form :rules="rules" :model="detail" ref="detail" label-width="105px" label-position="left" class="single-form" size="small">
      <el-row>
        <el-col :span="12">
          <el-row>
            <el-col :span="24">
              <el-form-item label="广告位名称" prop="positionId">
                <el-select v-model="detail.positionId" placeholder="请选择" style="width: 100%">
                  <el-option
                    v-for="item in adpositionlist"
                    :key="item.positionId_sc"
                    :label="item.positionName"
                    :value="item.positionId_sc">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="所属空间" prop="spaceId">
                <BaseSpaceRoomSelect :spaceId_sc.sync="detail.spaceId" style="width: 100%"/>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="广告位链接" prop="adLink">
                <el-input v-model.trim="detail.adLink" placeholder="请输入广告位链接"
                          style="width: 100%"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="排序位" prop="sortNo">
                <el-select v-model="detail.sortNo" placeholder="请选择"
                           style="width: 100%">
                  <el-option
                    v-for="item in 10"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="广告位描述" prop="describle">
                <el-input type="textarea" v-model.trim="detail.describle" placeholder="请输入广告位描述信息，限制字数长度200字"
                          style="width: 100%" maxLength="200"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="图片上传" prop="imageUrl">
                <BaseUpload :pictureUrl.sync="detail.imageUrl" fileType="image/jpg;image/bmp,image/png,image/jpeg">
                  <div name="tip">图标要求：尺寸为40x40px，png格式</div>
                </BaseUpload>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="打开方式" prop="openType">
                <el-radio v-model="detail.openType" :label="1">新窗口</el-radio>
                <el-radio v-model="detail.openType" :label="0">本窗口</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="24" style="text-align: center">
          <el-button size="medium" @click="solve('detail')" style="width: 160px" type="primary">保存</el-button> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <el-button size="medium" @click="$router.back()" style="width: 100px" plain>返回</el-button>
        </el-col>
      </el-row>
    </el-form>
  </section>
</template>

<script>
  import BaseSpaceRoomSelect from './../components/BaseSpaceRoomSelect'
  import BaseSysUserSelect from './../components/BaseSysUserSelect'
  import BaseSecHeader from './../components/BaseSecHeader'
  import BaseUpload from './../components/BaseUpload'

  export default {
    name:"operationAdvAdd",components:{BaseSecHeader,BaseSysUserSelect,BaseSpaceRoomSelect,BaseUpload},created(){
      if(this.$route.query.adId_sc){
        this.getDetail()
      }
      this.getadposition();

    },data(){
      return {
        title:'广告',detail:{
          openType:0
        },adpositionlist:[],rules:{
          positionId:[{required:true,message:'×请选择广告位名称',trigger:'change'},],
          spaceId:[{required:true,message:'×请选择所属空间',trigger:'change'},],
          sortNo:[{required:true,message:'×请选择排序位',trigger:'change'}],
          describle:[{required:true,message:'×请输入广告位描述',trigger:'blur'},{min:1,max:200,message:'长度在 1 到 200 个字符',trigger:'blur'}]
        },
      }
    },methods:{
      solve(formName){
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.$confirm('确认保存？','提示',{
              confirmButtonText:'确定',cancelButtonText:'取消',type:'warning'
            }).then(() => {
              this.$axios.post(process.env.API_HOST[1] + '/ad/save',this.detail).then(res => {
                if(res.data.success === true){
                  this.$message.success("操作成功");
                  this.$router.back()
                }else{
                  this.$message.warning(res.data.msg)
                }
              });
            }).catch(() => {
              this.$message.info('已取消删除');
            });
          }else{
            return false;
          }
        });
      },getDetail(){
        this.$axios.get(process.env.API_HOST[1] + '/ad/detail',{params:{adId_sc:this.$route.query.adId_sc}}).then(res => {
          if(res.data.success === true){
            this.detail = res.data;
            setTimeout(() => {
              this.$refs['detail'].clearValidate()
            },0)
          }else{
            this.$message.warning(res.data.msg)
          }
        })
      }, // GET /comm/adpositionlist
      getadposition(){
        this.$axios.get(process.env.API_HOST[1] + '/comm/adpositionlist').then(res => {
          if(res.data.success === true){
            this.adpositionlist = res.data.list_sc;
          }else{
            this.$message.warning(res.data.msg)
          }
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
</style>
