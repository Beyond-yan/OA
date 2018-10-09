JwSentDocsForm = Ext.extend(Ext.Window, {
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		this.initUIComponents();
		JwSentDocsForm.superclass.constructor.call(this, {
			id : 'JwSentDocsFormWin',
			layout : 'fit',
			items : this.formPanel,
			modal : true,
			height : 500,
			width : 700,
			maximizable : true,
			title : '发文详细信息'
		});
	},
	initUIComponents : function() {
		this.formPanel = new Ext.FormPanel({
			layout : 'form',
			bodyStyle : 'padding:20px',
			border : false,
			autoScroll : true,
			defaults : {
				anchor : '96%,96%'
			},
			defaultType : 'textfield',
			items : [ {
				name : 'jwSentDocs.id',
				xtype : 'hidden',
				value : this.id == null ? '' : this.id
			}, {
				fieldLabel : '标题',
				name : 'jwSentDocs.subject'
			}, {
				fieldLabel : '文号',
				name : 'jwSentDocs.docnum'
			}, {
				fieldLabel : '缓急',
				name : 'jwSentDocs.urgencydegree'
			}, {
				fieldLabel : '密级',
				name : 'jwSentDocs.securitydegree'
			}, {
				fieldLabel : '签发',
				name : 'jwSentDocs.signissuebody'
			}, {
				fieldLabel : '会签下部',
				name : 'jwSentDocs.signjointlybody'
			}, {
				fieldLabel : '主送',
				name : 'jwSentDocs.todept'
			}, {
				fieldLabel : '抄送',
				name : 'jwSentDocs.ccdept'
			}, {
				fieldLabel : '拟稿单位',
				name : 'jwSentDocs.composeunit'
			}, {
				fieldLabel : '拟稿人',
				name : 'jwSentDocs.composeuser'
			}, {
				fieldLabel : '核稿人',
				name : 'jwSentDocs.checkuser'
			}, {
				fieldLabel : '打印人',
				name : 'jwSentDocs.printuser'
			}, {
				fieldLabel : '校对人',
				name : 'jwSentDocs.proofuser'
			}, {
				fieldLabel : '分发单位',
				name : 'jwSentDocs.dispatchunit'
			}, {
				fieldLabel : '文种',
				name : 'jwSentDocs.docclass'
			}, {
				fieldLabel : '方向',
				name : 'jwSentDocs.docway'
			}, {
				fieldLabel : '主题',
				name : 'jwSentDocs.topic'
			}, {
				fieldLabel : '附件名',
				name : 'jwSentDocs.attachfilename'
			}, {
				fieldLabel : '附件编码',
				name : 'jwSentDocs.attachcode'
			}, {
				xtype:'panel',
				html : '可在“公文查询”菜单按上面的“附件编码”搜索后下载公文。'
			}  ]
		});
		
		if (this.id != null && this.id != 'undefined') {
			this.formPanel.loadData({
				url : __ctxPath + '/jw/getJwSentDocs.do?id=' + this.id,
				root : 'data',
				preName : 'jwSentDocs'
			});
		}
	}
});