/**
 * ActivityListController
 */
Ext.define('Beacon.controller.activity.ActivityListController', {
	extend: 'Beacon.controller.base.BnController',

	requires: [
		'Beacon.model.activity.ActivityCompleteModel',
		'Beacon.model.activity.ActivityListModel',

		'Beacon.store.activity.ActivityListStore',
		'Beacon.store.cases.CaseAttachmentsStore',
	    'Beacon.store.domain.activity.ActivityTypeStore',
		'Beacon.store.domain.cases.CasesTypeStore',
		'Beacon.store.domain.code.CodeFamilyStore',
		'Beacon.store.domain.code.CodeStore',
		'Beacon.store.domain.distributor.DistributorStore',
		'Beacon.store.domain.priority.PriorityStore',
		'Beacon.store.domain.status.StatusStore',
		'Beacon.store.domain.system.SystemAttributeStore',
		'Beacon.store.domain.user.AppUserStore',

		'Beacon.view.activity.ActivityWorksheet',
        'Beacon.view.activity.MyActivitiesView',
        'Beacon.view.activity.list.ActivityListView',
		'Beacon.view.practice.activity.list.PracticeActivityListView',

        'Beacon.controller.practice.PracticeViewController'
	],
	config: {

      routes: {
        'practice/:sapId/activities/': 'routeView',
        'practice/:sapId/activities': 'routeView',
        'practice/:sapId/activities/create': 'createActivity',
        'practice/:sapId/activities/activity/:caseId': 'routeView'
      },

      before: {
        'routeView': 'authenticate'
      },

      permissions: {
        editFtsActivity: {key: 'caseType_196', permType: 'caseType', operation: 'u'},
        editActivity: {key: 'caseType_163', permType: 'caseType', operation: 'u'},
        createFtsActivity: {key: 'caseType_196', permType: 'caseType', operation: 'c'},
        createActivity: {key: 'caseType_163', permType: 'caseType', operation: 'c'}
      }

	},

	init : function () {
        window.ActivityListController = this;

		this.listen({
			controller: {
				// Works, but do we need to be so specific?
				//'#practice.PracticeViewController': {
				'*': {
					showPortalActivity: 'showActivity',
					showPracticeActivities: 'showPracticeActivities',
					createFTSSalesActivity: 'createFTSSalesActivity',
					createSalesActivity: 'createSalesActivity',
					showPracticeActivity: 'showActivity',
                  createActivity: 'onCreateActivity' //TODO: Merge with above
				}
			}
		});

		this.control({
			'practiceactivitylistview': {
				itemdblclick: 'onActivityClicked',
				addActivity: 'addSalesActivityClicked',
              edit: 'editRecord',
              view: 'viewRecord',
			}
		});

		Beacon.app.on('createActivityFromCase', this.onCreateActivityFromCase, this);

    },

	onCreateActivityFromCase: function(caseId) {
		Deft.Promise.all([
			CaseManager.getCaseById(caseId),
			CaseManager.loadCodeFamilyData(422), // Jurisdiction Codes
			CaseManager.loadCodeFamilyData(342)  // Opportunity codes...
			]).then({
			success: function(results) {
				var theCase = results[0];
				var sapId = theCase.get('sapId');
				var practiceView = PracticeController.showPractice(sapId, null, false);
				var practiceModel = PracticeManager.findPractice(sapId);

				var newCase = CaseFactoryManager.createActivityFromCase(practiceModel, theCase);
				log.debug(newCase);
			},
			failure: function(reason) {

			}
		});
	},



  routeView: function(sapId, caseId) {
    var view = PracticeController.showPractice(sapId, null, false);
    this.showPracticeActivities(view, sapId);

    if (caseId) {
      this.showActivity(view, caseId, sapId);
    }
  },

	showActivity: function(view, caseId, sapId, callback) {
		log.debug("showActivity: "+caseId);
		var me = this,
		worksheet;

        worksheet = this.showWorksheet(view, caseId);
		worksheet.setLoading(true);

      worksheet.setAccess({
        editFts: this.hasAccess('editFtsActivity'),
        edit: this.hasAccess('editActivity')
      });

		Beacon.model.activity.ActivityCompleteModel.load(caseId, {
			success: function(record, operation) {
				log.debug("success loading case: "+record);

                me.openActivity(record, worksheet);
                if (callback) {
                    callback(record, view);
                }

			},
			failure: function(error) {
				//log.error("Error loading activity: "+error);
				Ext.Error.raise("Error loading activity: "+error, error);
				// Ext.Msg.alert(Bundle.getMsg("General.Error"),
				// 			  Bundle.getMsg("Activity.failedLoad"));
				// if (!worksheet || !worksheet.element) {
                //     return;
                // }
				// worksheet.setMasked(false);
			},
			callback: function() {
				worksheet.setLoading(false);
			}
		});
	},

	openActivity: function(record, worksheet) {
		log.debug("openActivity: "+record+", "+worksheet);
		if (!record) {
			log.error("Null record");
			//TODO: Remove form.
//			this.getFanView().pop(true);
		} else {
			//need to check if the case does not already exist, otherwise
			//existing changes get overwritten
			if (!worksheet.getRecord()) {
				worksheet.setRecord(record);
			}

          //if (record.get('attachmentCount') > 0) {
		    this.getController('attachment.AttachmentController').loadAttachments(record.get('caseId'), worksheet);
          //}
		}
	},

	onActivityClicked: function(view, rec, item, index, e) {
		var me=this,
	        caseId = rec.getId(),
            sapId = rec.get('sapId');

		window.setTimeout(function() {
          me.redirectTo('practice/'+sapId+'/activities/activity/'+caseId);
		}, 10);

	},

	/**
	 * Either return existing worksheet for specified record (if currently being
	 * shown in workbook), or create a new one.
	 * Note: Relies on previously adding the worksheet config to WorkbookManager.  See {@link Beacon.manager.workbook.WorkbookManager#registerWorksheetConfig}
	 *
	 * @param {Beacon.view.base.BnView} practiceView - The view to display the worksheet in - can be PracticeView or SalesHome (sales portal) currently.
	 * @param {String} recordId The record id or 'new' if creating.
	 * @member Beacon.controller.activity.ActivityListController
	 */
	showWorksheet: function(practiceView, recordId) {
		var worksheet = practiceView.showWorksheet('activity', recordId);
		return worksheet;
	},

	showPracticeActivities: function (practiceView, sapId) {
		log.debug("showPracticeActivities: "+sapId);

      var store = PracticeManager.getActivities(sapId, {
		callback: function (practiceModel, activities, success) {
          if (!success) {
			Ext.Error.raise('Failed to load Activities');
		  }
		}
	  });

	  var view = practiceView.setView('practiceactivitylistview', {store: store});
      view.setAccess(this.hasAccess('editActivity'),
                     this.hasAccess('createActivity'),
                     this.hasAccess('editFtsActivity'),
                     this.hasAccess('createFtsActivity'));

	},

  onCreateActivity: function(sapId) {
    this.redirectTo(PracticeManager.createRoute('practice', sapId, 'activities', 'create'));
  },
  createActivity: function(sapId) {
    var view = PracticeController.showPractice(sapId, null, false);
    this.showPracticeActivities(view, sapId);
    this.createSalesActivity(view, null, false);
  },

	createFTSSalesActivity: function(practiceView, e) {
		return this.createSalesActivity(practiceView, e, true);
	},
    createSalesActivity: function(practiceView, e, isFTS) {
        var sapId = practiceView.getSapId();

        Bn.getInstance('DomainCasesTypeStore');

        var actController = this.getController('activity.ActivityFormController');
        actController.editActivity(practiceView, isFTS, sapId);

        return;
    },

	addSalesActivityClicked: function(view) {
		var practiceView = view.up('workbookcontainer');
		log.debug("practiceView="+practiceView, practiceView);
		//TODO: Switch which kind of sales activity here based on user role?  Other?
		this.createSalesActivity(practiceView, null, false);
	},

  viewRecord: function(grid, record, item, rowIx, e) {

	this.onActivityClicked(grid, record, item, rowIx);

  },

  editRecord: function(grid, record, item, rowIx, e) {
    var me = this,
        sapId = record.get('sapId');

	//TODO: Need to redirect so the history stays consistent
	PracticeController.showPractice(sapId, function(practiceView) {
	  me.showActivity(practiceView,
        record.get('caseId'),
        sapId,
        function(theCase, pv) {
            me.getController('activity.ActivityFormController').editActivity(pv, theCase, sapId);
	    });
	}, false);
  },

	rowAction: function(plugin, context) {
	  var action = context.button.action;

		log.debug("rowAction: "+action);
		switch(action) {
		case 'view':

			break;
		case 'edit':
			break;
		default:
			log.warn("Not handling: "+action);
			break;
		}
	}


});
