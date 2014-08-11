/**
 * AppointmentEditView
 */
Ext.define('Beacon.view.appointment.AppointmentEditView', {
    extend: 'Beacon.view.base.AbstractEditSheet',
    xtype: 'appointmenteditview',
    requires: [
        'Utils.Format',
        'Ext.form.FieldSet'
    ],

    config: {
        theCase: undefined,
        theAppointment: undefined,

        control: {
            'combo': {
                'change': 'fireChange'
            }
        }
    },

    autoScroll: true,
    border: false,
    margin: '20px 30px 20px 20px',

    fieldDefaults: {
        labelAlign: 'top',
        msgTarget: 'side',
        labelStyle: 'font-weight:bold',
        bubbleEvents: ['change']
    },

    items: [
        {
            xtype: 'fieldset',
            padding: 20,
            itemId: 'practiceSearchSet',
            hidden: true,
            items: [
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        align: 'bottom'
                    },
                    items: [
                        {
                            xtype: 'bncombo',
                            width: '50%',
                            grow: true,
                            name: 'practiceSelect',
                            itemId: 'practiceSelect',
                            editable: true,
                            pageSize: 25,
                            queryParam: 'resultsFilter',
                            queryMode: 'remote',
                            forceSelection: true,
                            displayField: 'displayName',
                            valueField: 'sapId',
                            fieldLabel: '${Practice.practice}',
                            emptyText: "${General.select}"
                        }
                    ]
                }
            ]
        },
          {
            name: 'appointmentFormContainer',
            layout: {
              type: 'hbox',
              align: 'stretch'
            },
            items: [
              {
                flex: 2,
                layout: {
                  type: 'vbox',
                  align: 'stretch'
                },
                items: [
                {
                    xtype: 'container',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'bncombo',
                            flex: 1,
                            autoDestroyStore: true,
                            name: 'communication_method',
                            field: 'communication_method',
                            isCode: true,
                            codeType: 'COMMUNICATION_METHOD',
                            displayField: 'displayName',
                            valueField: 'codeId',
                            required: true,
                            allowBlank: false,
                            changing: false,
                            fieldLabel: 'Method',
                            emptyText: '${General.select}'
                        },
                        {
                            xtype: 'bncombo',
                            flex: 1,
                            autoDestroyStore: true,
                            name: 'reason',
                            field: 'reason',
                            isCode: true,
                            codeType: 'REASON',
                            displayField: 'displayName',
                            valueField: 'codeId',
                            required: true,
                            allowBlank: false,
                            changing: false,
                            fieldLabel: 'Objective',
                            emptyText: '${General.select}'
                        }
                    ]
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'bncombo',
                            multiSelect: true,
                            flex: 1,
                            //autoDestroyStore: true,
                            field: 'invitees',
                            name: 'invitees',
                            displayField: 'displayName',
                            valueField: 'inviteeId',
                            searchFields: [ 'displayName' ],
                            showSearch: true,
                            //editable: true,
                            delimiter: '; ',
                            fieldLabel: 'Invitees',
                            emptyText: '${General.select}'
                        }
                        /*
                        {
                            xtype: 'button',
                            text: 'Add Invitee',
                            action: 'addInvitee',
                            align: 'right'
                        },
                        */
                    ]
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'bncombo',
                            multiSelect: true,
                            flex: 1,
                            field: 'contacts',
                            name: 'contacts',
                            displayField: 'displayName',
                            valueField: 'contactId',
                            searchFields: [ 'displayName' ],
                            showSearch: true,
                            delimiter: '; ',
                            fieldLabel: 'Contacts',
                            emptyText: '${General.select}'
                        }
                    ]
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    items: [
                        {
                            name: 'location',
                            flex: 1,
                            xtype: 'textfield',
                            fieldLabel: 'Location',
                            field: 'location'
                        }
                    ]
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'datefield',
                            flex: 1,
                            required: true,
                            name: 'scheduledStartDate',
                            field: 'scheduledStartDate',
                            fieldLabel: 'Start Date',
                            emptyText: '${General.select}',
                            listeners: {
                                'change': function (select, newValue, oldValue) {
                                    //log.debug('scheduledStartDate listener fired');
                                    var editView = select.up('appointmenteditview');
                                    var retArr = editView.validateDates();
                                    if (retArr) {
                                        var isDateError = retArr[0];
                                        if (isDateError.isError === true) {
                                            Ext.Msg.show({
                                                title: isDateError.title,
                                                msg: isDateError.message,
                                                buttons: Ext.Msg.OK
                                            });
                                            this.setValue(oldValue);
                                        }
                                    }
                                }
                            }
                        },
                        {
                            xtype: 'timefield',
                            name: 'scheduledStartTime',
                            field: 'scheduledStartTime',
                            minValue: '00:00',
                            maxValue: '23:59',
                            increment: 15,
                            fieldLabel: 'Start Time',
                            emptyText: '${General.select}',
                            listeners: {
                                'change': function (select, newValue, oldValue) {
                                    //log.debug('scheduledStartTime listener fired');
                                    var editView = select.up('appointmenteditview');
                                    var retArr = editView.validateDates();
                                    if (retArr) {
                                        var isDateError = retArr[0];
                                        if (isDateError.isError === true) {
                                            Ext.Msg.show({
                                                title: isDateError.title,
                                                msg: isDateError.message,
                                                buttons: Ext.Msg.OK
                                            });
                                            this.setValue(oldValue);
                                        }
                                    }
                                }
                            }
                         },
                        {
                            xtype: 'datefield',
                            flex: 1,
                            required: true,
                            name: 'scheduledEndDate',
                            field: 'scheduledEndDate',
                            fieldLabel: 'End Date',
                            emptyText: '${General.select}',
                            listeners: {
                                'change': function (select, newValue, oldValue) {
                                    //log.debug('scheduledEndDate listener fired');
                                    var editView = select.up('appointmenteditview');
                                    var retArr = editView.validateDates();
                                    if (retArr) {
                                        var isDateError = retArr[0];
                                        if (isDateError.isError === true) {
                                            Ext.Msg.show({
                                                title: isDateError.title,
                                                msg: isDateError.message,
                                                buttons: Ext.Msg.OK
                                            });
                                            this.setValue(oldValue);
                                        }
                                    }
                                }
                            }
                        },
                        {
                            xtype: 'timefield',
                            name: 'scheduledEndTime',
                            field: 'scheduledEndTime',
                            minValue: '00:00',
                            maxValue: '23:59',
                            increment: 15,
                            fieldLabel: 'End Time',
                            emptyText: '${General.select}',
                            listeners: {
                                'change': function (select, newValue, oldValue) {
                                    //log.debug('scheduledEndTime listener fired');
                                    var editView = select.up('appointmenteditview');
                                    var retArr = editView.validateDates();
                                    if (retArr) {
                                        var isDateError = retArr[0];
                                        if (isDateError.isError === true) {
                                            Ext.Msg.show({
                                                title: isDateError.title,
                                                msg: isDateError.message,
                                                buttons: Ext.Msg.OK
                                            });
                                            this.setValue(oldValue);
                                        }
                                    }
                                }
                            }
                        }
                    ]
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'checkboxfield',
                            name: 'allDayEventInd',
                            field: 'allDayEventInd',
                            fieldLabel: '${AppointmentEditView.allDayEvent}',
                            listeners: {
                                'change': function (select, newValue, oldValue) {
                                    var editView = select.up('appointmenteditview');
                                    editView.toggleAllDayEvent(newValue);
                                }
                            }
                        }
                    ]
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'bncombo',
                            flex: 1,
                            multiSelect: true,
                            field: 'productsList',
                            'useFilterField' : true,
                            name: 'productsList',
                            displayField: 'displayName',
                            valueField: 'codeId',
                            searchFields: [ 'displayName' ],
                            showSearch: true,
                            fieldLabel: 'Products',
                            emptyText: '${General.select}'
                        }
                    ]
                }
                ]
              }
            ]

        }, {
            xtype: 'fieldset',
			title: 'Notes', //${Appointment.notes}
			anchor: '98%',
            items: [
                {
                    xtype: 'textareafield',
                    //fieldLabel: 'Notes',
                    name: 'description',
                    anchor: '100%'
                }
            ]
        }, {
            xtype: 'container',
            name: 'dateInfo',
			anchor: '98%',
            tpl: Ext.create('Ext.XTemplate',
                '<tpl for="."><div class="audit" style="font-size:12px">Created On: {createdOn:this.formatDate} By: {createdBy:this.formatUser}</div>',
                '<tpl if="updatedOn"><div class="audit" style="font-size:12px">Updated On: {updatedOn:this.formatDate} By: {updatedBy:this.formatUser}</div></tpl></tpl>',
                {
                    formatDate: function(d) {
                        return Utils.Format.formatDate(d);
                    },
                    formatUser: function(value) {
                        return Beacon.model.domain.user.AppUserSummaryModel.toDisplayString(value);
                    }
                }
            )
        }
    ],


    setTheAppointment: function(theAppointment) {
        if (!theAppointment) {
            return;
        }

        this.theAppointment = theAppointment;
        this.codeModel = theAppointment.codeModels();

        this.applyTheAppointment(theAppointment);
    },

    applyTheAppointment: function(theAppointment){
        //log.debug("applyTheAppointment");
        this.theAppointment = theAppointment;

        Utils.Binding.unbind(this);

        if (!theAppointment) {
            return theAppointment;
        }

        theAppointment.getData(true);

        var contactsStore = Bn.getInstance('DomainContactsStore'),
            //salesTeamStore = Bn.getInstance('DomainSalesTeamStore'),
            inviteesStore = Bn.getInstance('DomainAppointmentInviteeStore'),
            productsStore = Bn.getInstance('DomainOpportunityProductsStore');

        //this.down('[field=method]').bindStore(formData.methodCodesStore);
        this.down('[field=communication_method]').setValue(theAppointment.data.method);

        //this.down('[field=reason]').bindStore(formData.objectiveCodesStore);
        this.down('[field=reason]').setValue(theAppointment.data.reason);

        this.down('[field=contacts]').bindStore(contactsStore);
        this.down('[field=contacts]').setValue(theAppointment.contacts());

        var inviteeStoreCopy = Ext.create('Beacon.store.appointment.InviteeStore');
        var records = [];
        inviteesStore.each(function(r){
            if (r.get('appUser').get('activeDirectorySID') !== null){
                if (r.data.appUser) {
                    r.data.inviteeId = r.data.appUser.internalId;
                }
                records.push(r.copy());
            }
        });
        inviteeStoreCopy.add(records);
        this.down('[field=invitees]').bindStore(inviteeStoreCopy);
        var inviteeArr = [];
        theAppointment.invitees().each(function (r) {
           inviteeStoreCopy.each(function (s) {
               if (r.data.appUser !== null) {
                   if (r.data.appUser.data.appUserId === s.data.appUser.data.appUserId) {
                       if (!Ext.Array.contains(inviteeArr, s)) {
                        inviteeArr.push(s);
                       }
                   }
               }
           });
        });
        this.down('[field=invitees]').setValue(inviteeArr);

        this.down('[field=productsList]').bindStore(productsStore);
        this.down('[field=productsList]').setValue(theAppointment.products());

        var scheduledStartDate = theAppointment.data.scheduledStartDate;
        var scheduledEndDate = theAppointment.data.scheduledEndDate;

        this.scheduledStartDate = scheduledStartDate;
        this.scheduledEndDate = scheduledEndDate;

        var scheduledStartTime = theAppointment.data.scheduledStartTime;
        var scheduledEndTime = theAppointment.data.scheduledEndTime;

        this.scheduledStartTime = scheduledStartTime;
        this.scheduledEndTime = scheduledEndTime;

        if (scheduledStartDate.length > 0) {
            this.down('[field=scheduledStartDate]').setValue(scheduledStartDate);
        }
        
        if (scheduledEndDate.length > 0) {
            this.down('[field=scheduledEndDate]').setValue(scheduledEndDate);
        }
        if (scheduledStartTime.length > 0) {
            this.down('[field=scheduledStartTime]').setValue(scheduledStartTime);
        }
        if (scheduledEndTime.length > 0) {
            this.down('[field=scheduledEndTime]').setValue(scheduledEndTime);
        }

        var allDayEvent = false; //unless we intercept an incoming valid value...
        if (theAppointment.data.allDayEventInd) {
            allDayEvent = true;
        }
        this.down('[field=allDayEventInd]').setValue(allDayEvent);

        this.down('component[name=location]').setValue(theAppointment.data.location);

        this.down('component[name=description]').setValue(theAppointment.data.description);

        this.down('component[name=dateInfo]').update(theAppointment.data);

        this.isUpdating = false;

        Utils.Binding.bind(theAppointment, this);

        return theAppointment;

    },

    getAppointment: function() {
        return this.theAppointment;
    },

    updateRecord: function(newAppointment, oldAppointment) {
        //log.debug("updateRecord: "+newAppointment+", "+oldAppointment);

        var me = this;

        if (oldAppointment) {
            oldAppointment.un('change', 'modelChanged');
        }

        if (newAppointment) {
            newAppointment.on('change', 'modelChanged', me);
        }
    },

    loadRecord: function(record) {
        //log.debug("applyRecord: "+record);
        this.callParent(arguments);
        this.setTheAppointment(record);

    },

    modelChanged: function(fieldName, newValue, oldValue) {
        //log.debug("modelChanged: fieldName="+fieldName+", newValue="+newValue);
        if (fieldName) {
            var field = this.down('[name='+fieldName+']');
            if (field && field.getValue() !== newValue) {
                log.debug("Field should be updated!  newValue="+newValue+", oldValue="+oldValue, newValue, oldValue);
            }
        }
    },

    setFormData: function(formData) {
        //log.debug("setFormData");
    },

    cancelEdit: function() {
        Utils.Binding.unbind(this);
    },

   showPracticeSearch: function(show) {
       var practiceSet = this.down('#practiceSearchSet');

      if(show) {
          var practiceCombo = this.down('#practiceSelect');

          // Create a non-buffered instance of accounts store so it doesn't mess with
      // My Accounts portlet and works with combo box.
	  var accountStore = Ext.create('Beacon.store.account.MyAccountsStore', { buffered: false });
	  practiceCombo.bindStore(accountStore);

          this.enableForm(false);
          practiceSet.setVisible(show);
      }
   },

    enableForm: function(enable) {
        var fieldSets = this.query('[name=appointmentFormContainer]'),
            practiceSet = this.down('#practiceSearchSet');

        if (enable === false) {
            Ext.each(fieldSets, function(fieldset) {
                fieldset.disable();
            });

            this.up('worksheet').enableSave(false);
            practiceSet.enable(true);
        } else {
            Ext.each(fieldSets, function(fieldset) {
                fieldset.enable();
            });
            this.up('worksheet').enableSave(true);
        }
    },

    toggleAllDayEvent: function(toggle) {

        var me = this;

        var startTime = me.down('[field=scheduledStartTime]');
        var endTime = me.down('[field=scheduledEndTime]');

        if(toggle) {
            startTime.hide();
            endTime.hide();
        } else {
            startTime.show();
            endTime.show();
        }
    },

    validateDates: function() {

        var me = this,
            foundError = false,
            retMsgArr = [],
            retMsg = "", retMsgTitle = "",
            hasStartDate = false, hasEndDate = false,
            hasStartTime = false, hasEndTime = false;

        var startDate = me.down('[field=scheduledStartDate]');
        var endDate = me.down('[field=scheduledEndDate]');

        var startDateDate = null;
        if (startDate.value) {
            startDateDate = startDate.value.getDate();
            if (startDateDate > -1) {
               hasStartDate = true;
            }
        }

        var endDateDate = null;
        if (endDate.value) {
            endDateDate = endDate.value.getDate();
            if (endDateDate > -1) {
                hasEndDate = true;
            }
        }

        var startTime = me.down('[field=scheduledStartTime]');
        var endTime = me.down('[field=scheduledEndTime]');

        var startTimeHours = null;
        if (startTime.value) {
            startTimeHours = startTime.value.getHours();
            if (startTimeHours > -1) {
                hasStartTime = true;
            }
        }
        var endTimeHours = null;

        if (endTime.value) {
            endTimeHours = endTime.value.getHours();
            if (endTimeHours > -1) {
                hasEndTime = true;
            }
        }

        var allDayEvent = me.down('[name=allDayEventInd]').value;

        if (!allDayEvent) {
            if (hasStartTime && hasStartDate) {
                startDate.value.setHours(startTime.value.getHours());
                startDate.value.setMinutes(startTime.value.getMinutes());
            }
            if (hasEndTime && hasEndDate) {
                endDate.value.setHours(endTime.value.getHours());
                endDate.value.setMinutes(endTime.value.getMinutes());
            }
        }

        //only if we have valid date and time fields across the board do we
        //evaluate - we can have invalid combinations when the form is first built.
        var bypassFurtherChecks = false;
        if (hasStartDate && hasStartTime && hasEndDate && hasEndTime) {
            if (endDate.value < startDate.value) {
                //log.debug(">>>>> need to advance either end time or both end date and time...");
                //advance the end date by 1/2 hour out from the start date's time:
                var newEndTime = new Date(startTime.value.getTime() + 30 * 60000);
                this.down('[field=scheduledEndTime]').setValue(newEndTime);
                endDate.value.setHours(newEndTime.getHours());
                endDate.value.setMinutes(newEndTime.getMinutes());
                //inspect to see if we are dealing with "today" or a date in the future (irrespective of the time component):
                if (startDate.value.getTime() > endDate.value.getTime()) {
                    //the actual start date chosen is greater than end date - so advance the end date to the start date
                    endDate.value.setDate(startDate.value.getDate());
                    endDate.value.setMonth(startDate.value.getMonth());
                    endDate.value.setFullYear(startDate.value.getFullYear());
                    this.down('[field=scheduledEndDate]').setValue(startDate.value); //the chosen start date
                    bypassFurtherChecks = true;
                }
            }
            if ( !bypassFurtherChecks && (startDate.value > endDate.value)) {
                retMsg = "Start date must be less than end date";
                retMsgTitle = "Invalid Start Date";
                foundError = true;
            }
        }

        if (foundError) {
            retMsgArr.push({
                'isError' : true,
                'title' : retMsgTitle,
                'message' : retMsg
            });
        } else {
            retMsgArr.push({
                'isError' : false
            });
        }

        return retMsgArr;

    }

});
