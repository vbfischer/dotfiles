/**
 * Controller for Appointments.
 *
 * @class
 * @param
 * @mixes Beacon.custom.mixin.BnWorksheetControl
 */
Ext.define('Beacon.controller.appointment.AppointmentController', {
  extend: 'Beacon.controller.base.BnController',

  requires: [
    'Beacon.manager.case.CaseFactoryManager',

    /*
     * Views
     */
    'Beacon.view.practice.appointment.PracticeAppointmentListView',
    'Beacon.view.appointment.worksheet.AppointmentWorksheetView',
    'Beacon.view.calendar.CalendarPanel',
    'Beacon.view.calendar.CalendarListPanel',
    'Beacon.view.calendar.view.Week',
    'Beacon.view.practice.appointment.PracticeCalendarView',
    /*
     * Models
     */
    'Beacon.model.appointment.AppointmentListModel',
    'Beacon.model.appointment.AppointmentFormModel',
    'Beacon.model.appointment.InviteeModel',

    /*
     * Stores
     */
    'Beacon.store.appointment.AppointmentListStore',
    'Beacon.store.domain.appointment.AppointmentInviteeStore',
    'Beacon.store.appointment.InviteeStore',

    /*
     * Other
     */
    'Utils.Format'

  ],

  mixins: ['Beacon.custom.mixin.BnWorksheetControl'],

  config: {
    refs: [{
      ref: 'salesPortal',
      selector: 'saleshome'
    }],
    routes: {
      'practice/:sapId/appointments/': 'routeView',
      'practice/:sapId/appointments/appointment/:id': 'routeView'
    },
    before: {
      'routeView': 'authenticate'
    }
  },

  /**
   * Initialization of the controller
   *
   * @param
   * @returns
   */
  init: function() {
    var me = this;

    window.AppointmentController = this;

    this.control({
      'tasksportlet': {
        itemdblclick: 'itemClicked'
      },
      'practiceappointmentlistview': {
        itemdblclick: 'onAppointmentClicked'
      },
      '[itemId=PracticeAppointments]': {
        init: 'onCalendarInit'
      },

      'appointmentworksheetview': {
        beforeclose: 'beforeClose', //Use BnWorksheetControl.beforeClose mixin
        cancel: 'cancelEdit', //Use BnWorksheetControl.cancelEdit mixin
        edit: 'onEdit', //TODO: Need to make this generic across all forms...
        save: 'saveRecord', //Use BnWorksheetControl.saveRecord mixin
        close: 'onClose',
        deleteAppointment: 'onDelete'
      },

      'extensiblecalendarpanel': {
        createActivity: 'onCreateActivity'
      },

      'appointmenteditview combo[name=practiceSelect]': {
        change: 'practiceSelected'
      }

    });

    this.listen({
      controller: {
        // Works, but do we need to be so specific?
        //'#practice.PracticeViewController': {
        '*': {
          showPortalAppointment: 'showAppointment',
          showPracticeAppointments: 'showPracticeAppointments',
          showAppointment: 'showAppointment',
          createAppointment: 'onCreateAppointment'
        }
      }
    });

    Beacon.app.on('createAppAppointment', me.onCreateAppAppointment, me);

    WorkbookManager.registerWorksheetConfig('appointment', {
      xtype: 'appointmentworksheetview'
    });
  },

  onCreateActivity: function(calendarItem) {
    if(!calendarItem) {
      return;
    }

    var caseId = calendarItem.get('CaseId');
    Beacon.app.fireEvent('createActivityFromCase', caseId)
  },

  onClose: function() {
    var me = this,
        currentHash = window.location.hash,
        newHash,
        hasMatch;

    if(Ext.String.startsWith(currentHash, "#practice")) {
      hasMatch = currentHash.match(/(?!#).*appointments/);

      if(hasMatch && Ext.isArray(hasMatch) && hasMatch.length > 0) {
        newHash = hasMatch[0];
      }
    } else {
      hasMatch = currentHash.match(/(?!#).*calendar/);
      if(hasMatch && Ext.isArray(hasMatch) && hasMatch.length > 0) {
        newHash = hasMatch[0];
      }
    }

    if(!newHash) {
      newHash = currentHash;
    }

    me.redirectTo(newHash);
  },

  /**
   * Task to retrieve a list of categories/calendars to display on the calendar list. For the My Calendar view, this is
   * a list of all the sales team members a rep is associated with.
   *
   * Implemented as a "promise" to execute asychronously.
   * @returns {adapter.pending.promise|*|Deft.promise.Deferred.promise|promise|Deft.promise|Deft.promise.Resolver.promise}
   */
  getCategoryList: function() {
    var me = this,
      deferred = Ext.create('Deft.Deferred'),
      practiceView = this.practiceView,
      sapId = practiceView.getSapId(),
      categoryStore = Ext.create(
        'Beacon.store.appointment.CalendarCategoryStore');

    categoryStore.load({
      params: {
        addCurrentUser: true,
        sapId: sapId
      },
      callback: function(records, operation, success) {
        me.categoryList = categoryStore;
        deferred.resolve(categoryStore);
      }
    });

    return deferred.promise;
  },

  /**
   * called when calendar is initialized
   *
   * @param
   * @returns
   */
  onCalendarInit: function(calendarView) {},

  routeView: function(sapId, id) {
    var view = PracticeController.showPractice(sapId, null, false);
    this.showPracticeAppointments(view, sapId);

    if (id) {
      this.showAppointment(view, id, sapId);
    }
  },

  practiceSelected: function(field, value) {
    log.debug("practiceSelected");
    var
      me = this,
      view = field.up('appointmenteditview'),
      practice = field.getRecord(),
      editSheet = view,
      worksheet = view.up('worksheet');

    if (editSheet.isUpdating === true) {
      return;
    }

    if (!practice) {
      return;
    }

    worksheet.setLoading(true);

    log.debug("practice=" + practice);
    var practiceModel = PracticeManager.findPractice(practice.get('sapId'));
    practiceModel.copyAccount(practice);

    PracticeManager.preloadPracticeData(practice.get('sapId'), {
      callback: function(p2, success, response) {
        me.createAppointment(practiceModel, worksheet);
      }
    });
  },

  calendarViewChange: function(panel, view, info) {
  },

  loadCalendarStore: function(sapId, info) {
    var params = {
      sapId: sapId,
      startDate: info.viewStart,
      endDate: info.viewEnd
    };

    var calendarStore = Ext.create(
      'Beacon.store.appointment.CalendarActivityStore');

    var deferred = Ext.create('Deft.Deferred');
    calendarStore.load({
      params: params,
      callback: function(records, operation, success) {
        deferred.resolve(records);
      }
    });

    return deferred.promise;
  },

  loadFreeBusyData: function(categoryStore, info) {
    var deferred = Ext.create('Deft.Deferred');
    var idsToFetch = [];

    categoryStore.each(function(item) {
      if (!item.get('IsHidden')) {
        idsToFetch.push(item.get('CalendarId'));
      }
    });

    var params = {
      categoryList: idsToFetch,
      startDate: info.viewStart,
      endDate: info.viewEnd
    };

    var freeBusyStore = Ext.create(
      'Beacon.store.appointment.FreeBusyStore');

    if (idsToFetch.length === 0) {
      deferred.resolve(freeBusyStore.getRange());
    } else {
      freeBusyStore.load({
        params: params,
        callback: function(records, operation, success) {
          deferred.resolve(records);
        }
      });
    }

    return deferred.promise;
  },

  showPracticeAppointments: function(practiceView, sapId) {
    //log.debug("showPracticeAppointments: " + sapId);
    var view = practiceView.setView('practicecalendarview');
    view.setLoading(true);
    var me = this;

    var ctx = {
      practiceView: practiceView,
      categoryList: null,
      appointmentList: null
    };

    Deft.Chain.sequence([
      me.getCategoryList
    ], ctx)
      .always(function() {

        var calendarPanel = practiceView.down('extensiblecalendarpanel');

        if (!calendarPanel) {
          calendarPanel = view.getCalendarContainer().add({
            xtype: 'extensible.calendarpanel',
            eventStore: Ext.create(
              'Beacon.store.appointment.CalendarActivityStore', {
                proxy: {
                  type: 'memory'
                }
              }),
            border: false,
            activeItem: 1,
            autoScroll: true,
            region: 'center',
            calendarStore: ctx.categoryList,
            weekViewCfg: {
              getEventClass: function(model, isAllDayEvent, data) {
                var caseId = model.get('CaseId');
                if (caseId) {
                  data._bn_caseId = caseId;
                  return 'event-bn-beaconcase';
                }

                return '';
              }
            },
            listeners: {
              viewchange: function(panel, view, info) {
                var eventStore = panel.store;
                eventStore.removeAll();

                var categoryStore = ctx.categoryList;

                Deft.Promise.all([
                  me.loadCalendarStore(sapId, info),
                  me.loadFreeBusyData(categoryStore, info)
                ]).then({
                  success: function(response) {
                    if (response && Ext.isArray(response)) {
                      response.forEach(function(item, index, array) {
                        if (item && Ext.isArray(item) && item.length >
                          0) {
                          eventStore.loadRecords(item, {
                            addRecords: true
                          });
                        }
                      });
                    }

                    if (eventStore && eventStore.data && eventStore.data
                      .items) {
                      eventStore.fireEvent('load', eventStore,
                        eventStore.data.items, true);
                    }
                  }
                });
              },

              eventClick: function(view, eventRec) {
                var caseId = eventRec.get('EventId');

                setTimeout(function() {
                  var newHash = window.location.hash.match(
                    /(?!#).*appointments/)[0];
                  me.redirectTo(newHash + '/appointment/' + caseId);
                }, 100);

                return false;
              },

              dayclick: function(view, clickedDateTime) {
                if (!Ext.isDate(clickedDateTime)) {
                  clickedDateTime = new Date(clickedDateTime);
                }

                var endTime = new Date(clickedDateTime.getTime() + 30 *
                  60000);
                me.editAppointment(null, practiceView, clickedDateTime,
                  endTime);
                return false;
              },

              rangeselect: function(view, dateRange) {
                Beacon.app.fireEvent('createAppointment', me, view, dateRange);
                return false;
              }
            }
          });

          me.categoryList = view.getCalendarNav().add({
            xtype: 'bn.calendarlist',
            width: '100%',
            height: '100%',
            store: ctx.categoryList,
            collapsible: false,
            itemId: 'categorylist',
            autoScroll: true,
            listeners: {
              'calendar:toggle': function(category, isHidden) {
                if (isHidden) {
                  return;
                }


                if (calendarPanel.getActiveView && calendarPanel.getActiveView()
                  .getViewBounds()) {
                  var calendarId = category.get('id');
                  var bounds = calendarPanel.getActiveView().getViewBounds();

                  var calendarStore = calendarPanel.store;
                  var found = calendarStore.find('CalendarId', calendarId);

                  if (found === -1) {
                    var visibilityStore = Ext.create(
                      'Beacon.store.appointment.FreeBusyStore');
                    view.setLoading(true);

                    visibilityStore.load({
                      params: {
                        categoryList: calendarId,
                        startDate: bounds.start,
                        endDate: bounds.end
                      },
                      callback: function(records, operation, success) {
                        try {
                          if (success) {
                            calendarStore.loadRecords(records, {
                              addRecords: true
                            });
                            calendarStore.fireEvent('load',
                              calendarStore, records, success);
                          }
                        } finally {
                          view.setLoading(false);
                        }
                      }
                    });
                  }
                }
              }
            }
          });
        }
        view.setLoading(false);
      });
  },

  onAppointmentClicked: function(view, rec, item, index, e) {
    var me = this,
      caseId = rec.getId();
    setTimeout(function() {
      var newHash = window.location.hash.match(/(?!#).*appointments/)[0];
      me.redirectTo(newHash + '/appointment/' + caseId);
    }, 100);
  },

  itemClicked: function(grid, record, item, index, e) {
    var me = this;

    if (!record || record.data.caseId) {
      //log.debug('nothing clicked');
      return;
    }

    setTimeout(function() {
      var newHash = window.location.hash.match(/(?!#).*appointments/)[0];
      me.redirectTo(newHash + '/appointment/' + record.data.caseId);
    }, 100);

  },

  redirectTo: function(route) {
    this.getApplication().redirectTo(route);
  },

  createAppointment: function(practiceModel, worksheet) {
    CaseFactoryManager.createAppointment(practiceModel, worksheet.dateRange, function(newCase, success) {
      if (success) {
        var formData = Ext.create(
          'Beacon.model.appointment.AppointmentFormModel');

        formData.loadFormData(null, newCase, function(formData, success) {
          if(success) {
            CodeAttributeManager.updateCodes(newCase, null,
              worksheet.getEditView().query('field[isCode=true]'));
            worksheet.setRecord(newCase);
            worksheet.getEditView().loadRecord(newCase);
            worksheet.getEditView().setFormData(formData);
            worksheet.getEditView().enableForm(true);

            worksheet.setLoading(false);
          }
        });
      }
    });
  },

  showAppointment: function(mainView, recordId, sapId, callback) {
    var me = this,
      worksheet;

    worksheet = this.showWorksheet2('appointment', mainView, recordId);
    worksheet.setLoading(true);

    Beacon.model.appointment.AppointmentModel.load(recordId, {
      success: function(record, operation) {
        me.openAppointment(record, worksheet);
        worksheet.setLoading(false);
        if (callback) {
          callback(record, mainView);
        }
      },
      failure: function(error) {
        log.error("Error loading appointment: " + error);
        worksheet.setLoading(false);
      }
    });
  },

  openAppointment: function(record, appointmentWorksheet) {
    if (!record) {
      log.debug('openAppointment - null record');

    } else {
      if (!appointmentWorksheet.getRecord()) {
        appointmentWorksheet.setRecord(record);
      }
    }
  },

  onCreateAppointment: function(controller, view, dateRange) {
    var practiceView = view.up('practiceview'),
        worksheet = this.showWorksheet2('appointment', practiceView, 'new'),
        practiceModel = PracticeManager.findPractice(practiceView.getSapId());

    worksheet.dateRange = dateRange;
    worksheet.setEditMode(true);

    this.createAppointment(practiceModel, worksheet);
  },

  onCreateAppAppointment: function(ctx, view, dateRange) {
    var worksheet = this.showWorksheet2('appointment', this.getSalesPortal(),
      'new');
    worksheet.getEditView().showPracticeSearch(true);

    worksheet.dateRange = dateRange;
    worksheet.setEditMode(true);
  },

  onEdit: function(worksheet, b, e) {
    var me = this,
      practiceView = b.up('practiceview'),
      theAppointment = worksheet.getRecord(),
      sapId = theAppointment.get('sapId');

    if (!practiceView) {
      PracticeController.showPractice(sapId, function(practiceView) {
        me.editAppointment(theAppointment, practiceView);
      }, false);
    } else {
      me.editAppointment(theAppointment, practiceView);
    }
  },

  editAppointment: function(theAppointment, practiceView, startDate, endDate) {
    log.debug("editAppointment", theAppointment, practiceView);

    var sapId = practiceView.getSapId(),
      recordId = theAppointment ? theAppointment.get('caseId') : 'new',
      worksheet = this.showWorksheet2('appointment', practiceView, recordId),
      practiceModel = PracticeManager.findPractice(sapId);

    worksheet.setEditMode(true);
    worksheet.updateDirtyState(null, true);
    worksheet.setLoading(true);
    worksheet.tag = 'test tag';

    if(!startDate) {
      var currentDateTime = new Date();
      var currentYear = currentDateTime.getFullYear();
      var currentMonth = currentDateTime.getMonth();
      var currentDay = currentDateTime.getDate();
      var currentHour = currentDateTime.getHours();
      var currentMin = currentDateTime.getMinutes();

      if(currentMin < 30) {
        currentMin = 30;
      } else {
        currentMin = 0;
        currentHour = currentHour + 1;
      }

      startDate = new Date(currentYear, currentMonth, currentDay, currentHour, currentMin, 0);
    }

    if(!endDate) {
      endDate = Ext.Date.add(startDate, Ext.Date.MINUTE, 30);
    }

    var dateRange = {
      StartDate: startDate,
      EndDate: endDate
    };

    var loadData = function(theCase) {
      var formData = Ext.create(
        'Beacon.model.appointment.AppointmentFormModel');

      formData.loadFormData(null, theCase, function(formData, success) {
        if(success) {
          CodeAttributeManager.updateCodes(theCase, null,
            worksheet.getEditView().query('field[isCode=true]'));

          worksheet.setRecord(theCase);
          worksheet.getEditView().loadRecord(theCase);
          worksheet.getEditView().setFormData(theCase);
          worksheet.setLoading(false);
        }
      });

    };

    if(!theAppointment) {
      CaseFactoryManager.createAppointment(practiceModel, dateRange, function(newCase, success) {
        if (success) {
          loadData(newCase);
        }
      });
    } else {
      loadData(theAppointment);
    }

    return;

  },

  preprocessRecord: function(theAppointment, editForm) {
    var values = editForm.getValues();

    var formCodeIdForCommMethod = values.communication_method;
    if (theAppointment.codeModels().data.items) {
      Ext.each(theAppointment.codeModels().data.items, function(r) {
        if (r.data) {
          if (r.data.codeType === 'COMMUNICATION_METHOD') {
            r.data.codeId = formCodeIdForCommMethod;
          }

        }
      });
    }

    var sd = editForm.down('[name=scheduledStartDate]').value;
    var st = editForm.down('[name=scheduledStartTime]').value;
    var ed = editForm.down('[name=scheduledEndDate]').value;
    var et = editForm.down('[name=scheduledEndTime]').value;
    if (!values.allDayEventInd) {
      sd.setHours(st.getHours());
      sd.setMinutes(st.getMinutes());

      ed.setHours(et.getHours());
      ed.setMinutes(et.getMinutes());
    }

    theAppointment.data.scheduledStart = sd;
    theAppointment.data.scheduledEnd = ed;

    theAppointment.inviteesStore.removeAll();
    var originalInviteesStore = Bn.getInstance(
      'DomainAppointmentInviteeStore');
    var inviteesFromForm = values.invitees;
    Ext.each(inviteesFromForm, function(invitee, index) {
      originalInviteesStore.each(function(r) {
        if (r.get('appUser').get('activeDirectorySID') !== null) {
          if (r.data.appUser) {
            if (r.data.inviteeId === invitee) {
              theAppointment.inviteesStore.add(r.copy());
            }
          }
        }
      });
    });

    var subject = '';
    subject = theAppointment.data.customerName + ", SAP: " + theAppointment.data
      .sapId;

    theAppointment.set('summary', subject);

    return theAppointment;
  },

  recordCreated: function(theAppointment, worksheet) {
    this.onRecordSaved(theAppointment, worksheet, true);
  },

  recordUpdated: function(theAppointment, worksheet) {
    this.onRecordSaved(theAppointment, worksheet, false);
  },

  onRecordSaved: function(theAppointment, worksheet, created) {
    var practiceView = worksheet.up('practiceview');

    if(practiceView) {
        var extensibleCalendarPanel = practiceView.down('extensiblecalendarpanel');
        if (extensibleCalendarPanel) {
            extensibleCalendarPanel.fireViewChange();
        }
    }

    Beacon.app.fireEvent('calendarUpdated', theAppointment);
  },

  onDelete: function(view, b, e) {
    var theWorksheet = view,
        theAppointment = theWorksheet.getRecord();

    if (theWorksheet.itemId === "myCalendarApptWorksheetView") {
      return;
    }

    Ext.Msg.confirm({
      title: 'Confirm Delete Appointment',
      msg: 'Are you sure you want delete the appointment?',
      buttons: Ext.Msg.YESNO,
      fn: this.handleDeleteInput,
      animEl: 'elId',
      icon: Ext.MessageBox.QUESTION,
      appointment: theAppointment,
      worksheet: theWorksheet,
      me: this
    });

  },

  handleDeleteInput: function(choice, e, config) {
    log.trace('handling delete appointment request from user...');

    switch (choice) {
      case "yes":
        config.me.doDeleteAppointment(config.appointment, config.worksheet);
        break;
      default:
        log.info("user chose to not delete the appointment.");
        break;
    }

  },

  doDeleteAppointment: function(theAppointment, worksheet) {
    log.debug("Deleting : ", theAppointment);
    var me = this;

    //This is an update -- however, it's a soft delete as we are
    //setting the CASE.status_id to 9 (Deleted).
    theAppointment.data.status.data.statusId = 9;
    theAppointment.data.status.data.displayString = "Deleted";

    worksheet.setLoading(true);

    theAppointment.save({
      callback: function(record, operation) {
        log.debug("Done deleting appointment: " + record + ", " + operation);
      },
      success: function(record, operation) {
        log.debug("Appointment deleted successfully" + operation);
        var calendarPanel = worksheet.up('workbookcontainer').down('extensiblecalendarpanel');

        worksheet.setLoading(false);
        worksheet.close();

        //log.debug("after save - now refreshing calendar");
        if(calendarPanel) {
          calendarPanel.fireViewChange();
        }

        //this is needed to remove the "appointment/<appointment id>" from the end of the URL
        var matches = window.location.hash.match(/(?!#).*calendar/);
        if(!Ext.isArray(matches) || matches.length === 0) {
          matches = window.location.hash.match(/(?!#).*appointments/);
        }

        if(Ext.isArray(matches) && matches.length > 0) {
          var newHash = matches[0];
          me.redirectTo(newHash);
        }
      },

      failure: function(record, operation) {
        Ext.Msg.alert("Error", "Appointment failed to delete: " + operation);
        worksheet.setLoading(false);
      }

    });

    log.debug("Done calling doDeleteAppointment");

  },

  loadCodeFamilyData: function(codeFamilyId) {
    var deferred = Ext.create('Deft.Deferred');

    StoreManager.getRecord('DomainCodeFamilyStore', codeFamilyId, {
      callback: function(codeFamily) {
        deferred.resolve(codeFamily);
      }
    });

    return deferred.promise;
  },

  throwDisposeViewAndRefreshCalendarViewEvent: function(sapId) {
    //TODO
  },

  reportError: function(action, error) {
    switch(action) {
      case 'validation':
        Ext.Error.raise({
          title: 'Appointment failed validation',
          msg: error
        });
        break;

      default:
        log.warn('unknown action type: ' + action, error);
    }
  }

});
