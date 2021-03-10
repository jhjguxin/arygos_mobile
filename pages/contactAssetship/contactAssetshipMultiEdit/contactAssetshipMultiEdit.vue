<template>
  <view>
    <u-table class="u-p-t-20">
      <u-tr>
        <u-th>{{featureLabels.contact}}</u-th>
        <u-th>{{featureLabels.contact}}角色</u-th>
        <u-th>操作</u-th>
      </u-tr>
      <u-tr
        v-for="(item, index) in models"
        v-bind:key="index"
      >
        <u-td>
          <select2
            :title="select2.title"
            :klassName="select2.klassName"
            :placeholder="select2.placeholder"
            :params="select2.params"
            :value="item.contact"
            @select="handleContactSelect($event, index)"
          />
        </u-td>
        <u-td>
          <u-input
            type="select" :select-open="item.categorySelect.show" v-model="item.category_display"
            :placeholder="customField.input_html_options.placeholder" @click="item.categorySelect.show = true"></u-input>
          <u-select mode="single-column" :list="categorySelect.list" v-model="item.categorySelect.show" @confirm="handleCategoryConfirm($event, index)"></u-select>
        </u-td>
        <u-td>
          <u-button type="error" size="medium" @click="handleDelete($event, index)">删除</u-button>
        </u-td>
      </u-tr>
    </u-table>

    <u-row class="u-p-t-20">
      <u-col span="5">
        <u-button
          size="medium"
          @click="handleAddContactAssetship"
        >添加{{featureLabels.contact}}</u-button>
      </u-col>

    </u-row>
    <view class="u-p-t-60">
      <u-button
        type="primary" size="default" class="u-m-10"
        @click="handleSubmit"
      >确定</u-button>
      <u-button
        type="default" size="default" class="u-m-10"
        @click="handleCancel"
      >返回</u-button>
    </view>
  </view>
</template>

<script>
  import _ from "lodash";
  import dayjs from "dayjs";
  import { contractApi, opportunityApi } from 'services/http';
  import CustomField from 'services/custom_field';

  export default {
    data() {
      const featureLabels = getApp().globalData.featureLabels

      return {
        id: 0, klassName: "",
        api: {},
        models: [],
        select2: {},
        categorySelect: {
          placeholder: `请选择${featureLabels.contact}角色`,
          list: []
        },
        featureLabels: getApp().globalData.featureLabels
      }
    },
    async onLoad(options) {
      let { id, klassName, customerId } = options;
      let { featureLabels } = this;

      const apis = {
        Contract: contractApi,
        Opportunity: opportunityApi
      };

      this.api = apis[klassName];
      this.id = id;
      this.klassName = klassName;
      this.select2 = {
        title: featureLabels.contact,
        klassName: "Contact",
        placeholder: `请选择${featureLabels.contact}`,
        params: {
          customer_id: customerId
        }
      };

      uni.setNavigationBarTitle({
        title: featureLabels["contact"]
      });

      this.fetchCategoryCustomField()
      this.fetchContactAsship();
    },
    methods: {
      fetchContactAsship() {
        let { api, id } = this;
        api.contact_assetships({ id }).then((res) => {
          let {
            data: {
              code, remark, data: {models}
            }
          } = res;

          models = _.map(models, (item)=> (
            {
              ...item,
              contact: {
                id: item.contact.id,
                name: item.contact.name,
                value: item.contact.id,
                label: item.contact.name
              },
              categorySelect: {
                show: false
              }
            }
          ));

          this.models = models;
        })
      },
      handleSave({ contactAssetships }) {
        let { klassName, id, api } = this;
        let params = {
          [`${_.snakeCase(klassName)}`]: {
            contact_assetships: contactAssetships
          }
        };

        api.update({id, ...params}).then((res)=> {
          let { data: {code, remark} } = res;

          if (Number(code) === 0) {
              let pages = getCurrentPages();

              // REVIEW 尝试刷新任务列表
              let prevPage = pages[pages.length - 2]; //上一个页面
              prevPage?.$refs?.contactAssetshipList?.fetchListData({reload: true});

              uni.navigateBack({
                delta: 1,
                success() {
                  _.delay(()=>{
                    uni.showToast({
                      icon: 'success',
                      title: '保存成功',
                      duration: 1000
                    });
                  }, 200)
                }
              });
          } else {
            uni.showToast({
              icon: 'none',
              title: remark || "操作失败",
              duration: 1000
            })
          }
        })
      },
      async fetchCategoryCustomField () {
        let customFields = await CustomField.instance().fetchData("Contact");
        const customField = _.find(customFields, (customField)=> (customField.name == 'category'));
        this.customField = customField;

        let list = _.map(customField.collection_options, (opt) => (
          {
            label: opt[0],
            value: opt[1]
          }
        ));
        this.categorySelect.list = list;
      },
      handleContactSelect(event, index) {
        let { models } = this;
        let item = models[index];
        let { value: { value, label } } = event;

       models[index] = {
        ...item,
        contact_id: Number(value),
        contact: {
          value, label,
          id: Number(value),
          name: label
        },
       }
      },
      handleCategoryConfirm: function (e, index) {
        let { models } = this;
        let item = models[index];

        item.category = e[0]?.value;
        item.category_display = e[0]?.label;

        this.models = models;
      },
      handleCancel() {
        uni.navigateBack({
          delta: 1
        });
      },
      handleDelete(event, index) {
        let { models } = this;
        models.splice(index, 1);

        this.models = models;
      },
      handleAddContactAssetship(e) {
        let { id, klassName } = this;
        let { models } = this;

        models.push({
          assetable_id: id,
          assetable_type: klassName,
          category: null,
          category_display: null,
          contact: {},
          contact_id: null,
          categorySelect: {
            show: false
          },
          id: null
        })

        this.models = models;
      },
      handleSubmit() {
        let { models, featureLabels } = this;
        let contactAssetships = models.map((item) => (
          _.pick(item, ["id", "contact_id", "category"])
        ));
        let index;

        index = _.findIndex(contactAssetships, (item) => _.isNil(item.contact_id));
        if (index != -1) {
          uni.showToast({
            icon: 'none',
            title: `第（${index  + 1}）行，${featureLabels.contact}不允许为空`,
            duration: 1000
          })
          return;
        }

        index = _.findIndex(contactAssetships, (item) => _.isNil(item.category));
        if (index != -1) {
          uni.showToast({
            icon: 'none',
            title: `第（${index  + 1}）行，${featureLabels.contact}角色不允许为空`,
            duration: 1000
          })
          return;
        }

        let contactIDs = _.map(contactAssetships, "contact_id");
        if (_.uniq(contactIDs).length < contactIDs.length) {
          uni.showToast({
            icon: 'none',
            title: `不允许选择重复的${featureLabels.contact}`,
            duration: 1000
          })
          return;
        }

        this.handleSave({ contactAssetships });
      }
    }
  }
</script>

<style>

</style>
