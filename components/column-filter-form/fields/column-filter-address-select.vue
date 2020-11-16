<template>
  <u-form-item :prop="customField.name" :label="customField.label" :required="customField.required">
    <u-input
      :border="border" type="select" :select-open="selectShow" v-model="valueDisplay"
      :placeholder="placeholder" @click="selectShow = true"></u-input>
    <u-select
      v-model="selectShow" mode="mutil-column-auto"
      :default-value="value"
      :list="list"
      @confirm="handleConfirm"
    ></u-select>
  </u-form-item>
</template>

<script>
  import _ from "lodash";
  import Geo from 'services/geo';

  export default {
    data() {
      // props 获取数据
      let {
        name,  fieldType, customField,
        record, klassName,
        value
      } = this.$attrs;

      return {
        name,  fieldType, customField,
        record, klassName,
        list: [],
        value,
        placeholder: `请选择${customField.label}`,
        border: false,
        selectShow: false
      }
    },
    created() {
      this.fetchData();
    },
    methods: {
      handleConfirm(e) {
        let { customField: { name }} = this;
        // console.debug("form-geo-address-field confirm", e);

        let value = {
          province_id: e[0].value,
          // province_name: e[0].label,
          city_id: e[1].value,
          // city_name: e[1].label,
          district_id: e[2].value,
          // district_name: e[2].label
        }

        this.value = [
          value.province_id,
          value.city_id,
          value.district_id
        ];
        this.$emit("fieldChange", {name, value});
      },
      async fetchData () {
        let geo = await Geo.instance();

        let {data} = geo;

        let { provinces, cities, districts } = data;
        let list = null;

        // REVIEW 第一级不能出现 children 为空的 因为 层级深度要对齐
        // provinces = _.concat(
        //   [{
        //     name: "请选择省份",
        //     id: ""
        //   }],
        //   provinces
        // );

        cities = _.map(cities, (city) => {
          let _districts = _.filter(districts, (district) => {
            return district.city_id == city.id
          });
          _districts = _.concat(
            [{
              name: "请选择地区",
              id: "",
            }],
            _districts
          );

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
          _cities = _.concat(
            [{
              label: "请选择城市",
              value: "",
              children: [
                {
                  label: "请选择地区",
                  value: "",
                }
              ]
            }],
            _cities
          );

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
        
        this.$set(this, "list", list);
      }
    },
    computed: {
      valueDisplay: {
        get: function() {
          let { list, value } = this;

          if (_.isNil(value)) return;

          let province = value[0] ? _.find(list, (opt)=> opt.value == value[0]) : {};
          let city = value[1] ? _.find(province?.children, (opt)=> opt.value == value[1]) : {};
          let district =  value[2] ?  _.find(city?.children, (opt)=> opt.value == value[2]) : {};

          return _.compact([province?.label, city?.label, district?.label]).join("/");
        },
        set: function (value) {
        }
      }
    }
  };
</script>

<style>
</style>
