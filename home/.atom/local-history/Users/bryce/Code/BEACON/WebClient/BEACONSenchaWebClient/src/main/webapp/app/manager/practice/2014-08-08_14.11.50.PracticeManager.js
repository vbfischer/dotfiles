/**
 * Practice Manager
 * Used to retrieve practice-related data outside of the frameworks.
 */
Ext.define('Beacon.manager.practice.PracticeManager', {
	alternateClassName: 'PracticeManager',

	requires: [
		'Beacon.manager.store.StoreManager',
		'Utils.Format',
		'Beacon.model.practice.PracticeModel',
		'Beacon.store.practice.PracticeStore'
	],

	singleton: true,

	findPractice: function(sapId, createIfNotFound) {
      var store = Bn.getInstance('PracticeStore'),
	      practice = store.getPractice(sapId);
		if (!practice && createIfNotFound !== false) {
		  practice = Ext.create('Beacon.model.practice.PracticeModel');
          practice.set('sapId',  sapId);
//          practice.setDirty(true);
		  store.add(practice);
		}

		return practice;
	},

	closePractice: function(sapId) {
		var practice = Bn.getInstance('PracticeStore').getPractice(sapId);
		if (practice) {
			Bn.getInstance('PracticeStore').remove(practice);
		}

		return practice;
	},

	getStore: function(sapId, fieldName, config) {
		log.debug("getStore: "+sapId+", "+fieldName);
		config = Ext.apply({}, config);
		var practice = this.findPractice(sapId);
		var store = practice.get(fieldName);

		if (!store) {
			log.error("No store found for fieldName: "+fieldName);
			return null;
		}
		var callback = config ? config.callback : undefined;

		if (store.loaded) {
			log.debug("store already loaded: "+fieldName);
			if (callback) {
				callback(practice, store, true);
			} else {
				log.info("No callback for: "+fieldName);
			}
		} else if (!store.isLoading()) {
          var extraParams = store.getProxy().getExtraParams() || {};
			extraParams = Ext.apply(extraParams, {
				sapId: sapId
			});
			store.getProxy().setExtraParams(extraParams);

          config.callback = function(records, operation, success) {
            if (callback) {
                  callback(practice, store, success);
				}
			};

          if (store.buffered === true) {
            store.loadPage(1, config);
          } else {
			store.load(config);
          }
		} else {
			log.debug("Store is currently loading: "+fieldName);
		}
		return store;
	},

	getModel: function(sapId, fieldName, config) {
		//log.debug("getModel: "+sapId+", "+fieldName);
		config = Ext.apply({}, config);
		var practice = this.findPractice(sapId);
		var model = practice.get(fieldName);
		var callback = config.callback;

		if (!model) {
			log.error("No model found for fieldName: "+fieldName);
			return undefined;
		}

		if (model.loaded) {
			//log.debug("model already present: "+model);
			if (callback) {
				callback(practice, model, true);
			}
		} else if (!model.loading) {
			model.loading = true;

			var localCallback = function(record, operation, success) {
				if (success && record) {
					record.loaded = true;
					record.loading = false;
				}

				if (callback) {
					callback(practice, model, success);
				}
			};
			var localConfig = Ext.apply(config, {
				params: {sapId: sapId}
			});
			localConfig.callback = localCallback;

			model.loadPrivate(sapId, localConfig);
		}

		return model;
	},

	/**
	 * Pre-load key pieces of data for practice to improve performance.
	 * Options include:
	 * activities,
	 * cases,
	 * contacts,
	 * opportunities,
	 * salesTeam,
	 * equipment,
	 * tasks,
	 * revenue,
	 * accountCompleteProfile,
	 * referenceLab,
	 * competitorEquipment,
	 * competitorLabs,
	 * quickSearch,
	 * alerts,
	 * competitorPIMS,
	 * distributorContacts,
	 */
	preloadPracticeData: function(sapId, config) {
		//log.debug("preloadPracticeData: "+sapId);
		var me = this,
	  practice = this.findPractice(sapId),
	  allLoaded = true,
	  proxy = practice.getProxy();
		var localConfig = config || {};
		localConfig.params = {
			sapId: sapId,
			platform: Security.getPlatform()
		};
		if (practice.getIsLoading()) {
			if (typeof localConfig.callback === 'function') {
				practice.addCallback(localConfig.callback);
			}

			return practice;
		}

		var fields = practice.getFields().items;
		for (var ix=0,len=fields.length; ix<len; ix++) {
			var field = fields[ix];
			//log.debug("field="+(field !== null ? field.name : null), "shouldLoad="+this.shouldLoad(practice, field));
			if (field && field.preload) {
				localConfig.params[field.name] = this.shouldLoad(practice, field);
				if (localConfig.params[field.name]) {
					allLoaded = false;
				}
			}
		}

		//IF EVERYTHING IS ALREADY LOADED DO NOT BOTHER MAKING POST
		//IMMEDIATELY DO CALLBACK
		if (allLoaded) {
			if (localConfig && typeof localConfig.callback === 'function') {
				localConfig.callback.apply(this,[practice,true]);
			}

			return practice;
		}
		//log.debug("preloadPracticeData localConfig="+localConfig, localConfig);

		//otherwise enqueue callback
		if (localConfig && localConfig.callback) {
			practice.addCallback(localConfig.callback);
		}

		practice.setIsLoading(true);

		if (!proxy) {
			log.error("No proxy set for PracticeModel?");
			return practice;
		}

		var methods = proxy.getActionMethods ? proxy.getActionMethods() : proxy.actionMethods;
		var url = proxy.url;//proxy.getUrl ? proxy.getUrl() : proxy.url;
		//log.debug("Calling service to retrieve practice data for sapId="+sapId);
		Ext.Ajax.request({
			method: methods['read'],
			url: url + '?dc=' + Ext.Date.now(),
			jsonData: Ext.encode(localConfig.params),
			proxy: proxy,
			success: function (response) {
				response = Ext.decode(response.responseText);
				response = response.data;
				if (response) {

                  var fields = practice.getFields(),
                      field;

                  for (var r in response) {
                    field = fields.findBy(function(f) {
                              if (f.name == r || f.mapping == r) {
                                return true;
                              }
                              return false;
                            });
                    if (field) {
                      //TODO: Reuse logic Trevor added in PracticeModel to set data into models rather than create new models...
                      practice.set(field.name, response[r]);
                    }

                  }
//				  practice.setData(response);

                  if (practice.get('sapId')) {
                    PracticeManager.updateStores(practice);
                  }

				  //practice.updateSummary();

				  if(response.accountDetailModel) {
					if (response.accountDetailModel.accountNumber) {
					  practice.set('sapId', Utils.Format.formatSapNumber(response.accountDetailModel.accountNumber));
					}
					if(response.accountDetailModel.country) {
					  practice.setCountryCode(response.accountDetailModel.country);
					}
					if (response.accountDetailModel.practiceName) {
					  practice.set('name', response.accountDetailModel.practiceName);
					}
				  }

				  var callbacks = practice.getCallbackQueue(),
		              callback;
				  for (var i=0;i<callbacks.length;i++) {
					callback = callbacks[i];
					if (typeof callback === 'function') {
					  callback.apply(me,[practice,true]);
					} else if (typeof callback.callback === 'function') {
					  callback.callback.apply(me, [practice,true]);
					} else {
					  log.error("Don't know what to do with: ", callback);
					}
				  }
				  practice.clearCallbackQueue();
				  practice.setIsLoading(false);
                  practice.clearDirty();
				}

			},
		  failure: function () {
			log.error('failure'+arguments);
			var callbacks = practice.getCallbackQueue(),
		        callback;
			for (var i=0;i<callbacks.length;i++) {
			  callback = callbacks[i];
			  if (typeof callback === 'function') {
				callback.apply(me,[me,false]);
			  }
			}
			practice.clearCallbackQueue();
			practice.setIsLoading(false);
		  }
		});

		return practice;
	},

	getActivities: function(sapId, config) {
		return this.getStore(sapId, 'activities', config);
	},

	getCAGCompetitiveContracts: function(sapId, config) {
		return this.getStore(sapId, 'competitiveContracts', config);
	},

	getOpportunities: function(sapId, config) {
      return this.getStore(sapId, 'opportunities', config);
	},

	getTasks: function(sapId, config) {
		return this.getStore(sapId, 'tasks', config);
	},

	getContacts: function(sapId, config) {
		return this.getStore(sapId, 'contacts', config);
	},

	getAttachments: function(sapId, config) {
		return this.getStore(sapId, 'attachments', config);
	},

	getDistributorContacts: function(sapId, config) {
		return this.getStore(sapId, 'distributorContacts', config);
	},

	getContactFormModel: function(sapId, config) {
		return this.getModel(sapId, 'contactFormModel', config);
	},

	getLabFormModel: function(sapId, config) {
		return this.getModel(sapId, 'labFormModel', config);
	},

	getVendorProductsModel: function(sapId, config) {
		return this.getModel(sapId, 'vendorProductModel', config);
	},

	getRapidAssayFormModel: function(sapId, config) {
		return this.getModel(sapId, 'rapidAssayFormModel', config);
	},

	getEquipmentFormModel: function(sapId, config) {
		return this.getModel(sapId, 'equipmentFormModel', config);
	},

	getPimsEditFormModel: function(sapId, config) {
		return this.getModel(sapId, 'pimsEditFormModel', config);
	},

	getAlerts: function(sapId, config) {
		return this.getStore(sapId, 'alerts', config);
	},

	getLabOrders: function(sapId, config) {
		return this.getStore(sapId, 'laborders', config);
	},

	getEquipment: function(sapId, config) {
		return this.getStore(sapId, 'equipment', config);
	},

	getCompEquipment: function(sapId, config) {
		return this.getStore(sapId, 'compEquipment', config);
	},

	getCompRapidAssay: function(sapId, config) {
		return this.getStore(sapId, 'compRapidAssay', config);
	},

	getCompLab: function(sapId, config) {
		return this.getStore(sapId, 'compLab', config);
	},

	getReferenceLab: function(sapId, config) {
		return this.getModel(sapId, 'referenceLab', config);
	},

	getIdexxPims: function(sapId, config) {
		return this.getStore(sapId, 'idexxPims', config);
	},

	getInstallBase: function(sapId, config) {
	  return this.getModel(sapId, 'installBase', config);
	},

	getSalesHistory: function(sapId, config) {
		return this.getStore(sapId, 'salesHistory', config);
	},

	getOrderHistory: function(sapId, config) {
		return this.getStore(sapId, 'orderHistory', config);
	},

	getAppointments: function(sapId, config) {
		return this.getStore(sapId, 'appointments', config);
	},

	getEducation: function(sapId, config) {
		return this.getStore(sapId, 'education', config);
	},

	getLeases: function(sapId, config) {
		return this.getStore(sapId, 'leases', config);
	},

	getMarketing: function(sapId, config) {
		return this.getStore(sapId, 'marketing', config);
	},

	getCases: function(sapId, config) {
		return this.getStore(sapId, 'cases', config);
	},

	getPims: function(sapId, config) {
		return this.getStore(sapId, 'pims', config);
	},

    getVcPlusUtilizations: function(sapId, config) {
        return this.getModel(sapId, 'vcplusUtilizations', config);
    },

	getSalesTeam: function(sapId, config) {
		return this.getStore(sapId, 'salesTeam', config);
	},

	getAccountDetails: function(sapId, config) {
		return this.getModel(sapId, 'accountDetails', config);
	},

	getQuickSearch: function(sapId, config) {
		return this.getModel(sapId, 'quickSearch', config);
	},

	// getRevenue: function(sapId, config) {
	// 	return this.getModel(sapId, 'revenue', config);
	// },

	getPoints: function(sapId, config) {
		return this.getModel(sapId, 'pointModel', config);
	},

	getAccountCompleteProfile: function(sapId, config) {
		return this.getModel(sapId, 'accountCompleteProfile', config);
	},

	getPracticeIcons: function(sapId, config) {
		return this.getModel(sapId, 'practiceIcons', config);
	},
	'getSalesReferences' : function (sapId,config) {
		return this.getStore(sapId,'salesreferences',config);
	},

	getPracticeInfo : function(sapId, config) {
		return this.getModel(sapId,'practiceInfo', config);
	},

    getPracticeTerritoryInfo: function(sapId, config) {
        return this.getModel(sapId, 'territoryInfo', config);
    },
    getCustomerPrices: function(sapId, config) {
        return this.getStore(sapId, 'customerPrices', config);
    },

	shouldLoad: function(practice, field) {
		if (!field) {
			log.warn("Null field: "+field);
			return false;
		}
		if (!field.preload) {
			return false;
		}

		var value = practice.get(field.name);
		if (value && value.loaded) {
			return false;
		}

		return field.preload;
	},

	getAddressString: function(accountDetails, lineBreak) {
		var address = "";
		var br = (lineBreak || ', ');
		if (!accountDetails) {
			return address;
		}
		var data = accountDetails;
		if (accountDetails.isModel) {
			data = accountDetails.getData(true);
		}
		if (data.address1) {
			address = data.address1;
		}
		address += br;
		if (data.city) {
			//			if (address.length > 0) {
			//				address += ", ";
			//			}
			address += data.city;
		}
		if (data.state) {
			if (address.length > 0) {
				address += ", ";
			}
			address += data.state;
		}
		if (data.postalCode) {
			if (address.length > 0) {
				address += " ";
			}
			address += data.postalCode;
		}
		if (data.country) {
			if (address.length > 0) {
				address += ",";
			}
			address += data.country;
		}
		return address;
	},

  /**
   * Fix a problem with calling setData directly on the stores by going back and adding in the extraParam of sapId
   */
  updateStores: function(practice) {
    var sapId = practice.get('sapId');
    var fields = practice.getFields().items;
    var store, field;
	for (var ix=0,len=fields.length; ix<len; ix++) {
	  field = fields[ix];
      if (field && field.preload && field.type == 'store' || field.type.type == 'store') {
        store = practice.get(field.name);
		var extraParams = store.getProxy().getExtraParams() || {};
		extraParams = Ext.apply(extraParams, {
		  sapId: sapId
		});
		store.getProxy().setExtraParams(extraParams);
      }
    }

  },

  /**
   * Generate an html href link to open a practice given an sapId along with optional subView, item type, and item id.
   * TODO: Would be good to ensure subView and itemType are valid values.  Some sort of maintained store of views, record types that controllers could add to would give us this...
   * @param {String} displayString Text to display for the link.
   * @param {String} sapId The practice SAP id.
   * @param {String} subView (optional) The subview to display.
   * @param {String} itemType (optional) The itemType to display.
   * @param {String} itemId (optional) The item id to display.
   * @param {String} optional class to include in href link.  Defaults to gridLink.
   *
   * @return {String} The link to open the practice.
   */
  getPracticeLink: function(displayString, sapId, subView, itemType, itemId, linkCls) {
    linkCls = linkCls || 'gridLink';
    var link = '<a class="'+linkCls+'" href="#practice/' + sapId;
    if (subView) {
      link += '/' + subView;
    }
    if (itemType && itemId) {
      link += '/' + itemType + '/' + itemId;
    }
    link += '">'+displayString + '</a>';
    return link;
  },

  /**
   * Generate an html href link to open a view given object defining parameters.
   * @param {String} displayString Text to display for the link.
   * @param {Array} linkParams An array of strings used to generate the link
   * @param {String} optional class to include in href link.
   *
   * @return {String} The link to open the practice.
   */
  createLink: function(displayString, linkParams, _linkCls) {
    var linkCls = Ext.isEmpty(_linkCls) ? '' : 'class="'+linkCls+'"';
    var link = '<a '+linkCls+ ' href="#' + linkParams[0];

    for (var ix=1, len=linkParams.length; ix<len; ix++) {
      link += '/' + linkParams[ix];
    }
    link += '">'+displayString + '</a>';
    return link;
  },

  /**
   * Generate a route that can be used internally to open a view given object defining parameters.
   * @param {Array} linkParams An array of strings used to generate the link
   *
   * @return {String} The generated route.
   */
  createRoute: function() {
    log.debug("createRoute: ", arguments);
    var linkParams = arguments;
    if (!linkParams) {
      return '';
    }

    var route = '#' + linkParams[0];

    for (var ix=1, len=linkParams.length; ix<len; ix++) {
      route += '/' + linkParams[ix];
    }
    return route;
  }

});
