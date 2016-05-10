
import React from 'react';
import {DFPManager} from './manager';


export const AdSlot = React.createClass({
  displayName: 'AdSlot',

  propTypes: {
    dfpNetworkId: React.PropTypes.string.isRequired,
    adUnit: React.PropTypes.string.isRequired,
    sizes: React.PropTypes.arrayOf(
      React.PropTypes.arrayOf(React.PropTypes.number)
    ).isRequired,
    targetingArguments: React.PropTypes.object,
    onSlotRender: React.PropTypes.func,
    shouldRefresh: React.PropTypes.func,
    elementId: React.PropTypes.string,
  },
  
  getDefaultProps() {
    let seconds = (Date.now && Date.now() || new Date().getTime()) / 1000;
    return {
      elementId: `adSlot-${seconds}`,
    };
  },
  
  componentDidMount() {
    const slotData = Object.assign({slotShouldRefresh: this.slotShouldRefresh}, this.props);
    DFPManager.registerSlot(slotData);
    DFPManager.onSlotRenderEnded(this.slotRenderEnded);
  },

  render() {
    return (
      <div className="adunitContainer"> <div id={this.props.elementId} className="adBox" /> </div>
    );
  },

  componentWillUmount() {
    DFPManager.unregisterSlot(this.props);
    DFPManager.offSlotRenderEnded(this.slotRenderEnded);
  },

  slotRenderEnded(eventData) {
    if (eventData.slotId === this.props.elementId) {
      this.props.onSlotRender(eventData);
    }
  },

  slotShouldRefresh() {
    let r = true;
    if (this.props.shouldRefresh !== undefined) {
      const {dfpNetworkId, adUnit, elementId, sizes} = this.props;
      r = this.props.shouldRefresh({dfpNetworkId, adUnit, elementId, sizes});
    }
    return r;
  },
});