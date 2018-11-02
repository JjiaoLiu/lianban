<template>
  <div>
    <div class="form-action" v-if="spaceId_sc">
      <el-button plain size="mini" @click="showEquip">管理</el-button>
    </div>
    <div class="action-form">
         <span class="button" v-for="(item,index) in equipListSelect" :key="index">
            {{item.equipName}}
         </span>
    </div>
    <BaseMessageBox title="配件管理" :show.sync="dialogEquip">
      <div style="width: 400px">
        <el-checkbox-group :value="equipId">
          <el-checkbox border v-for="(item,index) in equipList" @change="change(item.equipId_sc)" :key="index"
                       :label="item.equipId_sc" name="equip">
            {{item.equipName}}
          </el-checkbox>
        </el-checkbox-group>
        <div style="text-align: center;margin-top: 30px">
          <el-button type="primary" @click="addEquipToDetail">保 存</el-button>
        </div>
      </div>
    </BaseMessageBox>
  </div>
</template>

<script>
  import BaseMessageBox from './../components/BaseMessageBox'

  export default {
    name: "BaseEquipCheck", props: ['spaceId_sc', 'equipId_scs'], components: {BaseMessageBox}, data() {
      return {
        equipId: [], equipListSelect: [], dialogEquip: false, equipList: []
      }
    }, methods: {
      change(val) {
        if (this.equipId.includes(val)) {
          var index = this.equipId.indexOf(val);
          this.equipId.splice(index, 1);
        } else {
          this.equipId.push(val);
        }
      }, addEquipToDetail() {
        this.$emit('update:equipId_scs', this.equipId);
        this.dialogEquip = false;
      }, showEquip() {
        this.dialogEquip = true;
      }
    }, watch: {
      equipId_scs: {
        handler(N, O) {
          if (N) {
            this.equipId = Object.assign([], this.equipId_scs);
            this.equipListSelect = this.equipList.filter((f, i, fx) => {
              return this.equipId.includes(f.equipId_sc)
            })
          }
        }, immediate: true
      }, spaceId_sc: {
        handler(N, O) {
          if (N) {
            this.$axios.get(process.env.API_HOST[1] + '/comm/mtequiplist', {params: {spaceId_sc: this.spaceId_sc}}).then(res => {
              if (res.data.success === true) {
                if (res.data.list_sc && res.data.list_sc.length) {
                  this.equipList = res.data.list_sc ? res.data.list_sc : [];
                  this.equipListSelect = this.equipList.filter((f, i, fx) => {
                    return this.equipId.includes(f.equipId_sc)
                  })
                } else {
                  this.equipList = []
                }
              }else {
                this.$message.warning(res.data.msg)
              }
            })
          }
        }, immediate: true
      }
    }
  }
</script>

<style scoped>
</style>
