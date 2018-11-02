<template>
  <section>
    <BaseSecHeader :title="title"></BaseSecHeader>
    <el-form :rules="rules" :model="detail" ref="detail" label-width="105px" label-position="left" class="single-form"
             size="small">
      <el-row :gutter="200">
        <el-col :span="12">
          <el-form-item label="会议室名称" prop="mtRoomName">
            <el-input v-model.trim="detail.mtRoomName"
                      placeholder="请输入会议室名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属空间" prop="spaceId_sc">
            <BaseSpaceRoomSelect :spaceId_sc.sync="detail.spaceId_sc" style="width: 100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所在楼层" prop="floorId_sc">
            <BaseFloorSelect :floorId_sc.sync="detail.floorId_sc" :spaceId_sc="detail.spaceId_sc" style="width: 100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="会议室单价" prop="price">
            <el-input v-model.number="detail.price" min="0" type="number" step="1">
              <template slot="prepend">人民币</template>
              <template slot="append">元/半小时</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="面积大小" prop="acreage">
            <el-input v-model.number="detail.acreage" type="number" min="0" placeholder="请输入面积大小" step="1">
              <template slot="append">平米</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="人数限制" prop="peopleNum">
            <el-input v-model.number="detail.peopleNum" min="0" type="number" placeholder="请输入人数限制" step="1"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="会议室状态" prop="enable">
            <el-radio v-model="detail.enable" :label="1">有效</el-radio>
            <el-radio v-model="detail.enable" :label="0">无效</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="门禁绑定" prop="equipCode">
            <BaseMenjinSelect :spaceId_sc="detail.spaceId_sc"
                              style="width: 100%"
                              :floorId_sc="detail.floorId_sc"
                              :equipCode.sync="detail.equipCode"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单图标" prop="imageUrl">
            <BaseUpload :pictureUrl.sync="detail.imageUrl" fileType="image/jpg;image/bmp,image/png,image/jpeg"></BaseUpload>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="配件管理" style="position: relative">
            <BaseEquipCheck :equipId_scs.sync="detail.equipList_sc" :spaceId_sc="detail.spaceId_sc"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="租赁状态" v-if="detail.leaseList">
            <div class="box-form-item">
              <div v-for="(item,index) in detail.leaseList" :key="index" class="line">
                <p>租赁者账号:{{item.userName}}</p>
                <p>租赁者企业:{{item.companyName}}</p>
                <p>租赁期限:{{item.deadline}}</p>
                <!--"leaseStatus": 0,1-租赁中，0-闲置中 ,-->
              </div>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24" style="text-align: center">
          <el-button size="medium" @click="solve('detail')" style="width: 160px" type="primary">保存</el-button>
        </el-col>
      </el-row>
    </el-form>
  </section>
</template>

<script>
  import BaseSecHeader from './../components/BaseSecHeader'
  import BaseSpaceRoomSelect from './../components/BaseSpaceRoomSelect'
  import BaseFloorSelect from './../components/BaseFloorSelect'
  import BaseEquipCheck from './../components/BaseEquipCheck'
  import BaseMenjinSelect from './../components/BaseMenjinSelect'
  import BaseUpload from './../components/BaseUpload'

  export default {
    name: "roomMeetingAdd",
    components: {BaseSecHeader, BaseSpaceRoomSelect, BaseFloorSelect, BaseEquipCheck, BaseMenjinSelect,BaseUpload},
    created() {
      if (this.$route.query.mtRoomId_sc) {
        this.getDetail();
      }

    },
    data() {
      return {
        dialogEquip: false, title: '会议室', detail: {
          equipList_sc: [], enable: 1
        }, rules: {
          mtRoomName: [{required: true, message: '请输入会议室名称', trigger: 'blur'},],
          acreage: [{type: 'number', message: '请输入数字', trigger: 'blur'}, {
            required: true,
            message: '请输入面积',
            trigger: 'blur'
          },],
          floorId_sc: [{required: true, message: '请选择楼层', trigger: 'change'},],
          peopleNum: [{type: 'number', message: '请输入数字', trigger: 'blur'}, {
            required: true,
            message: '请输入限制人数',
            trigger: 'blur'
          },],
          price: [{type: 'number', message: '请输入数字', trigger: 'blur'}, {
            required: true,
            message: '请输入价格',
            trigger: 'blur'
          }],
          spaceId_sc: [{required: true, message: '请选择空间', trigger: 'change'}],
          equipCode: [{required: true, message: '请选择门禁', trigger: 'change'}],
        }
      }
    },
    computed: {
      spaceId_sc() {
        return this.detail.spaceId_sc
      }, equipListSelect() {
        return this.equipList.filter((f, i, fs) => {
          return this.detail.equipList_sc.includes(f.equipId_sc)
        })
      }
    },
    methods: {
      showEquip() {
        this.dialogEquip = true;
      }, solve(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('确认保存？', '提示', {
              confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
            }).then(() => {
              this.$axios.post(process.env.API_HOST[1] + '/meet/save', this.detail).then(res => {
                if (res.data.success === true) {
                  this.$message.success('保存成功');
                  this.$router.back()
                } else {
                  this.$message.warning(res.data.msg)
                }
              });
            }).catch(() => {
              this.$message.info('已取消操作')
            });
          } else {
            return false;
          }
        });
      }, getDetail() {
        this.$axios.get(process.env.API_HOST[1] + '/meet/detail', {params: {mtRoomId_sc: this.$route.query.mtRoomId_sc}}).then(res => {
          if (res.data.success === true) {
            this.detail = res.data;
            setTimeout(() => {
              this.$refs['detail'].clearValidate()
            }, 0)
          } else {
            this.$message.warning(res.data.msg)
          }
        })
      },
    }
  }
</script>

<style lang="scss" scoped>

</style>
