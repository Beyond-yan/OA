JwAttachfileForm = Ext.extend(Ext.Window, {
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		this.initUIComponents();
		JwAttachfileForm.superclass.constructor.call(this, {
			id : 'JwAttachfileFormWin',
			layout : 'fit',
			items : this.formPanel,
			modal : true,
			height : 500,
			width : 600,
			maximizable : true,
			title : '公文详细信息'
		});
	},
	initUIComponents : function() {
		this.formPanel = new Ext.FormPanel({
			layout : 'form',
			bodyStyle : 'padding:10px',
			border : false,
			autoScroll : true,
			defaults : {
				anchor : '96%,96%'
			},
			defaultType : 'textfield',
			items : [ {
				name : 'jwAttachfile.id',
				xtype : 'hidden',
				value : this.id == null ? '' : this.id
			}, {
				fieldLabel : '附件编码',
				name : 'jwAttachfile.attachcode'
			}, {
				fieldLabel : '附件路径',
				name : 'jwAttachfile.filepath',
				xtype : 'panel'
			} ]
		});
		if (this.id != null && this.id != 'undefined') {
			this.formPanel.loadData({
				url : __ctxPath + '/jw/getJwAttachfile.do?id=' + this.id,
				root : 'data',
				preName : 'jwAttachfile'
			});
		}
	},
	reset : function() {
		this.formPanel.getForm().reset();
	},
	cancel : function() {
		this.close();
	},
	save : function() {
		$postForm({
			formPanel : this.formPanel,
			scope : this,
			url : __ctxPath + '/jw/saveJwAttachfile.do',
			callback : function(fp, action) {
				var gridPanel = Ext.getCmp('JwAttachfileGrid');
				if (gridPanel != null) {
					gridPanel.getStore().reload();
				}
				this.close();
			}
		});
	}
});