<template>
  <u-form
    :model="model" ref="uForm" label-width="160"
    :error-type="errorType"
  >
    <custom-form-field
      v-if="formFields.length > 0"
      v-for="field in formFields"
      :key="field.name"
      v-bind:name="field.name"
      v-bind:fieldType="field.fieldType"
      v-bind:customField="field.customField"
      v-bind:record="field.record"
      v-bind:klassName="klassName"
      v-bind:value="field.value"
      @fieldChange="handleFieldChange"
    ></custom-form-field>
    <collapse-custom-field @change="handleCollapseCustomFieldChange"/>

    <u-button @click="handleSubmit" type="primary">提交</u-button>
    <u-button @click="handleReset" >重置</u-button>
  </u-form>
</template>

<script>
  import _ from "lodash";
  import parseInitialValue from "./parseInitialValue";
  import parseRule from "./parseRule";
  import parseCustomField from "./parseCustomField";

  export default {
    data() {
      let {
        klassName = "",  record, customFields = [],
        errorType = ['message', 'border-bottom', 'toast']
      } = this.$attrs;

      let rules = {}

      _.map(customFields, (customField) => {
        let _rules = parseRule({ customField });
        if (_.isArray(_rules)) {
          rules = _.extend(
            rules,
            {
              [`${customField.name}`]: _rules
            }
          )
        }
      })

      return {
        name: "",
        klassName,  record, customFields,
        rules, errorType,
        formFields: [],
        model: {}
      }
    },
    created() {
      this.handleCollapseCustomFieldChange(false)
    },
    mounted () {
      let { rules } = this;

      this.$refs.uForm.setRules(rules);
    },
    computed: {
    },
    methods: {
      initFormFields ({ customFields }) {
        let { record, model } = this;
        let formFields = [];

        _.each(customFields, (customField) => {
          let value = model[`${customField.name}`];

          // REVIEW model[name] 为空的时候从record 中获取初始化值
          if (_.isNil(value)) {
            value = parseInitialValue({ record, customField });
          }

          formFields.push({
            name: customField.name, fieldType: customField.field_type,
            customField,
            value, record
          })
          model[`${customField.name}`] = value;
        });

        this.$set(this, "formFields", formFields);
        this.$set(this, "model", model);
      },
      handleCollapseCustomFieldChange (value) {
        let { customFields } = this;
        if (!value) {
          customFields = _.filter(customFields, (customField) =>
            customField.category == 'common'
          )
        }
        this.initFormFields({ customFields });
      },
      handleReset() {
        let { uForm } = this.$refs;

        uForm.resetFields();
      },
      handleFieldChange: function ({name, value}) {
        let { formFields, model } = this;
        formFields = _.map(formFields, (formField) => (
          formField.name == name ?
            {
              ...formField,
              value
            }
           : formField
        ));
        model = {
          ...model,
          [`${name}`]: value
        };

        this.$set(this, "model", model);
        this.$set(this, "formFields", formFields);
      },
      handleSubmit() {
        console.debug("fields", this.$refs.uForm.fields, "model", this.model);

        this.$refs.uForm.validate(valid => {
          if (valid) {
            let { formFields, model } = this;
            let values = {};
            _.each(formFields, (formField) => {
              let { name, customField } = formField;
              let attr = parseCustomField({ data: model, customField });
              values = {
                ...values,
                ...attr
              };
            })
            this.$emit("submit", values);

          } else {
            console.log('验证失败');
          }
        });
      }
    }
  };
</script>

<style>
</style>
