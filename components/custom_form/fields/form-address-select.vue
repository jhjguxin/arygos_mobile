<template>
  <u-form-item :prop="customField.name" :label="customField.label" :required="customField.required">
    <view class="geo-address-trigger" @click="openPicker">
      <text class="geo-address-trigger__text" :class="valueDisplay ? '' : 'geo-address-trigger__placeholder'">
        {{ valueDisplay || placeholder }}
      </text>
      <u-icon name="arrow-down" :size="12" color="#909399"></u-icon>
    </view>
    <u-picker
      v-if="listReady"
      ref="picker"
      v-model:show="selectShow"
      :columns="columns"
      :key-name="'label'"
      :value-name="'value'"
      :default-index="defaultIndex"
      @change="handleChange"
      @confirm="handleConfirm"
    ></u-picker>
  </u-form-item>
</template>

<script>
  import _ from 'lodash';
  import Geo from '@/services/geo';
  import { ref } from 'vue';

  export default {
  props: {
      name: "",
      fieldType: "",
      customField: { },
      record: { },
      klassName: "",
      value: { }
  },

    setup(props) {
      return {
        list: ref([]),
        columns: ref([[], [], []]),
        defaultIndex: ref([0, 0, 0]),
        listReady: ref(false),
        placeholder: props.customField.input_html_options?.placeholder,
        selectShow: ref(false)
      };
    },
    async created() {
      let { customField: { name }} = this;
      let { value } = this;

      await this.fetchData();
      this.buildColumns();
      this.listReady = true;

      if (_.isArray(value)) {
        this.$emit("fieldChange", {
          name,
          value: {
            province_id: value[0],
            city_id: value[1],
            district_id: value[2]
          }
        });
      }
    },
    methods: {
      openPicker() {
        if (!this.listReady) return;
        this.selectShow = true;
      },
      buildColumns() {
        let { value } = this;
        let [provinceId, cityId, districtId] = value || [];

        let provinces = this.list;
        let province = _.find(provinces, (opt) => opt.value == provinceId) || provinces[0];
        let cities = province?.children || [];
        let city = _.find(cities, (opt) => opt.value == cityId) || cities[0];
        let districts = city?.children || [];

        this.columns = [provinces, cities, districts];
        this.defaultIndex = [
          Math.max(0, _.findIndex(provinces, (opt) => opt.value == province?.value)),
          Math.max(0, _.findIndex(cities, (opt) => opt.value == city?.value)),
          Math.max(0, _.findIndex(districts, (opt) => (opt?.value) == districtId))
        ];
      },
      handleChange(e) {
        let { columnIndex, index, indexs } = e;

        if (columnIndex === 0) {
          let cities = this.list[index]?.children || [];
          this.$refs.picker.setColumnValues(1, cities);
          this.$refs.picker.setColumnValues(2, cities[0]?.children || []);
        } else if (columnIndex === 1) {
          let cities = this.list[indexs[0]]?.children || [];
          this.$refs.picker.setColumnValues(2, cities[index]?.children || []);
        }
      },
      handleConfirm(e) {
        let { customField: { name }} = this;

        let value = {
          province_id: e.value?.[0]?.value,
          city_id: e.value?.[1]?.value,
          district_id: e.value?.[2]?.value
        };

        this.$emit("fieldChange", {name, value});
      },
      async fetchData () {
        let geo = await Geo.instance();

        let {data} = geo;

        let { provinces, cities, districts } = data;
        let list = null;

        cities = _.map(cities, (city) => {
          let _districts = _.filter(districts, (district) => {
            return district.city_id == city.id
          });

          return ({
            value: String(city.id),
            label: city.name,
            province_id: city.province_id,
            children: _.map(_districts, (district) => {
              return {
                value: String(district.id),
                label: district.name,
              }
            })
          });
        });

        list = _.map(provinces, (province) => {
          let _cities = _.filter(cities, (city) => {
            return String(city.province_id) == String(province.id)
          });

          return ({
            value: String(province.id),
            label: province.name,
            children: _.map(_cities, (city) => {
              return {
                value: String(city.value),
                label: city.label,
                children: city.children
              }
            })
          });
        });

        this.list = list;
      }
    },
    computed: {
      valueDisplay: {
        get: function() {
          let { list, value } = this;

          if (_.isNil(value)) return;

          let province = _.find(list, (opt)=> opt.value == value[0]);
          let city = _.find(province?.children, (opt)=> opt.value == value[1]);
          let district = _.find(city?.children, (opt)=> opt.value == value[2]);

          return _.compact([province?.label, city?.label, district?.label]).join("/");
        },
        set: function (value) {
        }
      }
    }
  };
</script>

<style>
  .geo-address-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 36rpx;
    flex: 1;
  }
  .geo-address-trigger__text {
    font-size: 15px;
    color: #303133;
  }
  .geo-address-trigger__placeholder {
    color: #c0c4cc;
  }
</style>