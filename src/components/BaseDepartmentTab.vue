<template>
  <!--部门-角色-tab-->
  <el-tabs v-model="activeTabMini" class="tab mini">
    <el-tab-pane v-for="(dept,index) in dept_list"
                 :name="dept.departmentValue"
                 :label="dept.departmentValue"
                 :key="index">
      <el-form-item label="">
        <el-checkbox-group :value="list">
          <el-checkbox :label="role.roleId_sc" name="role" :key="index" @change="change(role.roleId_sc)"
                       v-if="role.departmentId_sc === dept.id_sc || !dept.id_sc"
                       v-for="(role,index) in  roleList_sc">
            {{role.roleName}}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  export default {
    name: "BaseDepartmentTab",
    props: ['list_sc'],
    data() {
      return {
        activeTabMini: '全部',
        dept_list: [],  // 所有部门,
        roleList_sc: [],  // 所有岗位
        list: []
      }
    },
    created() {
      this.getDept(true)
    },
    methods: {
      getDept(role) {
        this.$axios.get(process.env.API_HOST[0] + '/dept/list', {
          params: {
            role: role
          }
        }).then(res => {
          if (res.data.success === true) {
            let list_sc_all = {
              departmentValue: '全部',
            };
            res.data.list_sc.unshift(list_sc_all);
            this.dept_list = res.data.list_sc;
            this.roleList_sc = res.data.roleList_sc;
          }else {
            this.$message.warning(res.data.msg)
          }
        })
      },
      change(val) {
        if (this.list.includes(val)) {
          var index = this.list.indexOf(val);
          this.list.splice(index, 1);
          this.$emit('update:list_sc', this.list)
        } else {
          this.list.push(val);
          this.$emit('update:list_sc', this.list)
        }
      }
    },
    watch: {
      list_sc: {
        handler(N, O) {
          this.list = Object.assign([], this.list_sc);
        },
        immediate: true
      }
    }
  }
</script>

<style scoped>

</style>
