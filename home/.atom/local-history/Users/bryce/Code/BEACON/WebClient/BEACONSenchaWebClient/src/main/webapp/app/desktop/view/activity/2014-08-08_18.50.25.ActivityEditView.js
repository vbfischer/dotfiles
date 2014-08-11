/**
 * ActivityEditView
 */
Ext.define('Beacon.view.activity.ActivityEditView', {
  extend: 'Ext.panel.Panel',
  alias: 'widget.activityedit',

  requires: [
    'Beacon.model.domain.sales.SalesTeamModel',
    'Beacon.model.domain.code.CodeModel',
    'Beacon.model.domain.user.AppUserSummaryModel',
    'Beacon.model.domain.distributor.DSRRepModel',
    'Beacon.model.domain.status.StatusModel',
    'Beacon.view.activity.ActivityEditTopicFormPanel',
    'Beacon.view.search.PracticeSearchView'
  ],

  config: {
    record: undefined,
    theCase: undefined,

    control: {
      'combo': {
        'change': 'fireChange'
      }
    }
  },
  autoScroll: true,
  border: false,

  layout: {
    type: 'vbox',
    align: 'stretch'
  },
  items: [{
    xtype: 'form',
    fieldDefaults: {
      labelAlign: 'top',
      msgTarget: 'side',
      bubbleEvents: ['change'],
      margins: '0px 10px 5px 10px'
    },
    items: [{
      xtype: 'practicesearchview'
    }, {
      xtype: 'fieldset',
      layout: {
        type: 'vbox',
        align: 'stretch'
      },
      items: [{
        xtype: 'container',
        layout: {
          type: 'hbox',
          align: 'stretch'
        },
        items: [{
          xtype: 'bncombo',
          flex: 1,
          autoDestroyStore: true,
          name: 'REASON',
          field: 'reason',
          isCode: true,
          codeType: 'REASON',
          displayField: 'displayName',
          valueField: 'codeId',
          required: true,
          fieldLabel: '${Activity.activity}',
          emptyText: "${General.select}"
        }, {
          xtype: 'bncombo',
          flex: 1,
          autoDestroyStore: true,
          name: 'COMMUNICATION_METHOD',
          field: 'communication_method',
          isCode: true,
          codeType: 'COMMUNICATION_METHOD',
          displayField: 'displayName',
          valueField: 'codeId',
          required: true,
          fieldLabel: '${Activity.method}',
          emptyText: "${General.select}"
        }, {
          flex: 1,
          name: 'actualStart',
          xtype: 'datefield',
          value: new Date(),
          fieldLabel: '${Activity.activityDate}',
          emptyText: "${General.select}"
        }, {
          flex: 1,
          xtype: 'bncombo',
          autoDestroyStore: true,
          name: 'billableMinutes',
          field: 'billableMinutes',
          valueField: 'value',
          displayField: 'text',
          required: true,
          fieldLabel: '${Activity.duration}',
          emptyText: "${General.select}"
        }]
      }, {
        xtype: 'container',
        layout: 'column',
        defaults: {
          margin: '0px 10px 5px 10px'
        },
        items: [{
          flex: 1,
          columnWidth: 0.25,
          grow: true,
          growToLongestValue: false,
          xtype: 'bncombo',
          autoDestroyStore: true,
          name: 'RIDE_WITH_TYPE',
          field: 'rideWith',
          codeType: 'RIDE_WITH_TYPE',
          isCode: true,
          displayField: 'displayName',
          valueField: 'codeId',
          changing: false,
          fieldLabel: '${Activity.rideWith}',
          emptyText: "${General.select}"
        }, {
          // Distributor Company
          xtype: 'bncombo',
          name: 'DSR',
          field: 'dsr',
          dsrField: true,
          hidden: true,
          //hideMode: 'visibility',
          hideMode: 'offsets',
          codeType: 'DSR',
          isCode: true,
          columnWidth: 0.25,
          autoDestroyStore: true,
          displayField: 'displayName',
          valueField: 'codeId',
          fieldLabel: 'Distributor',
          emptyText: "Select..."
        }, {
          // Distributor Company Rep
          name: 'distributorRepModel',
          xtype: 'bncombo',
          dsrRepField: true,
          hidden: true,
          hideMode: 'offsets',
          //hideMode: 'visibility',
          columnWidth: 0.25,
          displayField: 'customerLastFirstName',
          valueField: 'customerId',
          showSearch: true,
          searchFields: ['customerLastFirstName'],
          fieldLabel: 'Rep',
          emptyText: "Select...",
          store: Ext.create("Ext.data.Store", {
            model: "Beacon.model.domain.distributor.DSRRepModel"
          })
        }]
      }]
    }]
  }, {
    xtype: 'container',
    items: [{
        xtype: 'container',
        name: 'topics'
      }, {
        xtype: 'container',
        layout: {
          type: 'hbox',
          pack: 'left'
        },
        items: [{
          xtype: 'button',
          itemId: 'addActivityTopicButton',
          action: 'addTopic',
          text: 'Add Topic',
          iconCls: 'fa fa-plus',
          iconMask: true
        }]
      }

    ]
  }, {
    xtype: 'container',
    name: 'headerInfo',
    tpl: Ext.create('Bn.XTemplate',
      '{[this.getAuditInfo(values)]}', {
        getAuditInfo: function(values) {
          var auditInfo = '';
          if (values.createdOn) {
            auditInfo += '<div class="audit" style="font-size:12px">';
            auditInfo += Bundle.getMsg('General.createdOnMsg', this.formatDate(
              values.createdOn), this.formatUser(values.createdBy));
            auditInfo += '</div>';
          }
          if (values.updatedOn) {
            auditInfo += '<div class="audit" style="font-size:12px">';
            auditInfo += Bundle.getMsg('General.updatedOnMsg', this.formatDate(
              values.updatedOn), this.formatUser(values.updatedBy));
            auditInfo += '</div></tpl></tpl>';
          }

          return auditInfo;
        },
        formatDate: function(d) {
          return Utils.Format.formatDate(d);
        },
        formatUser: function(value) {
          return Beacon.model.domain.user.AppUserSummaryModel.toDisplayString(
            value);
        }
      })
  }],

  addTopic: function(topic) {
    var topicsPanel = this.getTopicPanel();

    var topicForm = topicsPanel.add({
      xtype: 'activityedittopicformpanel'
    });
    topicForm.setTopic(topic, this.getRecord());
    topicForm.showDelete(false);
  },

  setDurationList: function(durationList) {
    this.down('bncombo[name=billableMinutes]').bindStore(durationList);
  },

  getTopicForms: function() {
    return this.query('activityedittopicformpanel');
  },

  getTopicPanel: function() {
    return this.down('container[name=topics]');
  },

  updateRecord: function(record) {
    this.setTheCase(record);
    return record;
  },

  updateTheCase: function(theCase) {
    this.theCase = theCase;

    if (!theCase) {
      return theCase;
    }

    var data = theCase.getData(true);

    this.down('component[name=headerInfo]').update(data);

    this.isUpdating = false;
    var activityForm = this.down('form');
    activityForm.loadRecord(theCase);

    this.down("[name=distributorRepModel]").setValue(theCase.data.distributorRepModel);

    if (theCase.get('caseType') && theCase.get('caseType').get('caseTypeId') ===
      CaseType.FTS_SALES_ACTIVITY.get('caseTypeId')) {
      this.down("[name=REASON]").setFieldLabel(Bundle.getMsg(
        'ActivityReadOnlyView.reasonForVisit'));
    } else {
      this.down("[name=REASON]").setFieldLabel(Bundle.getMsg(
        'Activity.activity'));
    }

    return theCase;
  },

  getCase: function() {
    return this.getRecord();
  },

  constructor: function(args) {
    this.callParent(arguments);
    if (args.act) {
      this.setCase(args.act);
    }

    this.getControl();

  },

  getManagedCodeFields: function() {
    var managedCodeFields = this.query("bncombo[isCode=true]");
    return managedCodeFields;
  },

  applyControl: function(selectors) {
    log.debug("applyControl: selectors=", selectors);

    var me = this;

    me.eventbus = Ext.app.EventBus;
    me.eventbus.control(selectors, me);
    return selectors;
  },

  fireChange: function(field, newValue, oldValue, options) {
    log.debug("fireChange: " + arguments, arguments);
    this.fireEvent('change', this, field, newValue);
  },

  showPracticeSearch: function(show) {
    var me = this,
      practiceSet = this.down('practicesearchview');

    if (show) {
      practiceSet.initPracticeSearch()
      me.mon(practiceSet, 'practiceSelected', function() {me.enableForm(true)});
    }

    me.enableForm(false);
    practiceSet.setVisible(show);
  },

  enableForm: function(enable) {
    var fieldSets = this.query('fieldset'),
      practiceSet = this.down('practicesearchview'),
      addTopicButton = this.up('worksheet').query('#addActivityTopicButton')[0];

    if (enable === false) {
      Ext.each(fieldSets, function(fieldset) {
        fieldset.disable();
      });

      Ext.each(this.up('worksheet').query("button[action=save]"), function(
        saveBtn) {
        saveBtn.setDisabled(true);
      });
      if (addTopicButton) {
          addTopicButton.setDisabled(true);
      }
      practiceSet.enable(true);
    } else {
      Ext.each(fieldSets, function(fieldset) {
        fieldset.enable();
      });

      Ext.each(this.up('worksheet').query("button[action=save]"), function(
        saveBtn) {
        saveBtn.setDisabled(false);
      });
      if (addTopicButton) {
        addTopicButton.setDisabled(false);
      }
    }
  },
  setDistributorReps: function(reps) {
    var dsrRepField = this.down('bncombo[name=distributorRepModel]');
    if (reps) {
      dsrRepField.getStore().setData(reps);
    }
    dsrRepField.setValue(null);
    dsrRepField.setHidden(!(reps && reps.length > 0));
  },

  showDSRFields: function(showFields) {
    var dsrFields = this.query('[dsrField=true]');
    Ext.Array.each(dsrFields, function(field) {
      field.setVisible(showFields);
    });
  },

  showDSRRepFields: function(showFields) {
    var dsrRepFields = this.query('[dsrRepField=true]');
    Ext.Array.each(dsrRepFields, function(field) {
      field.setVisible(showFields);
    });
  },

  setFirstTopicReason: function(reasonCode) {
    var topicEdit = this.down('activityedittopicformpanel'); // Find first topic edit form
    if (topicEdit) {
      var firstTopicReason = topicEdit.down('bncombo[field=topicReason]');
      if (firstTopicReason) {
        firstTopicReason.setValue(reasonCode);
      } else {
        firstTopicReason = topicEdit.down('bncombo[field=ftsTopicReason]');
        firstTopicReason.setValue(reasonCode);
      }
    }
  },

  getForm: function() {
    return this.down('form');
  }

});
