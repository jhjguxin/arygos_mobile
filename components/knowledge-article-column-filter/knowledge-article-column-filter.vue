<template>
  <view class="filter">
    <u-dropdown ref="uDropdown" @open="handleOpen">
      <u-dropdown-item
        v-model="sectionValue" :title="sectionTitle" :options="sectionOptions" @change="handleSectionDropDownChange"
      ></u-dropdown-item>
      <u-dropdown-item
        v-model="tagValue" :title="tagTitle"
      >
        <view class="slot-content" style="background-color: #FFFFFF;">
          <scroll-view scroll-y="true" style="height: 200rpx;">
            <u-tag
              class="u-text-center u-m-t-20 u-m-l-20 u-m-r-20"
              :mode="tag.mode"
              :text="tag.label"
              v-for="(tag, index) in tagOptions"
              :key="index"
              :index="index"
              @click="handleTagClick"
            ></u-tag>
          </scroll-view>
        </view>
      </u-dropdown-item>
      <u-dropdown-item
        v-model="sortValue" :title="sortTitle" :options="sortOptions" @change="handleSortDropDownChange"
      ></u-dropdown-item>

    </u-dropdown>
  </view>
</template>

<script>
  import _ from "lodash";
  import { knowledgeArticleApi, knowledgeSectionApi, knowledgeTagApi } from 'services/http';

  export default {
    data() {
      let { storeKey } = this.$attrs;

      return {
        klassName: "KnowledgeArticle",
        sectionOptions: [],
        sectionTitle: "版块",
        sectionValue: "",
        sortValue: "",
        order: "asc",
        sortOptions: [
          {
            value: "created_at", label: "创建时间", originLabel: "创建时间"
          },
          {
            value: "updated_at", label: "更新时间", originLabel: "更新时间"
          },
          {
            value: "views", label: "阅读次数", originLabel: "阅读次数"
          }
        ],
        sortTitle: "排序",
        tagOptions: [],
        tagTitle: "标签",
        tagValue: ""
      };
    },
    async mounted() {
      let { klassName } = this;

      this.fetchTagOptions();
      this.fetchSectionOptions();
    },
    methods: {
      fetchTagOptions() {
        knowledgeTagApi.index({}).then((res) => {
          let {
            data: {
              code,
              data: {
                models
              }
            },
          } = res;

          if (code == 0) {
            this.tagOptions = _.map(models, (item) => (
              {
                label: item.name,
                value: item.name,
                mode: "light"
              }
            ))
          }
        })
      },
      fetchSectionOptions() {
        let sectionOptions = [
          {label: "所有版块", value: null}
        ];
        knowledgeSectionApi.index({}).then((res) => {
          let {
            data: {
              code,
              data: {
                models
              }
            },
          } = res;

          if (code == 0) {
            sectionOptions = sectionOptions.concat(
              _.map(models, (item) => (
                {
                  label: item.name,
                  value: item.id
                }
              ))
            )
            this.sectionOptions = sectionOptions
          }
        })
      },
      handleSectionDropDownChange (value) {
        let { sectionOptions } = this;
        let section = _.find(sectionOptions, (item)=> item.value == value);

        this.sectionValue = value;
        this.sectionTitle = section.label;

        this.triggeFilterConfirm();
      },
      handleSortDropDownChange (value) {
        let { sortValue, order, sortOptions } = this;
        if (sortValue === value) {

          order = order === "asc" ? "desc" : "asc";
        } else {
          order = "asc";
        }

        let _order = order === "asc" ? "▲" : "▼";

        sortOptions = _.map(sortOptions, (option) => {
          let { originLabel: label } = option;
          option.label = option.value == value ? `${label}  ${_order}` : label;
          return option;
        });
        let sortTitle = _.find(sortOptions, (option)=> (option.value == value))?.label;

        this.sortOptions = sortOptions;
        this.sortValue = value;
        this.order = order;
        this.sortTitle = sortTitle;

        let sort = [{[`${value}`]: order}];
        this.$emit("sortColumnChange", sort);
      },
      handleTagClick (index) {
        let { tagOptions } = this;
        let tag = tagOptions[index];
        let mode = tag.mode == "light" ? "dark" : "light";

        _.each(tagOptions, (item)=> {
          item.mode = "light";
        });
        tag.mode = mode;
        this.tagValue = mode == "dark" ? tag.value : null;

        _.delay(()=> {
          this.$refs.uDropdown.close();

          this.triggeFilterConfirm();
        }, 200);
      },
      triggeFilterConfirm() {
        let { sectionValue: knowledge_section_id, tagValue: tag } = this;

        this.$emit("filterConfirm", {
          knowledge_section_id,
          tag
        });
      },
      handleOpen () {
        // console.log(this.filtersModel)
      }
    }
  }
</script>

<style>
  .slot-content {
    background-color: #FFFFFF;
    padding: 24rpx;

    .item-box {
      margin-bottom: 50rpx;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      .item {
        border: 1px solid $u-type-primary;
        color: $u-type-primary;
        padding: 8rpx 40rpx;
        border-radius: 100rpx;
        margin-top: 30rpx;
      }

      .active {
        color: #FFFFFF;
        background-color: $u-type-primary;
      }
    }
  }
  .u-cell-item-box {
    max-height: 70vh;
    overflow-y: scroll;
  }
</style>
