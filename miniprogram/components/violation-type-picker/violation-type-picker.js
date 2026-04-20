Component({
  properties: {
    selected: {
      type: String,
      value: ''
    }
  },

  data: {
    options: [
      { id: 'illegal-lane-change', label: '非法变道' },
      { id: 'yellow-line-violation', label: '压线行驶' },
      { id: 'red-light-violation', label: '闯红灯' },
      { id: 'illegal-parking', label: '违法停车' },
      { id: 'emergency-lane-violation', label: '应急车道行驶' }
    ]
  },

  methods: {
    select(e) {
      const id = e.currentTarget.dataset.id;
      this.triggerEvent('change', { id });
    }
  }
});
