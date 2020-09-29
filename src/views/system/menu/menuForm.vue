<template>
  <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="580px">
    <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="菜单类型" prop="type">
        <el-radio-group v-model="form.type" size="mini" style="width: 178px">
          <el-radio-button label="0">目录</el-radio-button>
          <el-radio-button label="1">菜单</el-radio-button>
          <el-radio-button label="2">按钮</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="form.type.toString() !== '2'" label="菜单图标" prop="icon">
        <el-popover
          placement="bottom-start"
          width="450"
          trigger="click"
          @show="$refs['iconSelect'].reset()"
        >
          <IconSelect ref="iconSelect" @selected="selected" />
          <el-input slot="reference" v-model="form.icon" style="width: 450px;" placeholder="点击选择图标" readonly>
            <svg-icon v-if="form.icon" slot="prefix" :icon-class="form.icon" class="el-input__icon" style="height: 32px;width: 16px;" />
            <i v-else slot="prefix" class="el-icon-search el-input__icon" />
          </el-input>
        </el-popover>
      </el-form-item>
      <el-form-item v-show="form.type.toString() !== '2'" label="外链菜单" prop="iframe">
        <el-radio-group v-model="form.iframe" size="mini">
          <el-radio-button label="true">是</el-radio-button>
          <el-radio-button label="false">否</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="form.type.toString() === '1'" label="菜单缓存" prop="cache">
        <el-radio-group v-model="form.cache" size="mini">
          <el-radio-button label="true">是</el-radio-button>
          <el-radio-button label="false">否</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="form.type.toString() !== '2'" label="菜单可见" prop="hidden">
        <el-radio-group v-model="form.hidden" size="mini">
          <el-radio-button label="false">是</el-radio-button>
          <el-radio-button label="true">否</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.type.toString() !== '2'" label="菜单标题" prop="title">
        <el-input v-model="form.title" :style=" form.type.toString() === '0' ? 'width: 450px' : 'width: 178px'" placeholder="菜单标题" />
      </el-form-item>
      <el-form-item v-if="form.type.toString() === '2'" label="按钮名称" prop="title">
        <el-input v-model="form.title" placeholder="按钮名称" style="width: 178px;" />
      </el-form-item>
      <el-form-item v-show="form.type.toString() !== '0'" label="权限标识" prop="permission">
        <el-input v-model="form.permission" :disabled="form.iframe" placeholder="权限标识" style="width: 178px;" />
      </el-form-item>
      <el-form-item v-if="form.type.toString() !== '2'" label="路由地址" prop="path">
        <el-input v-model="form.path" placeholder="路由地址" style="width: 178px;" />
      </el-form-item>
      <el-form-item label="菜单排序" prop="menuSort">
        <el-input-number v-model.number="form.menuSort" :min="0" :max="999" controls-position="right" style="width: 178px;" />
      </el-form-item>
      <el-form-item v-show="!form.iframe && form.type.toString() === '1'" label="组件名称" prop="componentName">
        <el-input v-model="form.componentName" style="width: 178px;" placeholder="匹配组件内Name字段" />
      </el-form-item>
      <el-form-item v-show="!form.iframe && form.type.toString() === '1'" label="组件路径" prop="component">
        <el-input v-model="form.component" style="width: 178px;" placeholder="组件路径" />
      </el-form-item>
      <el-form-item label="上级类目" prop="pid">
        <treeselect
          v-model="form.pid"
          :options="menus"
          :load-options="loadMenus"
          style="width: 450px;"
          placeholder="选择上级类目"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="crud.cancelCU">取消</el-button>
      <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {

}
</script>
