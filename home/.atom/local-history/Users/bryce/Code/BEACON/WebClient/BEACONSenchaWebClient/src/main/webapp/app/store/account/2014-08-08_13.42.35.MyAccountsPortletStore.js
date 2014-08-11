
Ext.define('Beacon.store.account.MyAccountsPortletStore', {
    extend: 'Bn.custom.data.BnStore',
    alias: ['store.myaccountsportletstore'],
    id: 'MyAccountsPortletStore',

    requires: [
        'Beacon.model.account.MyAccountModel',
        'Beacon.common.data.proxy.BeaconRestProxy'
    ],

    config: {
        model: 'Beacon.model.account.MyAccountModel',
	storeId: 'MyAccountsPortletStore',
        autoLoad: false,
        buffered: true,
	trailingBufferZone : 1,
	leadingBufferZone : 1
        pageSize: 125,
	remoteFilter: true
    },

    proxy: {
        type: 'beaconrest',
        url: '/beacon/api/salesportal/accounts',
        timeout: 120000,
        actionMethods: {
            read: 'POST'
        },

        reader: {
            type: 'json',
            rootProperty: 'data.myAccountsResponse.MyAccountSummary',
            totalProperty: 'data.myAccountsResponse.TotalRowCount',
            successProperty: 'success'
        }
    }

});
