JwReceivedDocsForm = Ext.extend(Ext.Window, {
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		this.initUIComponents();
		JwReceivedDocsForm.superclass.constructor.call(this, {
			id : 'JwReceivedDocsFormWin',
			layout : 'fit',
			items : this.formPanel,
			modal : true,
			height : 500,
			width : 600,
			maximizable : true,
			title : '收文详细信息'
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
				name : 'jwReceivedDocs.id',
				xtype : 'hidden',
				value : this.id == null ? '' : this.id
			}, {
				fieldLabel : '标题',
				name : 'jwReceivedDocs.unittitle'
			}, {
				fieldLabel : '收文号',
				name : 'jwReceivedDocs.acceptno'
			}, {
				fieldLabel : '缓急',
				name : 'jwReceivedDocs.urgencydegree'
			}, {
				fieldLabel : '密级',
				name : 'jwReceivedDocs.securitydegree'
			}, {
				fieldLabel : '来文机关',
				name : 'jwReceivedDocs.fromunit'
			}, {
				fieldLabel : '标题或事由',
				name : 'jwReceivedDocs.subject'
			}, {
				fieldLabel : '附件名称',
				name : 'jwReceivedDocs.attachfilename'
			}, {
				fieldLabel : '来文文号',
				name : 'jwReceivedDocs.docnum'
			}, {
				fieldLabel : '成文日期',
				name : 'jwReceivedDocs.dispatchdocdt'
			}, {
				fieldLabel : '签收人',
				name : 'jwReceivedDocs.signname'
			}, {
				fieldLabel : '主题词',
				name : 'jwReceivedDocs.topic'
			}, {
				fieldLabel : '承办部门',
				name : 'jwReceivedDocs.dept'
			}, {
				fieldLabel : '拟办意见',
				name : 'jwReceivedDocs.planmemo',
				xtype : 'textarea'
			}, {
				fieldLabel : '拟办人',
				name : 'jwReceivedDocs.planuser'
			}, {
				fieldLabel : '拟办时间',
				name : 'jwReceivedDocs.plandate'
			}, {
				fieldLabel : '领导批示',
				name : 'jwReceivedDocs.leadmemo',
				xtype : 'textarea'
			}, {
				fieldLabel : '批示人',
				name : 'jwReceivedDocs.leadname'
			}, {
				fieldLabel : '批示时间',
				name : 'jwReceivedDocs.leaddt'
			}, {
				fieldLabel : '附件编码',
				name : 'jwReceivedDocs.attachcode'
			}, {
				xtype:'panel',
				html : '可在“公文查询”菜单按上面的“附件编码”搜索后下载公文。'
			}   ]
		});

		if (this.id != null && this.id != 'undefined') {
			this.formPanel.loadData({
				url : __ctxPath + '/jw/getJwReceivedDocs.do?id=' + this.id,
				root : 'data',
				preName : 'jwReceivedDocs'
			});
		}
	}
});