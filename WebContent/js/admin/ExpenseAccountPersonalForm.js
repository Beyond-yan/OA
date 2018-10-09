/**
 * @author
 * @createtime
 * @class ExpenseAccountPersonalForm
 * @extends Ext.Window
 * @description ExpenseAccountPersonal表单
 * @company 捷达世软件
 */

ExpenseAccountPersonalForm = Ext.extend(Ext.Window, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		ExpenseAccountPersonalForm.superclass.constructor.call(this, {
					id : 'ExpenseAccountPersonalFormWin',
					layout : 'form',
					items : [this.formPanel, this.gridPanel],
					modal : true,
					height : 500,
					width : 600,
					maximizable : true,
					autoScroll : true,
					title : '详细信息',
					buttonAlign : 'center',
					buttons : [{
						id : 'personalSave',
						text : '保存',
						iconCls : 'btn-save',
						scope : this,
						// handler : this.save
						handler : this.save
								.createCallback(this.formPanel, this)
					}, {
						id : 'personalReset',
						text : '重置',
						iconCls : 'btn-reset',
						scope : this,
						handler : this.reset
					}, {
						text : '取消',
						iconCls : 'btn-cancel',
						scope : this,
						handler : this.cancel
					}]
				});
	},// end of the constructor
	// 初始化组件
	initUIComponents : function() {
		var tempValue = this.tempValue;
		this.formPanel = new Ext.FormPanel({
			layout : 'form',
			bodyStyle : 'padding:10px',
			border : false,
			autoScroll : true,
			id : 'ExpenseAccountPersonalForm',
			defaults : {
				anchor : '96%,96%'
			},
			defaultType : 'textfield',
			items : [{
						name : 'expenseAccountPersonal.id',
						xtype : 'hidden',
						value : this.id == null ? '' : this.id
					},/*
						 * { fieldLabel : 'APPLICANT_ID', name :
						 * 'expenseAccountPersonal.applicantId', allowBlank :
						 * false, xtype : 'numberfield' },
						 */{/*
						 * fieldLabel : '报销部门', name :
						 * 'expenseAccountPersonal.depId', xtype : 'numberfield'
						 */

						xtype : 'container',
						layout : 'hbox',
						layoutConfigs : {
							align : 'middle'
						},
						/*
						 * defaults : { margins : '5px 5px 5px 14px ' },
						 */
						items : [{
									xtype : 'label',
									text : '申请付款部门',
									style : 'margin:0 3px 0 0px'
								}, {
									xtype : 'textfield',
									name : 'expenseAccountPersonal.department.depName',
									readOnly : true,
									allowBlank : false,
									blankText : '请选择部门！',
									width : 300,
									style : 'margin:0px 3px 10px 33px',
									maxLength : 256,
									maxLengthText : '数据长度不能超过256个字符！'
								}, {
									xtype : 'button',
									text : '请选择',
									iconCls : 'btn-user-sel',
									handler : function() {
										DepSelector.getView(
												function(depId, fullName) {

													var fm = Ext
															.getCmp('ExpenseAccountPersonalForm');
													fm
															.getCmpByName('expenseAccountPersonal.department.depId')
															.setValue(depId);
													fm
															.getCmpByName('expenseAccountPersonal.department.depName')
															.setValue(fullName);

												}, true).show();
									}
								}, {
									fieldLabel : '申请付款部门ID',
									name : 'expenseAccountPersonal.department.depId',
									// allowBlank : false,
									// xtype : 'numberfield'//DepSelector
									xtype : 'hidden'
								}]

					}, {

						fieldLabel : '申请日期',
						name : 'expenseAccountPersonal.applyDate',
						allowBlank : false,
						xtype : 'datefield',
						format : 'Y-m-d',
						value : new Date()
					}, {
						fieldLabel : '已借款金额',
						name : 'expenseAccountPersonal.borrowedAccount',
						allowBlank : false,
						maxLength : 18,
						xtype : 'numberfield'
					}, {
						fieldLabel : '合计',
						name : 'expenseAccountPersonal.sumAccount',
						allowBlank : false,
						maxLength : 18,
						xtype : 'numberfield'
					}, {/*
						 * fieldLabel : '预算性质', name :
						 * 'expenseAccountPersonal.budgetType', allowBlank :
						 * false, xtype : 'numberfield'
						 */

						xtype : 'radiogroup',
						width : 160,
						// id:'expenseAccountPersonal.budgetType',
						fieldLabel : '预算性质',
						items : [{
									boxLabel : '预算内',
									name : 'expenseAccountPersonal.budgetType',
									// name:'rb-auto',
									inputValue : 1,
									checked : true

								}, {
									boxLabel : '预算外',
									// name:'rb-auto1',
									name : 'expenseAccountPersonal.budgetType',
									inputValue : 2
									// style:'pandding: 0,0px,3,100px'
							}]

					}, {
						fieldLabel : '预算项目代码',
						name : 'expenseAccountPersonal.budgetProjectCode',
						maxLength : 100
					}, {
						fieldLabel : '预算项目名称',
						name : 'expenseAccountPersonal.budgetProjectName',
						maxLength : 100
					}, {
						fieldLabel : '项目预算金额',
						name : 'expenseAccountPersonal.budgetProjectAccount',
						maxLength : 18,
						xtype : 'numberfield'
					}, {
						fieldLabel : '累计已用金额',
						name : 'expenseAccountPersonal.usedAccount',
						allowBlank : false,
						maxLength : 18,
						xtype : 'numberfield'
					}, {
						fieldLabel : '可用额度',
						name : 'expenseAccountPersonal.leftAccount',
						maxLength : 18,
						xtype : 'numberfield'
					}, {
						fieldLabel : '月度资金计划序号',
						name : 'expenseAccountPersonal.monthAccountId'
						// xtype : 'numberfield'
				}	, {

						xtype : 'hidden',
						name : 'expenseAccountPersonal.power'

					}, {

						xtype : 'container',
						style : 'padding-left:0px;margin-bottom:4px;',
						id : 'powerIdPersonal',
						layout : 'column',
						// hidden : true,
						anchor : '98%,98%',
						items : [{
									xtype : 'label',
									style : 'padding-left:0px;',
									text : '授权范围:',
									width : 105
								}, {
									id : 'powerIdPersonal2',
									xtype : 'textfield',
									name : 'expenseAccountPersonal.powerName'
									// width : 240
							}]

					}, /*{

						xtype : 'radiogroup',
						width : 160,
						id : 'powerIdPersonal',
						// readOnly : true,
						// id:'expenseAccountPersonal.budgetType',
						// fieldLabel : '授权范围',
						items : [{
									xtype : 'label',
									text : '授权范围:',
									width : 104

								}, {
									boxLabel : '授权范围内',
									name : 'expenseAccountPersonal.power',
									// name:'rb-auto',
									inputValue : 0,
									checked : true

								}, {
									boxLabel : '授权范围外',
									// name:'rb-auto1',
									name : 'expenseAccountPersonal.power',
									inputValue : 1
									// style:'pandding: 0,0px,3,100px'
							}]

					}, */{
						fieldLabel : '备注',
						name : 'expenseAccountPersonal.remark',
						xtype : 'textarea',
						maxLength : 400
					}, {

						xtype : 'compositefield',
						fieldLabel : '附件',
						items : [{
									xtype : 'panel',
									id : 'ExpenseAccountPersonalFormFilePanel',
									name : 'ExpenseAccountPersonalFormFilePanel',
									// name :
									// 'expenseAccountCompany.expenseCompanyFiles',
									border : true,
									height : 50,
									width : 190
								}, {
									xtype : 'button',
									iconCls : 'btn-upload',
									text : '上传',
									handler : this.upLoadFile
											.createCallback(this)
								}, {
									xtype : 'hidden',
									name : 'fileIds'
								}]

					}/*
						 * , { fieldLabel : 'STATUS', name :
						 * 'expenseAccountPersonal.status', allowBlank : false,
						 * xtype : 'numberfield' }, { fieldLabel : 'IS_DELETED',
						 * name : 'expenseAccountPersonal.isDeleted', allowBlank :
						 * false, xtype : 'numberfield' }, { fieldLabel :
						 * 'CREATE_DATE', name :
						 * 'expenseAccountPersonal.createDate', xtype :
						 * 'datefield', format : 'Y-m-d', value : new Date() }, {
						 * fieldLabel : 'CREATE_BY', name :
						 * 'expenseAccountPersonal.createBy', maxLength : 50 }, {
						 * fieldLabel : 'UPDATE_DATE', name :
						 * 'expenseAccountPersonal.updateDate', xtype :
						 * 'datefield', format : 'Y-m-d', value : new Date() }, {
						 * fieldLabel : 'UPDATE_BY', name :
						 * 'expenseAccountPersonal.updateBy', maxLength : 50 }
						 */]
		});

		// 加载表单对应的数据
		if (this.id != null && this.id != 'undefined') {
			this.formPanel.loadData({
				url : __ctxPath + '/admin/getExpenseAccountPersonal.do?id='
						+ this.id,
				root : 'data',
				preName : 'expenseAccountPersonal',
				success : function(response, obj) {

					var cf = Ext.util.JSON.decode(response.responseText);

					ExpenseAccountPersonalForm
							.setFilePanel(cf.data.expensePersonalFiles);

					if (tempValue == 0) {
						// 用于历史状态维护查看隐藏保存以及重置按钮
						Ext.getCmp('personalSave').hide();
						Ext.getCmp('personalReset').hide();
						// Ext.getCmp('powerIdPersonal').disable();//
						// 历史状态查看时能查看到此笔记录的授权范围
						if (cf.data.power == 0) {
							Ext
									.getCmp('ExpenseAccountPersonalForm')
									.getCmpByName('expenseAccountPersonal.powerName')
									.setValue("授权范围内");

						} else if (cf.data.power == 1) {
							Ext
									.getCmp('ExpenseAccountPersonalForm')
									.getCmpByName('expenseAccountPersonal.powerName')
									.setValue("授权范围外");

						} else {
							Ext
									.getCmp('ExpenseAccountPersonalForm')
									.getCmpByName('expenseAccountPersonal.power')
									.setValue(0);

						}

					} else {
						Ext.getCmp('powerIdPersonal').hide();
						
					}
				},
				failure : function(form, action) {
					Ext.ux.Toast.msg('操作提示', '对不起，数据加载有误！');
				}
			});
		} else {
			Ext.getCmp('powerIdPersonal').hide();
	//Ext.getCmp('ExpenseAccountPersonalForm').getCmpByName('expenseAccountPersonal.power').setValue(0);

		}

		this.store = new Ext.data.Store({
					proxy : new Ext.data.HttpProxy({
								url : __ctxPath
										+ '/admin/listExpenseAccountPersonalDetail.do'
							}),
					reader : new Ext.data.JsonReader({
								root : 'result',
								totalProperty : 'totalCounts',
								// id : 'id',
								fields : [{
											name : 'id',
											type : 'int'
										}, 'name', 'amount', 'description',
										'expenseId', 'price', 'account']
							}),
					remoteSort : false
				});
		if (this.id != null && this.id != '' && this.id != "") {
			this.store.setDefaultSort('amount', 'ASC');
			this.store.load({
						params : {
							'Q_expenseAccountPersonal.id_L_EQ' : this.id,
							start : 0,
							limit : 25
						}

					});
		}
		/*
		 * this.rowActions = new Ext.ux.grid.RowActions( { header : '管理', width :
		 * 80, actions : [ { iconCls : 'btn-del',
		 * 
		 * 
		 * qtip : '删除', style : 'margin:0 3px 0 3px' }, { iconCls : 'btn-edit',
		 * qtip : '编辑', style : 'margin:0 3px 0 3px' } ] });
		 */
		var sm = new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel({
					columns : [sm, new Ext.grid.RowNumberer(), {
						header : 'id',
						dataIndex : 'id',
						hidden : true,
						autoScroll : true
							// 根据Id删除信息
						}, {
						header : 'expenseId',
						dataIndex : 'expenseId',
						hidden : true
					}, {
						header : '报销项目',
						dataIndex : 'name',
						editor : new Ext.form.TextField({
									allowBlank : false
								})
					}, {
						header : '数量',
						dataIndex : 'amount',
						editor : new Ext.form.NumberField({
							// allowBlank : false,
							maxValue : 10000
								// blankText : '数量不能为空！'

							})

					}, {
						header : '单价',
						dataIndex : 'price',
						editor : new Ext.form.NumberField({})

					}, {

						header : '金额',
						dataIndex : 'account',
						editor : new Ext.form.NumberField({
									allowBlank : false,
									blankText : '金额不能为空！'

								})
					}, {
						header : '描述',
						dataIndex : 'description',
						editor : new Ext.form.TextField({
									allowBlank : true
								})
					}
					// , this.rowActions
					],
					defaults : {
						sortable : true,
						menuDisabled : true,
						width : 100
					}
				});// end of the cm

		// this.roomId=Ext.getCmp("BoardrooForm").getCmp('boardroo.roomId').getValue();

		this.topbar = new Ext.Toolbar({
					id : 'thisTopBar',
					height : 30,
					bodyStyle : 'text-align:right',
					menuAlign : 'center',
					items : []
				});
		// 删除
		this.topbar.add(new Ext.Button({
			iconCls : 'btn-del',
			text : '删除',
			scope : this,

			// --cxt
			// }
			// BoardrooFormWin:this.BoardrooFormWin,
			handler : function() {
				var grid = Ext.getCmp("ExpenseAccountPersonalGrid");
				var selectRecords = grid.getSelectionModel().getSelections();
				var info = '';

				// var form=Ext.getCom("BoardrooForm");
				if (selectRecords.length == 0) {
					Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
					return;
				} else {
					info = selectRecords[0].data.id;
					// alert(roomInfo);
					// this.roomInfo = Ext.getCmp('boardroo.roomId').getValue();
				}
				var ids = new Array();
				for (var i = 0; i < selectRecords.length; i++) {
					ids.push(selectRecords[i].data.id);
				}

				// --cxt

				Ext.Ajax.request({
					url : __ctxPath
							+ '/admin/multiDelExpenseAccountPersonalDetail.do',
					method : 'post',
					params : {
						ids : ids
					},
					success : function() {
						/*
						 * Ext.ux.Toast.msg("info", "this.info:" + info);
						 */
						Ext.ux.Toast.msg("操作提示", "成功删除所选记录！");

						if (info != null && info != '') {
							grid.getStore().reload({
										params : {
											start : 0,
											limit : 25,
											'Q_expenseAccountPersonal.id_L_EQ' : info
										}
									});
						}
					},
					failure : function() {
						Ext.ux.Toast.msg('操作提示', '对不起，删除数据操作失败！');
					}
				});
				// --cxt

			}

		}));

		// 新增
		this.topbar.add(new Ext.Button({
					iconCls : 'btn-add',
					text : '新增',
					scope : this,
					handler : function() {

						var recordType = this.store.recordType;
						this.store.add(new recordType());

					}
				}));

		this.gridPanel = new Ext.grid.EditorGridPanel({
					id : 'ExpenseAccountPersonalGrid',
					tbar : this.topbar,
					region : 'center',
					store : this.store,
					trackMouseOver : true,
					disableSelection : false,
					loadMask : true,
					// autoHeight : true,
					clicksToEdit : 1,
					stripeRows : true,
					height : 150,
					cm : cm,
					sm : sm,
					// plugins : this.rowActions,
					viewConfig : {
						forceFit : true,
						autoFill : true
					},
					bbar : new Ext.PagingToolbar({
								pageSize : 25,
								store : this.store,
								displayInfo : true,
								displayMsg : '当前显示从{0}至{1}， 共{2}条记录',
								emptyMsg : "当前没有记录"
							})
				});

	},// end of the initcomponents

	/**
	 * 重置
	 * 
	 * @param {}
	 *            formPanel
	 */
	reset : function() {
		this.formPanel.getForm().reset();
	},
	/**
	 * 取消
	 * 
	 * @param {}
	 *            window
	 */
	cancel : function() {
		this.close();
	},
	/**
	 * 保存记录
	 */
	save : function(formPanel, window) {/*
										 * 
										 * $postForm( { formPanel :
										 * this.formPanel, scope : this, url :
										 * __ctxPath +
										 * '/admin/saveExpenseAccountPersonal.do',
										 * callback : function(fp, action) { var
										 * gridPanel =
										 * Ext.getCmp('ExpenseAccountPersonalGrid');
										 * if (gridPanel != null) {
										 * gridPanel.getStore().reload(); }
										 * this.close(); } });
										 * 
										 */

		var fm = Ext.getCmp('ExpenseAccountPersonalForm');
		var mouthAccountId1 = fm
				.getCmpByName('expenseAccountPersonal.monthAccountId')
				.getValue();
		var budgetProjectAccount1 = fm
				.getCmpByName('expenseAccountPersonal.budgetProjectAccount')
				.getValue();
		var leftAccount1 = fm
				.getCmpByName('expenseAccountPersonal.leftAccount').getValue();

		if (mouthAccountId1 == null || mouthAccountId1 == '') {
			Ext.ux.Toast.msg('操作提示', '月度资金计划序号是必填项，请检查！');
			fm.getCmpByName('expenseAccountPersonal.monthAccountId')
					.focus(true);
			return;

		}

		if (budgetProjectAccount1 == null || budgetProjectAccount1 == '') {
			Ext.ux.Toast.msg('操作提示', '项目预算金额是必填项，请检查！');
			fm.getCmpByName('expenseAccountPersonal.budgetProjectAccount')
					.focus(true);
			return;

		}
		if (leftAccount1 == null || leftAccount1 == '') {
			Ext.ux.Toast.msg('操作提示', '可用额度栏位是必填项，请检查！');
			fm.getCmpByName('expenseAccountPersonal.leftAccount').focus(true);
			return;

		}

		var details = [];
		var gridPanel = Ext.getCmp('ExpenseAccountPersonalGrid');
		if (gridPanel != null) {
			var store = gridPanel.getStore();
			for (var i = 0; i < store.getCount(); i++) {
				if (store.getAt(i).get('account') == null) {
					Ext.ux.Toast.msg('操作信息', '金额是必填项!');
					return;
				}
				if (store.getAt(i).get('name') == null) {
					Ext.ux.Toast.msg('操作信息', '项目名称是必填项!');
					return;
				}
				details.push(store.getAt(i).data);
				// alert("--details--"+details[i]);
			}
		}
		if (formPanel.getForm().isValid()) {

			// alert(formPanel.getForm().isValid());
			formPanel.getForm().submit({
						scope : this,
						url : __ctxPath
								+ '/admin/saveExpenseAccountPersonal.do',
						params : {
							details : Ext.encode(details)
						},
						method : 'post',
						waitMsg : '数据正在提交，请稍后...',
						success : function(fp, action) {
							Ext.ux.Toast.msg('操作信息', '成功保存信息!');
							var gridPanel = Ext
									.getCmp('ExpenseAccountPersonalGrid');
							if (gridPanel != null) {
								gridPanel.getStore().reload();
							}
							window.close();
						},
						failure : function(fp, action) {
							// var obj=Ext.decode(fp.responseText);
							// var obj=Ext.decode(fp.prototype);
							// alert("-------"+fp.toLocaleString());

							Ext.MessageBox.show({
										title : '操作信息',
										msg : '信息保存出错，请联系管理员！',
										buttons : Ext.MessageBox.OK,
										icon : 'ext-mb-error'
									});
							window.close();
						},
						again : function(fp, action) {
							Ext.MessageBox.show({
										title : '操作信息',
										msg : '信息保存出错，您输入的会议室编号已存在！',
										buttons : Ext.MessageBox.OK,
										icon : 'ext-mb-error'
									});
							window.close();
						}
					});
		}

	},// end of save

	upLoadFile : function(self) {

		var formPanel = Ext.getCmp('ExpenseAccountPersonalForm');
		var dialog = App.createUploadDialog({
			file_cat : 'admin/expenseAccountPersonal',
			callback : function(arr) {
				var tempFileIds = formPanel.getCmpByName('fileIds').getValue();

				var fileIds = '';
				if (!(tempFileIds == null || tempFileIds == '')) {
					fileIds += tempFileIds + ',';

				}
				var filePanel = Ext
						.getCmp('ExpenseAccountPersonalFormFilePanel');
				for (var i = 0; i < arr.length; i++) {
					fileIds += arr[i].fileId + ',';
					Ext.DomHelper
							.append(
									filePanel.body,
									'<span><a href="#" onclick="FileAttachDetail.show('
											+ arr[i].fileId
											+ ')">'
											+ arr[i].filename
											+ '</a><img class="img-delete" src="'
											+ __ctxPath
											+ '/images/system/delete.gif" onclick="removeResumeFile2(this,'
											+ arr[i].fileId
											+ ')"/>&nbsp;|&nbsp;</span>');
				}
				formPanel.getCmpByName('fileIds').setValue(fileIds.substring(0,
						fileIds.length - 1));

			}
		});
		dialog.show('ExpenseAccountPersonalForm');
	}

});

/**
 * 上传文件删除
 */
function removeResumeFile2(obj, fileId) {

	var fileIds = Ext.getCmp('ExpenseAccountPersonalForm')
			.getCmpByName('fileIds');
	var value = fileIds.getValue();
	if (value.indexOf(',') < 0) {// 仅有一个附件
		fileIds.setValue('');
	} else {
		value = value.replace(',' + fileId, '').replace(fileId + ',', '');
		fileIds.setValue(value);
	}

	var el = Ext.get(obj.parentNode);
	el.remove();
};
/**
 * 显示附件列表
 */
ExpenseAccountPersonalForm.setFilePanel = function(records) {
	var fileIds = '';
	var filePanel = Ext.getCmp('ExpenseAccountPersonalFormFilePanel');

	for (var i = 0; i < records.length; i++) {
		fileIds += records[i].fileId + ',';
		var del = '<img class="img-delete" src="' + __ctxPath
				+ '/images/system/delete.gif" onclick="removeResumeFile2(this,'
				+ records[i].fileId + ')"/>';
		Ext.DomHelper.append(filePanel.body,
				'<span><a href="#" onclick="FileAttachDetail.show('
						+ records[i].fileId + ')">' + records[i].fileName
						+ '</a>' + del + '&nbsp;|&nbsp;</span>');
	}
	Ext.getCmp('ExpenseAccountPersonalForm').getCmpByName('fileIds')
			.setValue(fileIds.substring(0, fileIds.length - 1));
};