<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-col :span="12">
          <el-input
            v-model="listQuery.code"
            placeholder="编号"
            style="width: 200px;"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
          <el-button
            v-waves
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleFilter"
          >查询</el-button>
        </el-col>
        <el-col :span="12" class="text-right">
          <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">新增</el-button>
          <el-button
            v-waves
            :loading="downloadLoading"
            class="filter-item"
            type="primary"
            icon="el-icon-download"
            @click="exportIntercept"
          >导出</el-button>
          <el-popover
            class="filter-item"
            style="margin-left: 10px;"
            placement="bottom"
            trigger="click"
          >
            <el-checkbox-group v-model="colSelects">
              <el-checkbox
                v-for="(item, index) in columns"
                :key="index"
                :label="item.field"
              >{{ item.label }}</el-checkbox>
            </el-checkbox-group>
            <el-button slot="reference" type="primary">列筛选</el-button>
          </el-popover>
        </el-col>
      </el-row>
    </div>

    <el-table
      :key="tableKey"
      ref="table"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" :sortable="true" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="colSelects.indexOf('code') !== -1"
        label="编号"
        min-width="150px"
        prop="code"
        :sortable="true"
      >
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.code }}</span>
        </template>
      </el-table-column>
      <ssr>
        let s = '';
        data = JSON.parse(data);
        for(var i=0;i<data.length;i++) {
          s += `<el-table-column v-if="colSelects.indexOf('code') !== -1" label="" min-width="150px" prop="code" :sortable="true" > +
            <template slot-scope="{row}"> +
              <span class="link-type" @click="handleUpdate(row)">{{ row.${data[i]} }}</span> +
            </template>
          </el-table-column>`
        } 
        return s;
      </ssr>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" plain @click="handleUpdate(row)">编辑</el-button>
          <el-popconfirm
            confirm-button-text="是的"
            cancel-button-text="不了"
            icon="el-icon-info"
            icon-color="red"
            :title="`确定删除${row.roomName}吗？`"
            @onConfirm="handleDelete(row,$index)"
          >
            <el-button
              v-if="row.status!='deleted'"
              slot="reference"
              size="mini"
              type="danger"
              plain
            >删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="编号" prop="code">
          <el-input v-model="temp.code" required />
        </el-form-item>
        <ssr>
            let s = '';
            data = JSON.parse(data);
            for(var i=0;i<data.length;i++) {
              s += `<el-form-item label="" prop="code">
                  <el-input v-model="temp.${data[i]}" required />
                </el-form-item>`
            }
            return s;
        </ssr>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchList,
  fetchDetail,
  createItem,
  updateItem,
  removeItem,
  fetchDevice,
  fetchScanCode
} from "@/api/${name}";
import waves from "@/directive/waves"; // waves directive
import { ListFunctions } from "@/utils";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "${name}-list",
  components: { Pagination },
  directives: { waves },
  filters: {},
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        sort: []
      },
      temp: {
        id: undefined
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "修改",
        create: "新增"
      },
      rules: {
        code: [{ required: true, message: "编号为必填项", trigger: "change" }]
        // 遍历生成校验规则
      },
      rowSelects: [],
      colSelects: ["code"], // 遍历生成列筛选
      columns: [
        {
          field: "code",
          label: "编号"
        }
      ]
    };
  },
  watch: {},
  created() {
    this.getList();
  },
  methods: {
    ...ListFunctions,
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        this.list = response.data.data;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.getList();
    },
    resetTemp() {
      this.temp = {
        id: undefined
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          createItem(this.temp).then(() => {
            this.getList();
            this.dialogFormVisible = false;
            this.$notify({
              title: "提示",
              message: "新增成功",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    handleUpdate(row) {
      this.scanCodePath = "";
      fetchDetail(row.id).then(res => {
        this.temp = Object.assign(
          { _deviceIds: res.data?.deviceIds?.split(",") },
          res.data
        );
        this.temp.timestamp = new Date(this.temp.timestamp);
        this.dialogStatus = "update";
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs["dataForm"].clearValidate();
        });
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          updateItem(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id);
            this.list.splice(index, 1, this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "提示",
              message: "修改成功",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    handleDelete(row, index) {
      removeItem(row).then(() => {
        this.$notify({
          title: "提示",
          message: "删除成功",
          type: "success",
          duration: 2000
        });
        this.list.splice(index, 1);
      });
    }
  }
};
</script>
