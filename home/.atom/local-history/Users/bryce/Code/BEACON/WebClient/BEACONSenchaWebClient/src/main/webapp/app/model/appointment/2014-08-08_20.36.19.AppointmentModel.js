/**
 * Appointment data.
 */
Ext.define('Beacon.model.appointment.AppointmentModel', {
  extend: 'Beacon.model.cases.CasesCompleteModel',

  sortConvertFields: function(f1, f2) {
    return 0;
  },

  requires: [
    'Utils.Domain'
  ],

  codeMap: {},

  config: {
    idProperty: 'appointmentId',

    fields: [{
      name: 'appointmentId',
      mapping: 'caseId',
      type: 'int',
      persist: false
    }, {
      name: 'sapId',
      mapping: 'customerId',
      type: 'string'
    }, {
      name: 'datesSameDate',
      type: 'boolean',
      convert: function(value, record) {
        if (record && record.raw) {
          var startDate = record.raw.scheduledStart;
          var endDate = record.raw.scheduledEnd;

          if (!Ext.isDate(startDate)) {
            startDate = new Date(startDate);
          }

          if (!Ext.isDate(endDate)) {
            endDate = new Date(endDate);
          }

          var endDateExclusive = new Date(endDate.setSeconds(-1));

          return (startDate.getFullYear() === endDateExclusive.getFullYear()) &&
            (startDate.getMonth() === endDateExclusive.getMonth()) &&
            (startDate.getDate() === endDateExclusive.getDate());
        }
        return false;
      }
    }, {
      name: 'scheduledStartDate',
      type: 'date',
      persist: false,
      convert: function(value, record) {

        var dateValue, newValue = "",
          myDateShortFormat = "m/d/Y";

        if (record.data) {
          dateValue = record.data.scheduledStart;

          if (dateValue) {
            var year = dateValue.getUTCFullYear();
            var month = dateValue.getUTCMonth();
            var day = dateValue.getUTCDate();
            var hours = dateValue.getUTCHours();

            newValue = new Date(year, month, day, hours);

            //TODO: revert back to calling Utils.Format.formatDateShort
            //      in Format.js once issues are worked out. As of 1.21.2014,
            //      the shortDateFormat is still being set to m/d/y (2-digit year)
            return Ext.Date.format(newValue, myDateShortFormat);
            //return Utils.Format.formatDateShort(newValue);
          }
        }
        return value;
      }
    }, {
      name: 'scheduledStartTime',
      type: 'date',
      persist: false,
      convert: function(value, record) {
        var dateValue;
        if (record.data) {
          dateValue = record.data.scheduledStart;
          if (dateValue) {
            return Ext.Date.format(dateValue, 'H:i');
          }
        }
        return value;
      }
    }, {
      name: 'scheduledEndDate',
      type: 'date',
      persist: false,
      convert: function(value, record) {
        var dateValue, newValue = "",
          myDateShortFormat = "m/d/Y";

        if (record.data) {
          dateValue = record.data.scheduledEnd;

          if (dateValue) {
            var year = dateValue.getUTCFullYear();
            var month = dateValue.getUTCMonth();
            var day = dateValue.getUTCDate();
            var hours = dateValue.getUTCHours();

            newValue = new Date(year, month, day, hours);

            //TODO: revert back to calling Utils.Format.formatDateShort
            //      in Format.js once issues are worked out. As of 1.21.2014,
            //      the shortDateFormat is still being set to m/d/y (2-digit year)
            return Ext.Date.format(newValue, myDateShortFormat);
            //return Utils.Format.formatDateShort(newValue);
          }
        }
        return value;
      }
    }, {
      name: 'scheduledEndTime',
      type: 'date',
      persist: false,
      convert: function(value, record) {
        var dateValue;
        if (record.data) {
          dateValue = record.data.scheduledEnd;
          if (dateValue) {
            return Ext.Date.format(dateValue, 'H:i');
          }
        }
        return value;
      }
    }, {
      name: 'method',
      mapping: 'codeModels',
      convert: function(value, record) {
        var commMethod = record.parseCode(value, 'COMMUNICATION_METHOD');
        return commMethod;
      }
    }],

    proxy: {
      type: 'rest',
      url: '/beacon/api/sales/appointment/',
      reader: {
        type: 'json',
        rootProperty: 'data.appointmentModel',
        successProperty: 'success'
      },
      writer: {
        encodeRequest: false,
        type: 'beacon'
      }
    }
  },

  toString: function() {
    return "AppointmentModel[" + this.get('appointmentId') + "]";
  },

  populateCodes: function() {
    var me = this,
      caseType = this.get('caseType');

    this.callParent(arguments);

    if (caseType && caseType.caseCodeModels()) {
      caseType.caseCodeModels().each(function(code) {
        me.addCode(code);
      }, this);
    }
  },

  validate: function() {
    var errors = this.callParent(arguments);

    if (!this.get('reason')) {
      errors.add(Ext.create('Ext.data.Error', {
        field: 'reason',
        message: '${TaskSummaryModel.valObjective}'
      }));
    }

    if (!this.get('COMMUNICATION_METHOD')) {
      errors.add(Ext.create('Ext.data.Error', {
        field: 'method',
        message: 'Method is required'
      }));
    }


    if (!this.get('scheduledStart')) {
      errors.add(Ext.create('Ext.data.Error', {
        field: 'scheduledStart',
        message: '${AppointmentModel.valScheduledStart}'
      }));
    }


    if (!this.get('scheduledEnd')) {
      errors.add(Ext.create('Ext.data.Error', {
        field: 'scheduledEnd',
        message: '${AppointmentModel.valScheduledEnd}'
      }));
    }

    //log.debug("errors", errors);

    return errors;
  }
});
