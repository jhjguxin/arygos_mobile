<template>
  <view>
    <view
      v-for="(item, index) in models":key="item.id">
      <u-swipe-action
        :show="item.swipeAction.show" :index="index"
        @click="handleSwipActionClick" @open="handleSwipeActionOpen"
        :options="swipeAction.options"
      >
        <u-card
          :title="item.product.name"
          :border="card.border" :sub-title="item.product.no" :full="card.full"
          :show-head="card.showHead" :show-foot="card.showFoot"
          :margin="card.margin"  :padding="card.padding"
        >
          <u-row slot="body"  gutter="10" justify="space-between">
            <u-col span="3" text-align="right" class="u-font-xs">
              标准单价
            </u-col>
            <u-col span="9" class="u-padding-left-20">
              {{item.product.standard_unit_price}}
            </u-col>
            <u-col span="3" text-align="right" class="u-font-xs">
              销售单位
            </u-col>
            <u-col span="9" class="u-padding-left-20">
              {{item.product.sale_unit}}
            </u-col>
            <u-col span="3" text-align="right" class="u-font-xs">
              数量
            </u-col>
            <u-col span="9" class="u-padding-left-20">
              <u-input type="number" v-model="item.quantity"
                placeholder="请输入数量"></u-input>
            </u-col>
            <u-col span="3" text-align="right" class="u-font-xs">
              建议价格
            </u-col>
            <u-col span="9" class="u-padding-left-20">
              <u-input type="number" v-model="item.recommended_unit_price"
                placeholder="请输入建议价格"></u-input>
            </u-col>
            <u-col span="3" text-align="right" class="u-font-xs">
              备注
            </u-col>
            <u-col span="9" class="u-padding-left-20">
              <u-input type="textarea" v-model="item.remark"
                placeholder="请输入备注"></u-input>
            </u-col>
          </u-row>
        </u-card>
      </u-swipe-action>
    </view>


    <u-form :model="form.model" ref="uForm" :error-type="form.errorType">
      <u-row class="u-p-t-20">
        <u-col span="5">
          <u-form-item prop="product">
            <select2
              :title="select2.title"
              ref="productSelect2"
              :klassName="select2.klassName"
              :placeholder="select2.placeholder"
              :params="select2.params"
              @select="handleProductSelect($event)"
            />
          </u-form-item>
        </u-col>
        <u-col span="3">
          <u-button
            @click="handleAddProductSubmit"
          >添加</u-button>
        </u-col>
      </u-row>
    </u-form>

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
  import { contractApi, opportunityApi, productApi } from 'services/http';
  import CustomField from 'services/custom_field';

  export default {
    data() {
      let { query: {id, klassName, customerId} } = this.$route;
      const apis = {
        Contract: contractApi,
        Opportunity: opportunityApi
      };
      const featureLabels = getApp().globalData.featureLabels

      return {
        id, klassName,
        api: apis[klassName],
        models: [],
        card: {
          border: true,
          full: true,
          showHead: true,
          showFoot: false,
          margin: "30rpx",
          padding: "20"
        },
        select2: {
          title: featureLabels.product,
          klassName: "Product",
          placeholder: `请选择${featureLabels.product}`
        },
        form: {
          errorType: ['toast'],
          model: {
            product: null
          },
          rules: {
            product: [
              {
                required: true,
                message: `请选择${featureLabels.product}`,
                type: "object"
              }
            ],
          }
        },
        swipeAction: {
          options: [
            {
              text: '删除',
              style: {
                backgroundColor: '#dd524d'
              }
            }
          ]
        },
        featureLabels: getApp().globalData.featureLabels
      }
    },
    async onLoad() {
      let { featureLabels } = this;

      uni.setNavigationBarTitle({
        title: this.featureLabels["product"]
      });

      this.fetchProductAsset();
    },
    onReady () {
      this.$refs.uForm.setRules(this.form.rules);
    },
    methods: {
      fetchProductAsset() {
        let { api, id } = this;
        api.product_assets({ id }).then((res) => {
          let {
            data: {
              code, remark, data: {models}
            }
          } = res;

          models = _.map(models, (item)=> (
            {
              ...item,
              swipeAction: {
                show: false
              },
            }
          ));

          this.models = models;
        })
      },
      handleSave({ productAssets }) {
        let { klassName, id, api } = this;
        let params = {
          [`${_.snakeCase(klassName)}`]: {
            product_assets: productAssets
          }
        };

        api.update({id, ...params}).then((res)=> {
          let { data: {code, remark} } = res;

          if (Number(code) === 0) {
              let pages = getCurrentPages();

              // REVIEW 尝试刷新任务列表
              let prevPage = pages[pages.length - 2]; //上一个页面
              prevPage?.$refs?.productAssetList?.fetchListData({reload: true});

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
      handleProductSelect(event) {
        let { form: { model } } = this;
        let { value: product} = event;
        model = {
          ...model,
          product
        }

        this.$set(this, "form", {
          ...this.form,
          model
        });
      },
      handleCancel() {
        uni.navigateBack({
          delta: 1
        });
      },
      handleDelete(index) {
        let { models } = this;
        models.splice(index, 1);

        this.models = models;
      },
      addProductAsset() {
        let {
          klassName,
          models, featureLabels,
          form: { model: {product: { value: id }}} ,
        } = this;
        productApi.show({id}).then((res)=> {
          let { data: {code, remark, data: item } } = res;
          if (code != 0) {
            uni.showToast({
              icon: 'none',
              title: `获取${featureLabels.product}失败`,
              duration: 1000
            })
            return
          }
          models.push({
             assetable_id: id,
             assetable_type: klassName,
             product: item,
             product_id: item.id,
             id: null,
              swipeAction: {
                show: false
              },
           });

           this.models = models;
           this.form = {
             ...this.form,
             model: {
               product: null
             }
           };
           this.$refs.productSelect2.value = {};
        })
      },
      handleAddProductSubmit(e) {
        this.$refs.uForm.validate(valid => {
          if (valid) {
            this.addProductAsset()
          } else {
            console.log('验证失败');
          }
        });
      },
      handleSubmit() {
        let { models, featureLabels } = this;
        let productAssets = models.map((item) => (
          _.pick(item, ["id", "product_id", "quantity", "recommended_unit_price", "remark"])
        ));
        let index;

        index = _.findIndex(productAssets, (item) => _.isNil(item.product_id));
        if (index != -1) {
          uni.showToast({
            icon: 'none',
            title: `第（${index  + 1}）行，${featureLabels.product}不允许为空`,
            duration: 1000
          })
          return;
        }

        let productIDs = _.map(productAssets, "product_id");
        if (_.uniq(productIDs).length < productIDs.length) {
          uni.showToast({
            icon: 'none',
            title: `不允许选择重复的${featureLabels.product}`,
            duration: 1000
          })
          return;
        }

        this.handleSave({ productAssets });
      },
      handleSwipeActionOpen (index) {
        let { models } = this;
        models = _.each(models, (item) => {
          item.swipeAction.show = false;
        });
        models[index].swipeAction.show = true;

        this.models = models;
      },
      handleSwipActionClick (index, option_index) {
        if (option_index === 0) {
          this.handleDelete(index);
        }
      },
    }
  }
</script>

<style>

</style>
