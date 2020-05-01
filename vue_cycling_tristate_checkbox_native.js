/*
  5002ae2ee64cdd5b7a04af1db04507829d3f04efd4122a20ce177cdb944c1b1c

  Vue.js component for a cycling tristate checkbox with…
  - support for form submission (using attribute "name")
  - cycles throught all three states while clicking: off, on, intermediate, off, ..
  - support for keyboard navigation using tabulator and spacebar
  - support for integration with labels, either
    - bound using attribute "for" or
    - surrounding the component as parent nodes
  - use of checkbox rendering native to the browser
  - support for setting custom submission values

  Copyright (C) 2020 Sebastian Pipping <sebastian@pipping.org>

  Licensed under the MIT license
*/

Vue.component('tristate-checkbox', {
  model: {
    prop: '_external_state'  // re-directs v-model off prop `value`
  },
  props: {
    binary: {
      // Whether to revert back to a binary checkbox, wins over indeterminate
      type: Boolean,
      default: false
    },
    checked: {
      // Whether to start out checked
      type: Boolean,
      default: false
    },
    disabled: {
      // Whether to start out disabled
      type: Boolean,
      default: false
    },
    id: {
      // HTML ID to use for the checkbox node of the component
      type: String
    },
    indeterminate: {
      // Whether to start out indeterminate, wins over checked
      type: Boolean,
      default: false
    },
    name: {
      // Name to use during form submission; set to enable form submission
      type: String
    },

    trueValue: {
      // Model value to use for checked state
      default: true
    },
    falseValue: {
      // Model value to use for unchecked state
      default: false
    },
    nullValue: {
      // Model value to use for indeterminate state
      default: null
    },

    value: {
      // Form submission value to use for checked state
      type: String,
      default: 'on'
    },
    indeterminateValue: {
      // Form submission value to use for indeterminate state
      type: String,
      default: 'indeterminate'
    },

    _external_state: {
      // Target for v-model when given (think this.$vnode.data.model.value)
    },
  },
  template: '\
    <div style="display: inline-block" ref="container"> \
      <input type="checkbox" :id="id || false" :disabled="disabled" \
        @click.stop="toggle" \
        @keyup.space.prevent="toggle" \
        ref="checkbox" \
        ></input> \
      <input v-if="name && submission_value" \
        type="hidden" :name="name" \
        :value="submission_value" \
        ref="hidden-input" \
      ></input> \
    </div> \
    ',
  data: function() {
    if (this.$vnode.data.model) {
      return {}
    } else {
      return {
        internal_state: this.indeterminate
                          ? this.nullValue
                          : (this.checked
                              ? this.trueValue
                              : this.falseValue)
      }
    }
  },
  computed: {
    state: {
      get: function() {
        if (this.$vnode.data.model) {
          return this._external_state
        } else {
          return this.internal_state
        }
      },
      set: function(newState) {
        if (this.$vnode.data.model) {
          this.$vnode.data.model.callback(newState)
        } else {
          this.internal_state = newState
        }
        this.apply_to_checkbox(newState)
      }
    },

    // Value used for hidden field during form sumbission
    submission_value: function() {
      switch (this.state) {
        case this.trueValue:
          return this.value
        case this.nullValue:
          return this.indeterminateValue
        case this.falseValue:
        default:
          return false  // i.e. no submission as a plain checkbox would do
      }
    },
  },
  mounted: function() {
    this.apply_to_checkbox(this.state)
  },
  methods: {
    apply_to_checkbox: function(state) {
      var checkbox = this.$el.firstElementChild
      checkbox.checked = (state === this.trueValue)
      checkbox.indeterminate = (state === this.nullValue)
    },
    toggle: function() {
      if (this.binary) {
        this.state = ! this.state;
      } else {
        switch (this.state) {
          case this.falseValue:
            this.state = this.trueValue
            break
          case this.trueValue:
            this.state = this.nullValue
            break
          case this.nullValue:
            this.state = this.falseValue
            break
        }
      }
    }
  }
})
