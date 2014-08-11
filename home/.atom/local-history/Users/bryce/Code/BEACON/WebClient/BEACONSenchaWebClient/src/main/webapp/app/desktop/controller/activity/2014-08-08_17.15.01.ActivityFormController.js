/**
 * ActivityFormController
 */
Ext.define('Beacon.controller.activity.ActivityFormController', {
  extend: 'Ext.app.Controller',
  requires: [
    'Beacon.manager.code.CodeManager',
    'Beacon.manager.code.CodeAttributeManager',

    /*
     * Views
     */
    'Beacon.view.activity.ActivityDetailView',

    /*
     * Models
     */
    'Beacon.model.activity.ActivityCompleteModel',
    'Beacon.model.activity.ActivityFormModel',
    'Beacon.model.activity.ActivityCustomerModel',
    'Beacon.model.activity.ActivityTopicModel',
    'Beacon.model.activity.ActivityListModel',

    /*
     * Stores
     */
    'Beacon.store.domain.cases.CasesTypeStore',

    'Beacon.custom.mixin.BnWorksheetControl'
  ],

  mixins: ['Beacon.custom.mixin.BnWorksheetControl'],

  config: {
    refs: [{
      ref: 'salesPortal',
      selector: 'saleshome'
    }]
  },

  init: function() {
    var me = this;

    Beacon.app.on('createAppActivity', me.onCreateAppActivity, me);
    Beacon.app.on('createActivityFromCase', me.onCreateActivityFromCase, me);
    this.control({

      'activityworksheet menuitem[action=addTopic]': {
        click: 'onAddTopic'
      },

      'activityedit button[action=addTopic]': {
        click: 'onAddTopic'
      },

      'activityworksheet menuitem[action=addAttachment]': {
        click: 'onAddAttachment'
      },

      'activityworksheet': {
        beforeclose: 'beforeClose', //Use BnWorksheetControl.beforeClose mixin
        cancel: 'cancelEdit', //Use BnWorksheetControl.cancelEdit mixin
        edit: 'onEdit', //TODO: Need to make this generic across all forms...
        save: 'saveRecord' //Use BnWorksheetControl.saveRecord mixin
      },

      'activityedittopicformpanel button[name=deleteTopic]': {
        tap: 'deleteTopicButtonTapped'
      },

      'activityedit combo#practiceSelect': {
        change: 'onPracticeSelected'
      },

      'activityedit combo[field=REASON]': {
        change: 'onActivityReasonChanged'
      },
      'activityedit combo[name=RIDE_WITH_TYPE]': {
        change: 'onRideWithChanged'
      },
      'activityedit combo[name=DSR]': {
        change: 'onDistributorChanged'
      },
      'activityworksheet attachmentsview': {
        refreshAttachments: "refreshAttachments"
      }
    });

    WorkbookManager.registerWorksheetConfig('activity', {
      xtype: 'activityworksheet'
    });
  },
  refreshAttachments: function(obj) {
    this.loadAttachments(obj);
  },


  onPracticeSelected: function(field, value, callback) {
    log.debug("practiceSelected");

    var me = this,
      view = field.up('activityedit'),
      practice = field.getRecord(),
      editSheet = view,
      worksheet = view.up('worksheet'),
      theCase = editSheet.getRecord();

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

    var ctx = {
      worksheet: worksheet,
      isFTS: worksheet.isFTS,
      sapId: practice.get('sapId'),
      practiceModel: practiceModel,
      theCase: theCase,
      controller: me
    };

    Deft.Chain.sequence([
      me.loadCaseTypes,
      me.ensureCodeFamilyLoaded,
      me.ensureCodesLoaded,
      me.ensureCaseCreated,
      me.loadEditData,
      me.loadDurationItems
    ], ctx)
      .then({
        success: function() {
          var editView = ctx.worksheet.getEditView();
          CodeAttributeManager.updateCodes(ctx.theCase, null, editView.query(
            'field[isCode=true]'));
          editView.setRecord(ctx.theCase);

          if (ctx.theCase.activities) {
            editView.getTopicPanel().removeAll();

            ctx.theCase.activities().each(function(record) {
              editView.addTopic(record);
            });
          }

          worksheet.setEditMode(true);

          if (typeof callback === 'function') {
            callback(field, value);
          }
        },

        failure: function() {
          log.error('failure');
        }
      })
      .always(function() {
        worksheet.setLoading(false);
      })
      .done();
  },

  onCreateActivityFromCase: function(caseId) {

  },
  
  onCreateAppActivity: function(isFTS) {
    var worksheet = this.showWorksheet2('activity', this.getSalesPortal(),
      'new');
    worksheet.isFTS = isFTS;

    worksheet.getEditView().showPracticeSearch(true);

    worksheet.setEditMode(true);
  },

  ensureCodeFamilyLoaded: function() {
    var deferred = Ext.create('Deft.Deferred');

    StoreManager.getRecord('DomainCodeFamilyStore', CaseType.SALES_ACTIVITY.get(
      'codeFamilyId'), {
      callback: function(record) {
        if (!record) {
          deferred.reject('error retrieving code family 342');
        } else {
          deferred.resolve(record);
        }
      }
    });

    return deferred.promise;
  },

  ensureCodesLoaded: function() {
    var deferred = Ext.create('Deft.Deferred');

    CodeManager.ensureCodesLoaded(422, function() {
      deferred.resolve();
    });

    return deferred.promise;
  },

  ensureCaseCreated: function() {
    var deferred = Ext.create('Deft.Deferred'),
      practiceModel = this.practiceModel,
      isFTS = this.isFTS;

    this.theCase = this.theCase ? this.theCase : CaseFactoryManager.createActivity(
      practiceModel, isFTS);

    deferred.resolve(this.theCase);

    return deferred.promise;
  },

  editActivity: function(practiceView, theCase, sapId, b, e, callback) {
    var me = this,
      isFTS = false,
      caseId = theCase && theCase.isModel ? theCase.getId() : 'new',
      worksheet = this.showWorksheet2('activity', practiceView, caseId),
      practiceModel = PracticeManager.findPractice(sapId);
    if (typeof theCase === 'boolean') {
      isFTS = theCase;
      theCase = undefined;
    }

    worksheet.updateRecord(theCase);
    var ctx = {
      worksheet: worksheet,
      sapId: sapId,
      isFTS: isFTS,
      practiceModel: practiceModel,
      theCase: theCase,
      controller: me
    };

    worksheet.setLoading(true);
    worksheet.updateDirtyState(null, true); //force the * to show up on edit
    Deft.Chain.sequence([
      me.ensureCodeFamilyLoaded,
      me.ensureCodesLoaded,
      me.ensureCaseCreated,
      me.loadCaseTypes,
      me.loadEditData,
      me.loadDurationItems
    ], ctx)
      .then({
        success: function() {
          var editView = ctx.worksheet.getEditView();
          CodeAttributeManager.updateCodes(ctx.theCase, null, editView.query(
            'field[isCode=true]'));
          editView.setRecord(ctx.theCase);

          if (ctx.theCase.activities) {
            editView.getTopicPanel().removeAll();

            ctx.theCase.activities().each(function(record) {
              editView.addTopic(record);
            });
          }

          worksheet.setEditMode(true);

          if (typeof callback === 'function') {
            callback(b, e);
          }
        },

        failure: function() {
          log.error('failure');
        }
      })
      .always(function() {
        worksheet.setLoading(false);
      })
      .done();
  },

  onEdit: function(worksheet, b, e, callback) {
    var me = this,
      theCase = worksheet.getRecord(),
      sapId = theCase.get('sapId'),
      practiceView = b.up('practiceview');

    if (!practiceView) {

      //Need to make sure the practice is open.
      // If user attempts to edit a record from the sales portal/worklist,
      // it will open the record in the practice, then switch to edit mode.

      PracticeController.showPractice(sapId, function(practiceView) {
        me.editActivity(practiceView, theCase, sapId, b, e, callback);
      }, false);
    } else {
      me.editActivity(practiceView, theCase, sapId, b, e, callback);
    }

  },

  loadAttachments: function(obj) {
    var attView = obj.view;

    this.getController('attachment.AttachmentController').refreshGrid(attView);
  },

  loadDurationItems: function() {
    var store = Ext.create('Ext.data.Store', {
      fields: ['value', 'text']
    });

    var editView = this.worksheet.getEditView();

    var bundle = Bundle;

    store.add({
      value: 5,
      text: bundle.getMsg("Domain.duration.5Min")
    });
    store.add({
      value: 15,
      text: bundle.getMsg("Domain.duration.15Min")
    });
    store.add({
      value: 30,
      text: bundle.getMsg("Domain.duration.30Min")
    });
    store.add({
      value: 45,
      text: bundle.getMsg("Domain.duration.45Min")
    });
    store.add({
      value: 60,
      text: bundle.getMsg("Domain.duration.1Hour")
    });

    for (var i = 90; i <= 1440; i += 30) {
      store.add({
        value: i,
        text: (i / 60) + bundle.getMsg('Domain.duration.hour')
      });
    }

    editView.setDurationList(store);

    var thePromise = Ext.create('Deft.Deferred');
    thePromise.resolve(store);

    return thePromise.promise;

  },

  loadEditData: function() {
    var editDataDef = Ext.create('Deft.Deferred');
    var practiceModel = this.practiceModel,
      theCase = this.theCase,
      request = {},
      notLoaded = false,
      sapId = theCase.get('customerId'),
      codeFamilyId = theCase.getCodeFamilyId();

    request.sapId = sapId;
    request.contacts = !practiceModel.get('contacts').loaded;

    request.products = !practiceModel.get('activityProducts').loaded;
    request.codeFamily = Bn.getInstance('DomainCodeFamilyStore').findExact(
      'codeFamilyId',
      codeFamilyId) === -1;
    request.distributors = !Bn.getInstance('DomainDistributorStore').isLoaded();

    for (var p in request) {
      //given that a request item must be loaded, property loop can stop
      //and ajax call can begin
      if (p !== 'sapId' && request[p]) {
        notLoaded = true;
      }
    }

    if (!notLoaded) {
      editDataDef.resolve();
      return editDataDef.promise;
    }

    Ext.Ajax.request({
      url: '/beacon/api/sales/activities/editdata?dc=' + Ext.Date.now(),
      action: 'read',
      method: 'POST',

      jsonData: Ext.encode(request),
      success: function(response) {
        //log.debug('loadEditData success');
        var responseData = Ext.decode(response.responseText, true),
          editData = responseData.data.salesActivityEditData,
          codes = editData.codeFamily;
        if (codes) {
          var codeFamily = Ext.create(
            'Beacon.model.domain.code.CodeFamilyModel', codes);
          codeFamily.setData(codes);
          //log.debug("codeFamily="+codeFamily);
          Bn.getInstance('DomainCodeFamilyStore').add(codeFamily);
        }

        var contacts = editData.contacts;
        if (contacts) {
          practiceModel.set('contacts', contacts);
          practiceModel.get('contacts').loaded = true;
        }

        var distributors = editData.distributors;
        if (distributors) {

          Ext.each(distributors, function(distributor) {
            var distObj = Ext.create(
              "Beacon.model.domain.distributor.DistributorModel",
              distributor);
            distObj.setData(distributor);

            Bn.getInstance('DomainDistributorStore').add(distObj);

          });
          Bn.getInstance('DomainDistributorStore').loaded = true;
        }

        var products = editData.products;
        if (products) {
          practiceModel.set('activityProducts', products);
          practiceModel.get('activityProducts').loaded = true;
        }

        editDataDef.resolve(response);
      },
      failure: function() {
        log.error('loadEditData Failed');
        editDataDef.reject('error loading edit data');
      }
    });

    return editDataDef.promise;
  },

  loadCaseTypes: function() {
    //log.debug('calling loadCaseTypes');
    var caseTypePromise = Ext.create('Deft.Deferred');
    var casesTypeStore = Bn.getInstance('DomainCasesTypeStore');
    caseTypePromise.resolve(casesTypeStore);

    return caseTypePromise.promise;
  },

  deleteTopicButtonTapped: function(button, e, options) {
    //log.debug('Delete Topic Button tapped');

    var topicEdit = button.up('activityedittopicformpanel'),
      theTopic = topicEdit.theTopic,
      theCase = topicEdit.theCase;
    //log.debug("theCase="+theCase);
    //log.debug("theTopic="+theTopic);

    theCase.activities().remove(theTopic);

    topicEdit.up('activityeditview').removeTopic(theTopic);
  },

  onDistributorChanged: function(combo, newValue, oldValue, options) {
    //log.debug("onDistributorChanged");
    var dsrCompanyCodeId = combo.getValue(),
      editView = combo.up('activityedit'),
      dsrCompany = Bn.getInstance('DomainDistributorStore').findDistributor(
        dsrCompanyCodeId);

    if (dsrCompany) {
      if (dsrCompany.reps) {
        editView.setDistributorReps(dsrCompany.reps().data.items);
        editView.showDSRRepFields(true);
        return;
      }
    }
    editView.setDistributorReps(null);
    editView.showDSRRepFields(false);
  },

  onActivityReasonChanged: function(combo, newValue, oldValue, options) {
    //log.debug("onActivityReasonChanged: ", newValue, oldValue);
    var reason = combo.getRecord(),
      editSheet = combo.up('activityedit');
    if (editSheet) {
      editSheet.setFirstTopicReason(reason);
    }
  },

  onRideWithChanged: function(combo, newValue, oldValue, options) {
    //log.debug("onRideWithChanged");
    var rideWithCode = combo.getRecord(),
      editSheet = combo.up('activityedit'),
      worksheet = combo.up('worksheet'),
      theCase = worksheet.getCase();

    if (rideWithCode) {
      if (rideWithCode.get('codeValue') === "RIDE_WITH_DSR") {
        //log.debug("Show dsrCompany");
        editSheet.showDSRFields(true);
      } else {
        //log.debug("Hide dsrCompany");
        if (theCase) {
          theCase.setCode('DSR', null);
          theCase.set('distributorRepModel', null);
        }
        editSheet.showDSRFields(false);
      }
    }
  },

  onAddAttachment: function(b, e) {
    var worksheet = b.up('worksheet'),
      theCase = worksheet.getRecord(),
      sapId = theCase.get('sapId'),
      practiceModel = PracticeManager.findPractice(sapId);

    this.application.fireEvent('attachments:add');
    CaseFactoryManager.createAttachment(sapId, practiceModel);
  },

  onAddTopic: function(b, e, callback) {
    var me = this,
      worksheet = b.up('worksheet');

    Bn.getInstance('DomainActivityTypeStore');

    var lCallback = function() {
      me.onAddTopic(b, e);
    };

    if (!worksheet.getEditMode()) {
      me.onEdit(worksheet, b, e, lCallback);
      return;
    }

    var editView = worksheet.getEditView(),
      theCase = editView.theCase;

    var newTopic = CaseFactoryManager.addActivityTopic(theCase);

    editView.addTopic(newTopic);
  },

  updateRecord: function(theRecord, editView) {
    editView.getForm().updateRecord(theRecord);
    var topicForms = editView.getTopicForms();

    topicForms.forEach(function(item) {
      item.updateRecord();
    });

    //TODO: Doesn't feel right, should be refactored...
    if (editView.down("[name=distributorRepModel]").getRecord()) {
      theRecord.data.distributorRepModel = editView.down(
        "[name=distributorRepModel]").getRecord().data;
    }
    return theRecord;
  },

  /**
   * Define handling for various error types that occur in this controller.
   * @cfg {String} action
   * The type of action that was being performed when the error occured (save, validate, etc)
   */
  reportError: function(action, error) {
    switch (action) {
      case 'refresh':
        log.error("Error refreshing activity: " + error); //, error);
        break;
      case 'load':
        //TODO
        break;
      case 'save':
        Ext.Error.raise({
          msg: "Failed to save Activity",
          exception: error
        });
        break;
      case 'validation':
        //TODO: Shouldn't be an Ext.Error for just user input...
        Ext.Error.raise({
          title: 'Activity failed validation',
          msg: error
        });
        break;
      default:
        log.warn("Unknown action type: " + action, error);
        break;
    }
  },

  /**
   * Function called by mixin BnWorksheetControl when a new record is created locally.
   * BnWorksheetControl will also fire a general "recordCreated" to globally notify the app.
   * By default, does nothing, but can be overridden if custom behavior is desired.
   */
  recordCreated: function(record) {
    var practiceModel = PracticeManager.findPractice(record.get('sapId')),
        store = practiceModel.get('activities');

    if (store && store.loaded) {
        store.loadPage(store.currentPage);
	}
  }

});
