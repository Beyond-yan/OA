JwArchivesForm = Ext.extend(Ext.Window, {
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		this.initUIComponents();
		JwArchivesForm.superclass.constructor.call(this, {
			id : 'JwArchivesFormWin',
			layout : 'fit',
			items : this.formPanel,
			modal : true,
			height : 500,
			width : 600,
			maximizable : true,
			title : '档案详细信息'
		});
	},
	initUIComponents : function() {
		this.formPanel = new Ext.FormPanel({
			layout : 'form',
			bodyStyle : 'padding:10px',
			border : false,
			autoScroll : true,
			defaults : {
				anchor : '96%,96%',
				maxLength : 500
			},
			defaultType : 'textfield',
			items : [ {
				name : 'jwArchives.id',
				xtype : 'hidden',
				value : this.id == null ? '' : this.id
			}, {
				fieldLabel : '标题',
				name : 'jwArchives.subject'
			}, {
				fieldLabel : '所属部门',
				name : 'jwArchives.sourcedepartment'
			}, {
				fieldLabel : '页数',
				name : 'jwArchives.page'
			}, {
				fieldLabel : '文号',
				name : 'jwArchives.docnum'
			}, {
				fieldLabel : '责任者',
				name : 'jwArchives.burden'
			}, {
				fieldLabel : '文种',
				name : 'jwArchives.doctype'
			}, {
				fieldLabel : '密级',
				name : 'jwArchives.securitydegree'
			}, {
				fieldLabel : '文件日期',
				name : 'jwArchives.day'
			}, {
				fieldLabel : '年份',
				name : 'jwArchives.bumfyear'
			}, {
				fieldLabel : '主题词',
				name : 'jwArchives.keywords'
			}, {
				fieldLabel : '附件编码',
				name : 'jwArchives.attachcode'
			}, {
				xtype:'panel',
				html : '可在“公文查询”菜单按上面的“附件编码”搜索后下载公文。'
			}   ]
		});
		
		if (this.id != null && this.id != 'undefined') {
			this.formPanel.loadData({
				url : __ctxPath + '/jw/getJwArchives.do?id=' + this.id,
				root : 'data',
				preName : 'jwArchives',
				success:function(r,o){
					//alert(r.responseText);
				}
			});
		}
	}
});