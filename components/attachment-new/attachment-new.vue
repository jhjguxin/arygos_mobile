<template>
  <view>
    <u-modal
      ref="uModal"
      v-model="show" :title="title" :z-index="zIndex" :mask="mask"
      :async-close="true"
      :mask-close-able="maskCloseAble"
      :show-cancel-button="showCancelButton"
      @confirm="handleConfirm"
    >
        <view class="slot-content">
          <u-form :model="form.model" ref="uForm">
              <u-form-item :label="form.item.attachment_id.label" prop="attachment_id">
                <attachment-upload
                  maxCount="1"
                  @upload="handleUpload"
                />
              </u-form-item>
            </u-form>
        </view>
    </u-modal>
    <text @click="show = true">{{buttonText}}</text>
  </view>
</template>

<script>
  import { attachmentApi } from 'services/http';

  export default {
    data() {
      let { title = "附件", buttonText = "新增附件" } = this.$attrs;

      return {
        title,
        buttonText,
        show: false,
        zIndex: 1075 - 200,
        mask: false,
        maskCloseAble: false,
        showCancelButton: true,
        form: {
          model: {
            attachment_id: null
          },
          item: {
            attachment_id: {
              label: "附件"
            }
          },
          rules: {
            attachment_id: [
              {
                required: true,
                message: '请上传文件',
              }
            ]
          }
        }
      };
    },
    mounted() {
    },
    methods: {
      handleUpdate () {
        let { params: {attachmentable_type, attachmentable_id} } = this.$attrs;
        let { form: {model: {attachment_id: id }}} = this;

        let params = {
          id,
          attachment: {
            attachmentable_type, attachmentable_id
          }
        };

        attachmentApi.update(params).then((res) => {
          let {
            data: {
              code, remark
            },
          } = res;

          if (code == 0) {
            uni.showToast({
              icon: 'success',
              title: "操作成功",
              duration: 1000
            });

            this.show = false;
            this.$emit("success")
          } else {
            _.delay(()=>{
              uni.showToast({
                icon: 'none',
                title: remark || "操作失败",
                duration: 1000
              });
            }, 200);
            this.$refs.uModal.clearLoading();
          }
        })
      },
      showModal() {
        this.show = true;
        this.$refs.uForm.setRules(this.form.rules);
      },
      handleUpload(lists) {
        if (lists.length == 1) {
          let attachment_id = lists[0]?.response?.payload['id'];

          if (attachment_id) {
            this.form.model.attachment_id = String(attachment_id);
          }
        }
      },
      handleConfirm() {
        this.$refs.uForm.validate((valid) => {
          if (valid) {
            this.handleUpdate();
          } else {
            this.$refs.uModal.clearLoading();
          }
        })
      }
    }
  }
</script>

<style>
  .slot-content {
    font-size: 28rpx;
    color: $u-content-color;
    padding-left: 30rpx;
  }
</style>
