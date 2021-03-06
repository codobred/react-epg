/* globals jest */
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-enzyme';
import EPG, { TimeIndicator, TimeLine, TimeSlot, Show } from '../../lib/index';

Enzyme.configure({ adapter: new Adapter() });

describe('EPG', () => {
  let component;

  const setupComponent = (props = {}) => {
    component = mount((
      <EPG {...props}>
        {props.children}
      </EPG>
    ));
  };

  const table = () => component.find('table');
  const thead = () => table().find('thead');
  const tbody = () => table().find('tbody');
  const headTr = () => thead().find('tr');
  const th = () => headTr().find('th');

  const timeIndicatorTests = () => {
    it('sets the theads row first child to a th', () => {
      expect(headTr().children().first()).toHaveTagName('th');
    });

    it('adds a TimeIndicator for each minute', () => {
      expect(headTr().find(TimeIndicator)).toHaveLength(76);
    });

    it('sets the first TimeIndicators time to the first time', () => {
      expect(headTr().find(TimeIndicator).first()).toHaveProp('time', new Date('1/1/99 13:30').getTime());
    });

    it('sets the last TimeIndicators time to the last time', () => {
      expect(headTr().find(TimeIndicator).last()).toHaveProp('time', new Date('1/1/99 14:45').getTime());
    });

    it('sets the 30th TimeIndicators time to 30 minutes after the first time', () => {
      expect(headTr().find(TimeIndicator).at(30)).toHaveProp('time', new Date('1/1/99 14:00').getTime());
    });
  };

  describe('with start and end props set', () => {
    beforeEach(() => setupComponent({
      start: new Date('1/1/99 13:30'),
      end: new Date('1/1/99 14:45')
    }));

    timeIndicatorTests();
  });

  describe('with single channel and time slot', () => {
    beforeEach(() => setupComponent({
      children: (
        <TimeLine name="Dave">
          <TimeSlot
            start={new Date('1/1/99 13:30')}
            end={new Date('1/1/99 14:45')}
          >
            <Show title="Top Gear" />
          </TimeSlot>
        </TimeLine>
      )
    }));

    timeIndicatorTests();
  });

  describe('with single channel and 2 time slot', () => {
    beforeEach(() => setupComponent({
      children: (
        <TimeLine name="Dave">
          <TimeSlot
            start={new Date('1/1/99 13:30')}
            end={new Date('1/1/99 14:30')}
          >
            <Show title="Top Gear" />
          </TimeSlot>
          <TimeSlot
            start={new Date('1/1/99 14:30')}
            end={new Date('1/1/99 14:45')}
          >
            <Show title="Mad Show" />
          </TimeSlot>
        </TimeLine>
      )
    }));

    timeIndicatorTests();
  });

  describe('with 2 channels with time slots', () => {
    beforeEach(() => setupComponent({
      children: [
        <TimeLine name="Dave" key="Dave">
          <TimeSlot
            start={new Date('1/1/99 13:30')}
            end={new Date('1/1/99 14:00')}
          >
            <Show title="Top Gear" />
          </TimeSlot>
        </TimeLine>,
        <TimeLine name="UKTV" key="UKTV">
          <TimeSlot
            start={new Date('1/1/99 13:45')}
            end={new Date('1/1/99 14:45')}
          >
            <Show title="Graeme" />
          </TimeSlot>
        </TimeLine>
      ]
    }));

    timeIndicatorTests();

    it('does not add time slots to older channel time slots', () => {
      const timeSlots = component.find(TimeLine).at(0).find(TimeSlot);
      expect(timeSlots).toHaveLength(1);
    });

    it('fills in missing time slots', () => {
      const timeSlots = component.find(TimeLine).at(1).find(TimeSlot);
      expect(timeSlots).toHaveLength(2);
      expect(timeSlots.at(0)).toHaveProp('start', new Date('1/1/99 13:30'));
      expect(timeSlots.at(0)).toHaveProp('end', new Date('1/1/99 13:45'));
      expect(timeSlots.at(1)).toHaveProp('start', new Date('1/1/99 13:45'));
      expect(timeSlots.at(1)).toHaveProp('end', new Date('1/1/99 14:45'));
    });
  });

  describe('basic structure', () => {
    beforeEach(setupComponent);

    it('renders a table', () => {
      expect(component.children()).toHaveLength(1);
      expect(table()).toHaveLength(1);
    });

    it('renders a thead', () => {
      expect(thead()).toHaveLength(1);
    });

    it('renders a tbody', () => {
      expect(tbody()).toHaveLength(1);
    });

    it('renders a row in the thead', () => {
      expect(headTr()).toHaveLength(1);
    });

    it('renders a th in the row in the thead', () => {
      expect(th()).toHaveLength(1);
    });
  });
});
