<template>
  <u-upload
    ref="uUpload"
    :action="action" :file-list="fileList"
    :max-count="maxCount"
    :upload-text="uploadText"
    :form-data="formData"
    :auto-upload="autoUpload"
    :deletable="deletable"
    :width="width"
    :height="height"
    :header="header"
    @on-success="handleUploadSuccess"
    @on-uploaded="handleUploaded"
    @on-remove="handleRemove"
    v-if="uploadReady"
  ></u-upload>
  <u-loading mode="flower" v-else></u-loading>
</template>

<script>
  import {config} from 'config';
  import ConstGlobal from '../../services/const_global';
  import { authApi, attachmentApi } from 'services/http/qiniu';

  export default {
    data() {
      let {
        "file-list": fileList,
        maxCount = 8,
        uploadText = "选择文件",
        formData = {},
        autoUpload = true,
        deletable = false,
        width,
        height,
        header
       } = this.$attrs;

      return {
        action: "",
        width,
        height,
        fileList,
        maxCount,
        uploadText,
        header,
        formData,
        autoUpload,
        deletable,
        qiniu: {},
        uploadReady: false,
      };
    },
    async created() {
      let constGlobal = await ConstGlobal.instance();
      const currentUser = getApp().$store.getters.getUser;

      let { global_config: {file_storage, qiniu} } = constGlobal;

      this.currentUser = currentUser;

      if (file_storage == "filesystem") {
        this.initFileSystemUpload();
      } else if (file_storage == "qiniu") {
        await this.initQiniuUpload();
      }
    },
    methods: {
      initFileSystemUpload () {
        const userToken = getApp().$store.getters.getAuthToken;
        const header = {
          'Authorization': `Bearer token="${userToken}", device="h5"`
        };
        let action = `${config["API_HOST"]}/api/qiniu/attachments`;

        this.action = action;
        this.header = header;
        this.uploadReady = true;
      },
      async initQiniuUpload () {
        await this.fetchQiniuUploadToken();
        let {
          qiniu,
          currentUser: {
            id: userid,
            organization_id: orgid
          }
        } = this;

        if (_.isNil(qiniu)) {
            uni.showToast({
              icon: 'none',
              title: '初始化上传组件失败',
              duration: 1000
            })
        }

        if (qiniu) {
          let {
            uptoken: token, up_host: action,
            bypass_model: bypassModel, up_host: UpHost, callbackUrl
          } = qiniu;

          const FormData = {
            token,
            userid,
            orgid
          };

          this.action = action;
          this.formData = FormData;
          this.uploadReady = true;
        }
      },
      async fetchQiniuUploadToken() {
        let res = await authApi.upload_token();
        let { code, data } = res;

        if (data?.code == 0) {
          let {
            uptoken, bypass_model, up_host, callbackUrl
          } = data;
          this.qiniu = {
            uptoken, bypass_model, up_host, callbackUrl
          };
        }
      },
      async handleUploadSuccess (data, index, lists, name) {
        let {
          qiniu: {bypass_model},
        } = this;

        if (bypass_model) {
          await this.handleBypassModel(data, index, lists, name);
        } else {
          this.doAddFile(data, index)
        }
      },
      handleBypassModel (data, index, lists, name) {
        let {
          qiniu: {bypass_model, callbackUrl: url},
          currentUser: {
            id: userid,
            organization_id: orgid
          }
        } = this;

        let item = lists[index];
        let file =  item.file;
        name = name || file.name;
        let { type, size } = file;

        data = {
          ...data,
          name,
          type,
          size,
          // extra 参数
          userid,
          orgid
        }

        if (bypass_model) {
          uni.request({
            url,
            header: {},
            data,
            method: 'POST',
            success: (res) => {
              let { data } = res;
              this.doAddFile(data, index)
            }
          })
        }
      },
      handleUploaded() {
      },
      doAddFile(data, up_index) {
        let { key } = data;
        let upload = this.$refs.uUpload;
        if (key) {
          let { fileList } = this;
          let item = upload.lists[up_index];
          item = {
            ...item,
            response: data
          }

          let index = _.findIndex(fileList, (v)=> (
            v?.response?.payload['id'] == item.response?.payload['id']
          ));
          if (index == -1) {
            fileList.push(item)
          }

          this.$emit("upload", fileList);
        } else {
          upload.remove(up_index);
        }
      },
      handleRemove(index) {
        let { fileList } = this;
        // REVIEW upload.lists 会丢弃 response 属性
        fileList.splice(index, 1);
        this.fileList = fileList;

        this.$emit("upload", fileList);
      }
    },
    computed: {
    }
  }
</script>

<style>

</style>
