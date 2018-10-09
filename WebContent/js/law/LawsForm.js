LawsForm = Ext.extend(Ext.Window, {
	// 内嵌FormPanel
	formPanel : null,
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		LawsForm.superclass.constructor.call(this, {
			layout : 'fit',
			id : 'LawsFormWin',
			iconCls : 'menu-notice',
			title : '录入法规',
			width : 700,
			height : 570,
			minWidth : 599,
			minHeight : 469,
			tbar : this.topBar,
			items : this.formPanel,
			maximizable : true,
			border : false,
			modal : true,
			plain : true
		});
	},// end of the constructor
	// 初始化组件
	initUIComponents : function() {
		var addMode = !this.id;
        var gridId = this.gridId;
		// 初始化form表单
		this.formPanel = new Ext.FormPanel({
			url : __ctxPath + '/law/saveLaws.do',
			layout : 'form',
			id : 'LawsForm',
			bodyStyle : 'padding:5px;',
			frame : false,
			formId : 'LawsFormId',
			defaultType : 'textfield',
			items : [ {
				name : 'laws.Id',
				id : 'id',
				xtype : 'hidden',
				value : this.id == null ? '' : this.id
			}, {
				fieldLabel : '标   题',
				name : 'laws.title',
				id : 'title',
				allowBlank : false,
				blankText : '标题不能为空',
				anchor : '50%'
			}, {
				//disabled:!addMode,
				xtype :'combo', //addMode ? 'combo' : 'hidden',
				fieldLabel : '颁布单位',
				hiddenName : 'laws.lawsAuthor.authorId',
				id : 'lawsAuthor.authorId',
				// mode : 'local',
				allowBlank : false,
				editable : false,
				triggerAction : 'all',
				displayField : 'authorName',
				valueField : 'authorId',
			    //emptyText:'请选择单位',
				store : new Ext.data.SimpleStore({
					autoLoad : true,
					url : __ctxPath + '/law/listLawsAuthor.do',
					fields : [ 'authorId', 'authorName' ]
				}),
				anchor : '50%'
			}, {
				fieldLabel : '颁布日期',
				name : 'laws.publishDate',
				id : 'publishDate',
				xtype : 'datefield',
				format : 'Y-m-d',
				allowBlank : false,
				editable : false,
				anchor : '50%'

			}, {
				fieldLabel : '实施日期',
				name : 'laws.implementDate',
				id : 'implementDate',
				xtype : 'datefield',
				format : 'Y-m-d',
				allowBlank : false,
				editable : false,
				anchor : '50%'
			}, {
				xtype : addMode ? 'hidden' : 'combo',
				fieldLabel : '审核状态',
				allowBlank : false,
				hiddenName : 'laws.status',
				id : 'status',
			    //emptyText : '请选择状态',
				mode : 'local',
				editable : false,
				triggerAction : 'all',
				store : [ [ '0', '审核失败' ], [ '1', '审核通过' ], [ '2', '审核中' ]],
				//width : 182
				anchor : '50%'
			}, {
				fieldLabel : '内容分类',
				hiddenName : 'laws.lawsType.typeId',
				id : 'lawsType.typeId',
				anchor : '50%',
				//disabled:!addMode,
				xtype : 'combo',//addMode ? 'combo' : 'hidden',
				allowBlank : false,
				editable : false,
				resizable : true,
				triggerAction : 'all',
				displayField : 'typeName',
				valueField : 'typeId',
				//emptyText:'请选择分类',
				store : new Ext.data.SimpleStore({
					autoLoad : true,
					url : __ctxPath + '/law/listLawsType.do',
					fields : [ 'typeId', 'typeName' ]
				})
			}, {
				fieldLabel : '内容',
				name : 'laws.content',
				id : 'content',
				xtype : 'fckeditor',
				autoHeight : true,
				width : '80%',
				height:350,
				allowBlank : false,
				blankText : '内容不能为空'
			} ]
		});// end of the formPanel

		if (!addMode) {
			this.formPanel.getForm().load({
						deferredRender : false,
						url : __ctxPath + '/law/getLaws.do?id=' + this.id,
						waitMsg : '正在载入数据...',
						success : function(form, action) {
							//Ext.getCmp('laws.lawsAuthor.authorId').hidden = true;
							var data = eval("(" + action.response.responseText
									+ ")").data;
							Ext.getCmp('publishDate')
									.setValue(data.publishDate);
							Ext.getCmp('implementDate').setValue(
									data.implementDate);
							//Ext.getCmp('laws.lawsType.typeId').v=data.lawsType.typeId;
							//Ext.getCmp('laws.lawsAuthor.authorId').v=data.lawsAuthor.authorId;
							Ext.getCmp('lawsType.typeId').setValue(data.lawsType.typeId);
							Ext.getCmp('lawsAuthor.authorId').setValue(data.lawsAuthor.authorId);
						},
						failure : function(form, action) {
							Ext.ux.Toast.msg('编辑', '载入失败');
						}
					});
		}
		this.topBar = new Ext.Toolbar({
			items : [ {
				iconCls : 'btn-save',
				text : '保存',
				xtype : 'button',
				scope : this,
				handler : function() {
					var lawsform = Ext.getCmp('LawsForm');
					if (lawsform.getForm().isValid()) {
					lawsform.getForm().submit({
						waitMsg : '正在提交用户信息',
						success : function(lawsform, o) {
							Ext.ux.Toast.msg('操作信息', '保存成功！');
							if(gridId=='LawsGrid'|| gridId==null||gridId==''){
							var tabs = Ext.getCmp('centerTabPanel');
								Ext.getCmp('LawsGrid').getStore().reload();
							} 
							if(gridId=='lawsTypeViewGrid'){
								Ext.getCmp('lawsTypeViewGrid').getStore().reload();
							}
							if(gridId=='lawsAuthorViewGrid'){
								Ext.getCmp('lawsAuthorViewGrid').getStore().reload();
							}
							
							Ext.getCmp('LawsFormWin').close();
						},
						failure : function(fp, action) {
							Ext.MessageBox.show({
								title : '操作信息',
								msg : '必填内容不能为空！',
								buttons : Ext.MessageBox.OK,
								icon : 'ext-mb-error'
							});
							window.close();
						}
					});
					
					}
					
				}
			}, {
				text : '取消',
				iconCls : 'btn-cancel',
				handler : function() {
					Ext.getCmp('LawsFormWin').close();
				}
			} ]
		});
	}// end of the initUIComponents
});
