<template>
  <!--编辑和添加-->
  <section>
    <BaseSecHeader :title="title"></BaseSecHeader>
    <el-form :rules="rules" :model="detail" ref="detail" label-width="105px" label-position="left" class="single-form" size="small">
      <el-row :gutter="200">
        <el-col :span="12">
          <el-form-item label="空间名称" prop="spaceName">
            <el-input v-model.trim="detail.spaceName"
                      placeholder="请输入空间名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话" prop="telPhone">
            <el-input v-model.trim="detail.telPhone"
                      placeholder="请输入固机号码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="负责人姓名" prop="dutyUserId_sc">
            <BaseSysUserSelect :user_id.sync="detail.dutyUserId_sc" :user_name.sync="detail.dutyUserName"
                               style="width: 100%"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="移动电话" prop="contactInfo">
            <el-input v-model.trim="detail.contactInfo" placeholder="请输入移动电话"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-col :span="13">
              <el-form-item label="所在城市" prop="cityCode">
                <BaseCitySelect :cityCode.sync="detail.cityCode" style="width: 100%"/>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item prop="districtCode" label-width="10px">
                <BaseDistrictSelect :cityCode="detail.cityCode" :districtCode.sync="detail.districtCode" style="width: 100%"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-form-item label="空间评分" prop="spaceLevel">
            <el-select v-model="detail.spaceLevel" style="width: 100%">
              <el-option :value="item" :label="item/2+'颗星'" v-for="(item,index) in spaceLevel" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="详细地址" prop="address">
            <el-input v-model.trim="detail.address" type="textarea" maxlength="200"
                      placeholder="请输入详细地址，200字以内"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <div style="display: flex;justify-content: flex-start;">
            <el-form-item label="百度坐标" style="display: inline-block" class="is-required"></el-form-item>
            <div style="width: calc(100% - 105px);display: flex;justify-content: space-between">
              <el-form-item label-width="0" prop="baiduLongitude">
                <el-input v-model.number="detail.baiduLongitude" type="number" placeholder="请输入">
                  <template slot="prepend">经度</template>
                </el-input>
              </el-form-item>
              <el-form-item prop="baiduLatitude" label-width="10px">
                <el-input v-model.number="detail.baiduLatitude" type="number" placeholder="请输入">
                  <template slot="prepend">维度</template>
                </el-input>
              </el-form-item>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div style="display: flex;justify-content: flex-start;">
            <el-form-item label="高德坐标" style="display: inline-block" class="is-required"></el-form-item>
            <div style="width: calc(100% - 105px);display: flex;justify-content: space-between">
              <el-form-item label-width="0" prop="gaodeLongitude">
                <el-input v-model.number="detail.gaodeLongitude" type="number" placeholder="请输入">
                  <template slot="prepend">经度</template>
                </el-input>
              </el-form-item>
              <el-form-item prop="gaodeLatitude" label-width="10px">
                <el-input v-model.number="detail.gaodeLatitude" type="number" placeholder="请输入">
                  <template slot="prepend">维度</template>
                </el-input>
              </el-form-item>
            </div>
          </div>
        </el-col>
        <el-col :span="24">
          <el-form-item label="空间简介" prop="remark">
            <el-input v-model.trim="detail.remark" type="textarea" maxlength="200"
                      placeholder="请输入空间简介，200字以内"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="周边交通" prop="traffic">
            <el-input v-model.trim="detail.traffic" type="textarea" maxlength="200"
                      placeholder="请输入周边交通，200字以内"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="楼层添加" style="position: relative" prop="floorList_sc">
            <div class="form-action">
              <el-button plain size="mini" @click="showFloorDl">管理</el-button>
            </div>
            <div class="action-form">
              <span class="button" v-for="(item,index) in detail.floorList_sc" :key="index" v-if="item.isDel !=1">
              {{item.floorName}}<em @click="removeFloor(item)">×</em>
            </span>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="空间设施" style="position: relative" class="is-required">
            <div class="form-action">
              <el-button plain size="mini" @click="showFacility">管理</el-button>
            </div>
            <div class="action-form">
               <span class="button" v-for="(item,index) in facilityListSelectOption" :key="index">
                {{item.name}}
            </span>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="轮播图片上传">
            <BaseUploadGroup :imageList_sc.sync="detail.imageList_sc" fileType="image/jpg;image/bmp,image/png,image/jpeg"/>
          </el-form-item>
        </el-col>
        <el-col :span="24" style="text-align: center">
          <el-button size="medium" @click="solve('detail')" style="width: 160px" type="primary">保存</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-dialog title="添加楼层" :visible.sync="dialogFloor">
      <el-form>
        <el-form-item label="楼层名称">
          <el-input v-model.trim="floorName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addFloorToDetail">保 存</el-button>
      </div>
    </el-dialog>
    <BaseMessageBox title="管理设备" :show.sync="dialogfacility">
      <el-checkbox-group v-model="facilityId" class="checkbox-img" style="width: 700px">
        <el-checkbox v-for="(item,index) in facilityListOption" :key="index"
                     :label="item.val" name="equip">
          <img :src="item.active" class="active" width="48" height="48">
          <img :src="item.inactive" class="inactive" width="48" height="48">
          {{item.name}}
        </el-checkbox>
      </el-checkbox-group>
      <div style="text-align: center;margin-top: 100px">
        <el-button type="primary" @click="addFacilityToDetail">保 存</el-button>
      </div>
    </BaseMessageBox>
  </section>
</template>

<script>
  import {addrMap} from "../assets/js/addr";
  import {facilityListOption} from './../config'

  const addrMapString = JSON.stringify(addrMap);
  import BaseCitySelect from '../components/BaseCitySelect'
  import BaseDistrictSelect from '../components/BaseDistrictSelect'
  import BaseSysUserSelect from './../components/BaseSysUserSelect'
  import BaseSecHeader from './../components/BaseSecHeader'
  import BaseUploadGroup from './../components/BaseUploadGroup'
  import BaseMessageBox from './../components/BaseMessageBox'
  import {checkPhone1,checkPhone2} from './../validator'

  // 创建地址解析器实例
  // var myGeo = new BMap.Geocoder();
  export default {
    name:"operationRoomAdd",components:{BaseDistrictSelect,BaseCitySelect,BaseSecHeader,BaseSysUserSelect,BaseUploadGroup,BaseMessageBox},computed:{
      cityCode(){
        if(this.detail){
          return this.detail.cityCode
        }else{
          return ''
        }
      },districtCode(){
        if(this.detail){
          return this.detail.districtCode
        }else{
          return ''
        }
      },address(){
        if(this.detail){
          return this.detail.address
        }else{
          return ''
        }
      },cityStr(){
        if(this.cityCode){
          return this.filterCode(this.cityCode)
        }else{
          return ''
        }
      },districtStr(){
        if(this.districtCode){
          return this.filterCode(this.districtCode)
        }else{
          return ''
        }
      },facilityListSelectOption(){
        var ro = this.facilityListOption.filter((f,i,fx) => {
          return this.detail.facilityList.includes(f.val)
        });
        return ro
      }
    },created(){
      if(this.$route.query.spaceId_sc){
        this.getDetail();
      }
    },data(){
      return {
        readonly:true,floorName:'',dialogFloor:false,dialogfacility:false,title:'空间',detail:{
          floorList_sc:[],facilityList:[],imageList_sc:[]
        },rules:{
          spaceName:[{required:true,message:'请输入空间名称',trigger:'blur'},],
          telPhone:[{required:true,message:'请输入固机号码',trigger:'blur'},{validator:checkPhone2,trigger:'blur'}],
          dutyUserId_sc:[{required:true,message:'请输入负责人姓名',trigger:'change'},],
          contactInfo:[{required:true,message:'请输入手机号',trigger:'blur'},{validator:checkPhone1,trigger:'blur'}],
          address:[{required:true,message:'请输入详细地址',trigger:'blur'}],
          remark:[{required:true,message:'请输入空间简介',trigger:'blur'}],
          gaodeLongitude:[{type:'number',message:'请输入数字',trigger:'blur'},{required:true,message:'请输入高德坐标经度',trigger:'blur'}],
          gaodeLatitude:[{type:'number',message:'请输入数字',trigger:'blur'},{required:true,message:'请输入高德坐标维度',trigger:'blur'}],
          baiduLongitude:[{type:'number',message:'请输入数字',trigger:'blur'},{required:true,message:'请输入百度坐标经度',trigger:'blur'}],
          baiduLatitude:[{type:'number',message:'请输入数字',trigger:'blur'},{required:true,message:'请输入百度坐标维度',trigger:'blur'}],
          traffic:[{required:true,message:'请输入周边交通',trigger:'blur'}],
          cityCode:[{required:true,message:'请选择城市',trigger:'change'},],
          districtCode:[{required:true,message:'请选择区县',trigger:'change'},],
          spaceLevel:[{required:true,message:'请选择评分',trigger:'change'}],
          floorList_sc:[{required:true,message:'楼层管理未设置',trigger:'change'}],
          facilityList:[{required:true,message:'设备管理未设置',trigger:'change'}]
        },facilityId:[],facilityListOption:facilityListOption,spaceLevel:[2,4,6,8,10,12,14,16,18,20]
      }
    },methods:{
      showFacility(){
        this.facilityId = Object.assign([],this.detail.facilityList);
        this.dialogfacility = true
      },showFloorDl(){
        this.dialogFloor = true
      },solve(formName){
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.$confirm('确认保存？','提示',{
              confirmButtonText:'确定',cancelButtonText:'取消',type:'warning'
            }).then(() => {
              this.$axios.post(process.env.API_HOST[1] + '/space/save',this.detail).then(res => {
                this.$message.success("操作成功");
                this.$router.back()
              });
            }).catch(() => {
              this.$message.info('已取消删除')
            });
          }else{
            return false;
          }
        });
      },addFloorToDetail(){
        if(!this.floorName){
          this.$message.warning("请输入楼层名称");
          return false
        }
        this.detail.floorList_sc.push({'floorName':this.floorName,'isDel':0});
        this.dialogFloor = false;
        this.floorName = ''
      },removeFloor(item){
        this.$confirm('确认要删除?','提示',{
          confirmButtonText:'确定',cancelButtonText:'取消',type:'warning'
        }).then(() => {
          item['isDel'] = 1;
          this.$message.success('删除成功')
        }).catch(() => {
          this.$message.info('已取消删除')
        });
      },addFacilityToDetail(){
        this.detail.facilityList = this.facilityId;
        this.dialogfacility = false;
      },getDetail(){
        this.$axios.get(process.env.API_HOST[1] + '/space/detail',{params:{spaceId_sc:this.$route.query.spaceId_sc}}).then(res => {
          if(res.data.success === true){
            this.detail = res.data;
            setTimeout(() => {
              this.$refs['detail'].clearValidate()
            },0)
          }else{
            this.$message.warning('已取消删除')
          }
        })
      },bd_decrypt(point){
        var X_PI = Math.PI * 3000.0 / 180.0;
        var x = point.lng - 0.0065;
        var y = point.lat - 0.006;
        var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);
        var theta = Math.atan2(y,x) - 0.000003 * Math.cos(x * X_PI);
        var gg_lng = z * Math.cos(theta);
        var gg_lat = z * Math.sin(theta);
        this.$set(this.detail,'gaodeLatitude',gg_lat);
        this.$set(this.detail,'gaodeLongitude',gg_lng);
      },setMap(cityStr,addr){
        var _this = this;
        myGeo.getPoint(addr,function(point){
          if(point){
            _this.$set(_this.detail,'baiduLatitude',point.lat);
            _this.$set(_this.detail,'baiduLongitude',point.lng);
            _this.bd_decrypt(point)
          }else{
            alert("您选择地址没有解析到结果!");
          }
        },cityStr);
      },filterCode(value){
        var pattern = '"code":"' + value + '","region":"[\u4e00-\u9fa5]+"';
        var reg = new RegExp(pattern);
        var result = reg.exec(addrMapString);
        if(result){
          return JSON.parse('{' + result[0] + '}').region
        }
      }
    },watch:{
      // districtStr(N, O) {
      //   if (N != O && N && this.address) {
      //     this.setMap(this.cityStr, this.cityStr + this.districtStr + this.address)
      //   }
      // }, address(N, O) {
      //   if (N != O && N && this.districtStr) {
      //     this.setMap(this.cityStr, this.cityStr + this.districtStr + this.address)
      //   }
      // }
    }
  }
</script>

<style lang="scss" scoped>

</style>
