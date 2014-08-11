/**
 * MyContactsPortlet
 */
Ext.define('Beacon.view.contact.MyContactsPortlet', {
	extend: 'Beacon.view.sales.GridPortlet',

    requires: [
		'Beacon.store.contact.MyContactsPortletStore'
	],

    alias: [
		'widget.mycontactsportlet',
		'widget.mycontacts'
	],

    title: '<a href="#sales/contacts">${Portlet.contactsTitle}</a>',
	itemId: "MyContactsPortlet",

	config: {
		loadStoreOnRender : true,
		buffered : true,
		store: 'MyContactsPortletStore',
		enableSearch: true
	},

    columns: [
        {
            dataIndex: 'displayName',
            text: '${Portlet.contactsDisplayName}',
            flex: 1
        },
        {
            dataIndex: 'roleStr',
            text: '${Portlet.contactsRole}',
            flex: 1
        },
        {
            dataIndex: 'firstPhoneNumber',
            text: '${Portlet.contactsPhone}'
        },
        {
            dataIndex: 'firstEmailAddress',
            text: '${Portlet.contactsEmail}'
        }
    ]


});
