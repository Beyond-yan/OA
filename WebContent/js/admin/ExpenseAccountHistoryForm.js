/**
 * @author
 * @createtime
 * @class ExpenseAccountHistoryForm
 * @extends Ext.Window
 * @description ExpenseAccountHistory表单
 * @company 捷达世软件
 */
ExpenseAccountHistoryForm = Ext.extend(Ext.Window, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		ExpenseAccountHistoryForm.superclass.constructor.call(this, {
					id : 'ExpenseAccountHistoryFormWin',
					layout : 'fit',
					items : this.formPanel,
					modal : true,
					height : 400,
					width : 500,
					maximizable : true,
					title : '费用报销历史维护',
					buttonAlign : 'center',
					buttons : [{
								text : '保存',
								iconCls : 'btn-save',
								scope : this,
								handler : this.save
							}, {
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
		
		
		this.formPanel = new Ext.FormPanel({
					layout : 'form',
					bodyStyle : 'padding:10px',
					border : false,
					autoScroll : true,
					// id : 'ExpenseAccountHistoryForm',
					defaults : {
						anchor : '96%,96%'
					},
					defaultType : 'textfield',
					items : [{
								name : 'expenseAccountHistory.id',
								xtype : 'hidden',
								value : this.id == null ? '' : this.id
							}, {
								fieldLabel : 'EXPENSE_ID',
								name : 'expenseAccountHistory.expenseId',
								allowBlank : false,
								//xtype : 'numberfield',
								xtype : 'hidden',
								value:this.expenseId==null?'':this.expenseId
							}, {
								fieldLabel : 'LEVEL_TYPE',
								name : 'expenseAccountHistory.levelType',
								//name : 'levelType',
								allowBlank : false,
								//xtype : 'numberfield',
								xtype : 'hidden',
								value:this.levelType==null?'':this.levelType
							}, {/*
								fieldLabel : 'COMPANY_ROLE',
								name : 'expenseAccountHistory.companyRole',
								xtype : 'numberfield'
							*/
			
				xtype : 'radiogroup',
					width:160,
				//	id:'expenseAccountPersonal.budgetType',
					fieldLabel : '签核范围',
					items : [ {
						boxLabel : '运营公司',
						name : 'expenseAccountHistory.companyRole',
						//name:'rb-auto',
						inputValue : 1,
						checked : true
						
					}, {
						boxLabel : '总公司',
						//name:'rb-auto1',
						name : 'expenseAccountHistory.companyRole',
						inputValue : 2
						//style:'pandding: 0,0px,3,100px'
					}]

						
							}, {
								fieldLabel : '签核说明',
								name : 'expenseAccountHistory.assignDesc',
								xtype : 'textarea',
								maxLength : 400
							}, {/*
								fieldLabel : 'POWER',
								name : 'expenseAccountHistory.power',
								allowBlank : false,
								xtype : 'numberfield'
							*/
				
					xtype : 'radiogroup',
					width:160,
					//id:'expenseAccountPersonal.budgetType',
					fieldLabel : '授权范围',
					items : [ {
						boxLabel : '授权范围内',
						name : 'expenseAccountHistory.power',
						//name:'rb-auto',
						inputValue : 0,
						checked : true
						
					}, {
						boxLabel : '授权范围外',
						//name:'rb-auto1',
						name : 'expenseAccountHistory.power',
						inputValue : 1
						//style:'pandding: 0,0px,3,100px'
					}]
			}, {
								fieldLabel : '签核日期',
								name : 'expenseAccountHistory.useDate',
								xtype : 'datefield',
								format : 'Y-m-d',
								value : new Date()
							}, {
						
					xtype : 'radiogroup',
					width:160,
					//id:'expenseAccountPersonal.budgetType',
					fieldLabel : '签核流程全部结束',
					items : [ {
						boxLabel : '是',
						name : 'expenseAccountHistory.isCompleted',
						//name:'rb-auto',
						inputValue :1
						
					}, {
						boxLabel : '否',
						//name:'rb-auto1',
						name : 'expenseAccountHistory.isCompleted',
						inputValue : 0,
						checked : true
						//style:'pandding: 0,0px,3,100px'
					}]	}/*{
								fieldLabel : 'CREATE_DATE',
								name : 'expenseAccountHistory.createDate',
								xtype : 'datefield',
								format : 'Y-m-d',
								value : new Date()
							}, {
								fieldLabel : 'CREATE_BY',
								name : 'expenseAccountHistory.createBy',
								maxLength : 50
							}, {
								fieldLabel : 'UPDATE_DATE',
								name : 'expenseAccountHistory.updateDate',
								xtype : 'datefield',
								format : 'Y-m-d',
								value : new Date()
							}, {
								fieldLabel : 'UPDATE_BY',
								name : 'expenseAccountHistory.updateBy',
								maxLength : 50
							}*/]
				});
		// 加载表单对应的数据
		if (this.id != null && this.id != 'undefined') {
			this.formPanel.loadData({
						url : __ctxPath
								+ '/admin/getExpenseAccountHistory.do?id='
								+ this.id,
						root : 'data',
						preName : 'expenseAccountHistory'
					});
		}

		/*if (this.expenseId != null && this.expenseId != 'undefined') {

			this.formPanel.loadData({
						url : __ctxPath + "/admin/listExpenseAccountHistory.do",
						// root : 'data',
						root : 'result',
					//	preName : 'expenseAccountHistory',
						method : 'post',
						params : {
							"Q_expenseId_L_EQ" : this.expenseId
						},

						success : function(fp, action) {
							Ext.ux.Toast.msg('操作信息', '加载成功!');
							var gridPanel = Ext
									.getCmp('ExpenseAccountPersonalGrid');
							if (gridPanel != null) {
								gridPanel.getStore().reload();
							}
							window.close();
						},
						failure : function(fp, action) {
							Ext.MessageBox.show({
										title : '操作信息',
										msg : '信息加载出错，请联系管理员！',
										buttons : Ext.MessageBox.OK,
										icon : 'ext-mb-error'
									});
							window.close();
						}
					});

		}*/

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
	save : function() {
		$postForm({
					formPanel : this.formPanel,
					scope : this,
					url : __ctxPath + '/admin/saveExpenseAccountHistory.do',
					callback : function(fp, action) {
					/*	var gridPanel = Ext.getCmp('ExpenseAccountHistoryGrid');
						if (gridPanel != null) {
							gridPanel.getStore().reload();
						}*/
						var gridPanel2 = Ext.getCmp('ExpenseAccountCompanyGrid');
						if (gridPanel2 != null) {
							gridPanel2.getStore().reload();
						}
						var gridPanel3 = Ext.getCmp('ExpenseAccountPersonalGrid');
						if (gridPanel3 != null) {
							gridPanel3.getStore().reload();
						}
						this.close();
					}
				});
	}// end of save

});