<template>
  <u-upload
    ref="uUpload"
    v-model:file-list="localFileList"
    :auto-delete="true"
    :max-count="maxCount"
    :upload-text="uploadText"
    :auto-upload="!isQiniu"
    :custom-after-auto-upload="!isQiniu"
    :auto-upload-api="action"
    :auto-upload-header="header"
    :deletable="deletable"
    :width="width"
    :height="height"
    @after-auto-upload="handleAfterAutoUpload"
    @after-read="handleQiniuAfterRead"
    @delete="handleRemove"
    v-if="uploadReady"
  ></u-upload>
  <u-loading-icon mode="spinner" v-else />
</template>

<script>
  import {config} from '@/config';
  import _ from 'lodash';
  import ConstGlobal from '@/services/const_global';
  import { authApi } from '@/services/http/qiniu';
  import { useStore } from '@/store';

  export default {
    props: {
      'file-list': { type: Array, default: () => [] },
      maxCount: { type: Number, default: 8 },
      uploadText: { type: String, default: '选择文件' },
      deletable: { type: Boolean, default: false },
      width: {}, height: {}
    },
    data() {
      return {
        action: "",
        localFileList: this['file-list'] || [],
        header: {},
        qiniu: {},
        isQiniu: false,
        uploadReady: false,
        currentUser: null
      };
    },
    async created() {
      let constGlobal = await ConstGlobal.instance();
      const currentUser = useStore().getUser;
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
        const userToken = useStore().getAuthToken;
        const header = {
          'Authorization': `Bearer token="${userToken}", device="h5"`
        };
        let action = `${config["API_HOST"]}/api/qiniu/attachments`;

        this.isQiniu = false;
        this.action = action;
        this.header = header;
        this.uploadReady = true;
      },
      async initQiniuUpload () {
        this.isQiniu = true;
        await this.fetchQiniuUploadToken();

        let { qiniu, currentUser: { id: userid, organization_id: orgid } } = this;

        if (_.isNil(qiniu?.uptoken)) {
          uni.showToast({
            icon: 'none',
            title: '初始化上传组件失败',
            duration: 1000
          });
        }

        this.uploadReady = true;
      },
      async fetchQiniuUploadToken() {
        let res = await authApi.upload_token();
        let { data } = res;

        if (data?.code == 0) {
          let { uptoken, bypass_model, up_host, callbackUrl } = data;
          this.qiniu = { uptoken, bypass_model, up_host, callbackUrl };
        }
      },
      // 文件系统模式：拦截自动上传的响应
      handleAfterAutoUpload (event) {
        // u-upload emit: Object.assign(responseString, { callback })
        // event 本身就是响应字符串（String 对象，带 callback 属性），没有 .data
        let callback = event?.callback;
        try {
          let response = JSON.parse(event);

          if (response?.key && response?.payload?.id) {
            // 上传成功：通过 callback 告知 u-upload 标记成功
            if (callback) {
              callback({ url: response.payload.file_url || '' });
            }
            // u-upload succcessUpload 后会 emit update:fileList 同步到 localFileList
            // 在 nextTick 后为 fileList 项补充完整的 response 数据
            this.$nextTick(() => {
              let list = this.localFileList;
              let last = list.length > 0 ? list[list.length - 1] : null;
              if (last && !last.response) {
                last.response = response;
              }
              this.$emit("upload", [...list]);
            });
          } else {
            // 上传失败
            if (callback) callback({});
            uni.showToast({
              icon: 'none',
              title: response?.remark || '上传失败',
              duration: 1000
            });
          }
        } catch (e) {
          if (callback) callback({});
          uni.showToast({ icon: 'none', title: '上传异常', duration: 1000 });
        }
      },
      // 七牛模式：手动上传
      handleQiniuAfterRead ({ file }) {
        let { qiniu, currentUser } = this;
        let { uptoken: token, bypass_model: bypassModel, callbackUrl } = qiniu || {};

        if (!token) {
          uni.showToast({ icon: 'none', title: '上传凭证获取失败', duration: 1000 });
          return;
        }

        let tempItem = {
          ...file,
          status: 'uploading',
          message: '上传中',
          progress: 0
        };

        // 七牛模式 auto-upload=false，文件不会自动进入 fileList
        // 先添加临时项到 localFileList 用于显示上传进度
        this.localFileList.push(tempItem);
        let uploadIndex = this.localFileList.length - 1;

        uni.uploadFile({
          url: qiniu.up_host,
          filePath: file.url || file.path,
          name: 'file',
          formData: {
            token,
            userid: currentUser?.id,
            orgid: currentUser?.organization_id,
            key: file.name
          },
          success: (res) => {
            let resData;
            try {
              resData = JSON.parse(res.data);
            } catch (e) {
              resData = res.data;
            }

            if (bypassModel && callbackUrl) {
              // bypass 模式下需要回调创建附件
              uni.request({
                url: callbackUrl,
                method: 'POST',
                data: {
                  ...resData,
                  name: file.name,
                  type: file.type,
                  size: file.size,
                  userid: currentUser?.id,
                  orgid: currentUser?.organization_id
                },
                success: (cbRes) => {
                  let cbData = cbRes.data;
                  if (cbData?.payload?.id || cbData?.key) {
                    this.localFileList[uploadIndex] = {
                      ...tempItem,
                      status: 'success',
                      response: cbData
                    };
                  } else {
                    this.localFileList.splice(uploadIndex, 1);
                  }
                  this.$emit("upload", [...this.localFileList]);
                },
                fail: () => {
                  this.localFileList.splice(uploadIndex, 1);
                  uni.showToast({ icon: 'none', title: '回调失败', duration: 1000 });
                  this.$emit("upload", [...this.localFileList]);
                }
              });
            } else {
              if (resData?.payload?.id || resData?.key) {
                this.localFileList[uploadIndex] = {
                  ...tempItem,
                  status: 'success',
                  response: resData
                };
              } else {
                this.localFileList.splice(uploadIndex, 1);
              }
              this.$emit("upload", [...this.localFileList]);
            }
          },
          fail: () => {
            this.localFileList.splice(uploadIndex, 1);
            uni.showToast({ icon: 'none', title: '上传失败', duration: 1000 });
            this.$emit("upload", [...this.localFileList]);
          }
        });
      },
      // 删除：autoDelete=true 时 u-upload 已从 fileList 中移除，同步到 localFileList
      handleRemove () {
        this.$emit("upload", [...this.localFileList]);
      }
    }
  }
</script>

<style>

</style>