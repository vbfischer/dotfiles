/**
 * CaseManager.
 * @singleton
 */
Ext.define('Beacon.manager.case.CaseManager', {
  alternateClassName: 'CaseManager',

  requires: [
    'Utils.Format',
    'Beacon.model.domain.user.AppUserSummaryModel',
    'Beacon.manager.case.CaseFactoryManager',
    'Beacon.model.cases.CasesCompleteModel',
    'Beacon.store.domain.cases.CasesTypeStore',
    'Deft.Deferred'
  ],

  singleton: true,

  createAppointment: function(practiceModel, worksheet, callback) {
    this.editAppointment(null, practiceModel, callback);
  },

  getCaseById: function(caseId) {
    var deferred = Ext.create('Deft.Deferred'),

    Beacon.model.cases.CasesCompleteModel.load(caseId, {
      success: function(theCase) {
        if(theCase) {
          deferred.resolve(theCase);
        }
      },
      failure: function() {
        deferred.reject('Unable to retrieve case with id ' + caseId);
      }

    });

    return deferred.promise;
  },

  editAppointment: function(theCase, practiceModel, callback) {
    var formData = Ext.create('Beacon.model.appointment.AppointmentFormModel');
    Bn.getInstance('DomainCasesTypeStore'); //Make sure store is loaded
    var codeFamilyId = CaseType.APPOINTMENT.get('codeFamilyId');

    Deft.Promise.all([
      this.loadCodeFamilyData(codeFamilyId),
      this.loadCodeFamilyData(422)
    ]).then({
      success: function(records) {
        if (!theCase) {
          theCase = CaseFactoryManager.createAppointmentSync(practiceModel, CaseFactoryManager.getDefaultAppointmentDateRange());
        }
        formData.loadFormData(practiceModel, theCase, function(data, success) {
          if (success) {
            CodeManager.ensureCodesLoaded(422, function(mgr, data2) {
              theCase.formData = data;
              theCase.beginEdit();

              if (callback) {
                callback(theCase, true);
              }
            });
          } else {
            if (callback) {
              callback(theCase, false);
            }
          }
        });
      }
    }).done();
  },

  editOpportunity: function(theCase, practiceModel, callback) {
    Bn.getInstance('DomainCasesTypeStore'); //Make sure store is loaded
    var codeFamilyId = CaseType.OPPORTUNITY.get('codeFamilyId');

    this.getOppEditData(practiceModel, codeFamilyId, function(data, success) {
      // log.debug("Done getEditData");
      if (success) {
        if (!theCase) {
          // log.debug("Creating new opportunity...");
          theCase = CaseFactoryManager.createOpportunity(practiceModel);
          // log.debug("after, theCase="+theCase, theCase);
        }

        theCase.beginEdit();

        if (callback) {
          callback(theCase, true);
        }

      } else {
        if (callback) {
          callback(null, false);
        }
      }
    });


    return theCase;
  },

  getAuditInfo: function(_values) {
    var auditInfo = '<div class="audit"><table width="100%"><tr>';

    if (!_values) {
      return '';
    }
    var values = _values;
    if (values.isModel) {
      values = values.getData(true);
    }

    if (values.createdOn) {
      auditInfo += '<td>';
      auditInfo += Bundle.getMsg('General.createdOnMsg',
        Utils.Format.formatDate(values.createdOn),
        Beacon.model.domain.user.AppUserSummaryModel.toDisplayString(values.createdBy)
      );
      auditInfo += '</td>';
    }
    if (values.createdDate) {
      auditInfo += '<td>';
      auditInfo += Bundle.getMsg('General.createdOnMsg',
        Utils.Format.formatDate(values.createdDate),
        values.createdBy);
      auditInfo += '</td>';
    }
    if (values.updatedOn) {
      auditInfo += '<td align="right">';
      auditInfo += Bundle.getMsg('General.updatedOnMsg',
        Utils.Format.formatDate(values.updatedOn),
        Beacon.model.domain.user.AppUserSummaryModel.toDisplayString(values.updatedBy)
      );
      auditInfo += '</td>';
    }
    auditInfo += '</tr></table></div>';

    return auditInfo;
  },



  getOppEditData: function(practiceModel, codeFamilyId, callback) {
    //		log.debug("getEditData: "+theCase);
    var me = this,
      sapId = practiceModel.get('sapId'),
      request = {},
      notLoaded = false;

    if (!sapId) {
      Ext.callback(callback, me, [me, true]);
      return;
    }

    request['sapId'] = sapId;
    request['salesTeam'] = !(practiceModel.get('salesTeam').loaded);
    request['contacts'] = !practiceModel.get('contacts').loaded;
    request['codeFamily'] = Bn.getInstance('DomainCodeFamilyStore').findExact(
      'codeFamilyId',
      codeFamilyId) === -1;
    request['distributors'] = !Bn.getInstance('DomainDistributorStore').isLoaded();
    request['products'] = !Bn.getInstance('DomainOpportunityProductsStore').isLoaded();
    log.debug("request encoded=" + Ext.encode(request));

    for (var p in request) {
      //given that a request item must be loaded, property loop can stop
      //and ajax call can begin
      if (p !== 'sapId' && request[p]) {
        notLoaded = true;
      }
    }

    //if everything is already loaded, skip POST
    if (!notLoaded) {
      Ext.callback(callback, me, [me, true]);
      return;
    }

    Ext.Ajax.request({
        url: '/beacon/api/sales/opportunities/editdata?dc=' + Ext.Date.now(),

        action: 'read',
        method: 'POST',

        jsonData: Ext.encode(request),
        success: function(response) {
          log.debug('Response: ' + response);

          var responseData = Ext.decode(response.responseText, true),
            editData = responseData.data.opportunityEditData,
            codes = editData.codeFamily;

          //log.debug("editData=", editData);

          sapId = editData.sapId;

          //log.debug("codes="+codes, codes);
          if (codes) {
            var codeFamily = Ext.create(
              'Beacon.model.domain.code.CodeFamilyModel', codes);
            codeFamily.setData(codes);
            log.debug("codeFamily=" + codeFamily);

            Bn.getInstance('DomainCodeFamilyStore').add(codeFamily);
          }

          var contacts = editData.contacts;
          if (contacts) {
            log.debug("contacts=" + contacts, contacts);
            practiceModel.set('contacts', contacts);
            practiceModel.get('contacts').loaded = true;
          }

          var distributors = editData.distributors;
          var distStore = Bn.getInstance('DomainDistributorStore');
          if (distributors) {
            Ext.each(distributors, function(distributor) {
              var distObj = Ext.create(
                "Beacon.model.domain.distributor.DistributorModel",
                distributor);
              distObj.setData(distributor);

              distStore.add(distObj);

            });

            distStore.loaded = true;
          }

          var salesTeam = editData.salesTeam;
          if (salesTeam) {
            practiceModel.set('salesTeam', salesTeam);
            practiceModel.get('salesTeam').loaded = true;
          }

          var products = editData.products;
          if (products) {
            Bn.getInstance('DomainOpportunityProductsStore').setData(products);
            Bn.getInstance('DomainOpportunityProductsStore').loaded = true;
          }

          Ext.callback(callback, me, [me, true]);
        },
        failure: function() {
          log.error("failure" + arguments);
          Ext.callback(callback, me, [me, false]);
        }
      }

    );
  },

  formatCaseType: function(caseType, theCase) {
    var str = domain.getDisplayValue(caseType);
    var itemType = theCase ? theCase.get('ITEM_TYPE') : undefined;
    if (itemType) {
      str += ' - ' + domain.formatCode(itemType);
    }
    return str;
  },

  formatCode: function(code) {
    return Beacon.model.domain.code.CodeModel.toDisplayString(code);
  },

  formatMoney: function(record, amountKey, currencyKey) {
    if (record) {
      if (Ext.getClassName(record) === 'Beacon.model.domain.money.MoneyModel') {
        return Utils.Format.formatMoney(record);
      }
      return Utils.Format.formatMoney(record.get(amountKey),
        record.get(currencyKey, true));
    }
    return '';
  },

  getMoney: function(value, record, amountKey, currencyKey) {
    var amt = this.getValue(value, record, amountKey);
    var currency = this.getValue(undefined, record, currencyKey);
    if (amt) {
      return Beacon.model.domain.money.MoneyModel.getInstance(amt, currency);
    }
    return undefined;
  },

  formatStatus: function(value) {
    return Beacon.model.domain.status.StatusModel.toDisplayString(value);
  },

  formatDate: function(value) {
    return Utils.Format.formatDate(value);
  },

  getValue: function(rawvalue, record, key) {
    var value = rawvalue;
    if (!value && record) {
      if (record.get) {
        value = record.get(key);
      }
      if (!value && record.raw) {
        value = record.raw[key];
      }
    }
    return value;
  },

  loadCodeFamilyData: function(codeFamilyId) {
    var deferred = Ext.create('Deft.Deferred');

    StoreManager.getRecord('DomainCodeFamilyStore', codeFamilyId, {
      callback: function(codeFamily) {
        deferred.resolve(codeFamily);
      }
    });

    return deferred.promise;
  }
});
