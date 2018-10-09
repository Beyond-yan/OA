/**
 * @author
 * @createtime
 * @class ExpenseAccountCompanyForm
 * @extends Ext.Window
 * @description ExpenseAccountCompany表单
 * @company 捷达世软件
 */
ExpenseAccountCompanyForm = Ext.extend(Ext.Window, {

	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		ExpenseAccountCompanyForm.superclass.constructor.call(this, {
					id : 'ExpenseAccountCompanyFormWin',
					layout : 'fit',
					items : this.formPanel,
					modal : true,
					height : 400,
					width : 600,
					autoScroll : true,
					maximizable : true,
					title : '公司费用报销详细信息',
					buttonAlign : 'center',
					buttons : [{
								text : '保存',
								iconCls : 'btn-save',
								scope : this,
								handler : this.save,
								id : 'companySave'
							}, {
								text : '重置',
								iconCls : 'btn-reset',
								scope : this,
								handler : this.reset,
								id : 'companyReset'
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
			id : 'ExpenseAccountCompanyForm',
			defaults : {
				anchor : '96%,96%'
			},
			defaultType : 'textfield',
			items : [{
						name : 'expenseAccountCompany.id',
						xtype : 'hidden',
						value : this.id == null ? '' : this.id
					},/*
						 * { fieldLabel : '经办人', name :
						 * 'expenseAccountCompany.applicantId', allowBlank :
						 * false, xtype : 'numberfield' }
						 */{
						fieldLabel : '申请日期',
						name : 'expenseAccountCompany.applyDate',
						allowBlank : false,
						xtype : 'datefield',
						format : 'Y-m-d',
						value : new Date()
					}, {
						xtype : 'container',
						layout : 'hbox',
						layoutConfigs : {
							align : 'middle'
						},
						/*
						 * defaults : { margins : '5px 5px 5px 15px ' },
						 */
						items : [{
									xtype : 'label',
									text : '申请付款部门:',
									width : 80,
									style : 'margin:0 3px 0 0px'
								}, {
									xtype : 'textfield',
									name : 'expenseAccountCompany.department.depName',
									readOnly : true,
									allowBlank : false,
									blankText : '请选择部门！',
									style : 'margin:0px 3px 5px 25px',
									width : 300,
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
															.getCmp('ExpenseAccountCompanyForm');
													fm
															.getCmpByName('expenseAccountCompany.department.depId')
															.setValue(depId);
													fm
															.getCmpByName('expenseAccountCompany.department.depName')
															.setValue(fullName);

												}, true).show();
									}
								}]

					}, {
						fieldLabel : '申请付款部门ID',
						name : 'expenseAccountCompany.department.depId',
						// allowBlank : false,
						// xtype : 'numberfield'//DepSelector
						xtype : 'hidden'
					},{
						fieldLabel : '经本人代码',
						name : 'expenseAccountCompany.applyId'
						
					},{
						fieldLabel : '经本人姓名',
						name : 'expenseAccountCompany.applyName'
						
					}, {
						fieldLabel : '申请付款事由',
						name : 'expenseAccountCompany.applyReason',
						allowBlank : false,
						xtype : 'textarea',
						maxLength : 400
					}, {
						fieldLabel : '合同编号',
						name : 'expenseAccountCompany.compactId',
						maxLength : 100
					}, {
						fieldLabel : '月度资金计划序号',
						name : 'expenseAccountCompany.monthAccountId'

					}, {/*
						 * fieldLabel : '预算性质', name :
						 * 'expenseAccountCompany.budgetType', allowBlank :
						 * false, xtype : 'numberfield'
						 */
						xtype : 'radiogroup',
						width : 160,
						// id:'expenseAccountPersonal.budgetType',
						fieldLabel : '预算性质',
						items : [{
									boxLabel : '预算内',
									name : 'expenseAccountCompany.budgetType',
									// name:'rb-auto',
									inputValue : 1,
									checked : true

								}, {
									boxLabel : '预算外',
									// name:'rb-auto1',
									name : 'expenseAccountCompany.budgetType',
									inputValue : 2
									// style:'pandding: 0,0px,3,100px'
							}]

					}, {
						fieldLabel : '预算项目代码',
						name : 'expenseAccountCompany.budgetProjectCode',
						maxLength : 100
					}, {
						fieldLabel : '预算项目名称',
						name : 'expenseAccountCompany.budgetProjectName',
						maxLength : 100
					}, {
						fieldLabel : '项目预算金额',
						name : 'expenseAccountCompany.budgetProjectAccount',
						maxLength : 18,
						xtype : 'numberfield'
					}, {
						fieldLabel : '累计已用金额',
						name : 'expenseAccountCompany.usedAccount',
						allowBlank : false,
						maxLength : 18,
						xtype : 'numberfield'
					}, {
						fieldLabel : '预付款金额',
						name : 'expenseAccountCompany.planPayment',
						maxLength : 18,
						xtype : 'numberfield'
					}, {
						fieldLabel : '付款方式',
						name : 'expenseAccountCompany.paymentType',
						maxLength : 50
					}, {
						fieldLabel : '本次申请金额',
						name : 'expenseAccountCompany.applyAccount',
						maxLength : 18,
						xtype : 'numberfield'
					}, {
						fieldLabel : '收款单位代码',
						name : 'expenseAccountCompany.outerCompanyCode',
						maxLength : 100
					}, {
						fieldLabel : '收款单位名称',
						name : 'expenseAccountCompany.outerCompanyName',
						maxLength : 100
					}, {
						fieldLabel : '开户银行',
						name : 'expenseAccountCompany.bankName',
						maxLength : 100
					}, {
						fieldLabel : '银行账号',
						name : 'expenseAccountCompany.bankCode',
						maxLength : 100
					}, {
						name : 'expenseAccountCompany.power',
						xtype : 'hidden'
						
					},/* {
						fieldLabel : '授权范围',
						name : 'expenseAccountCompany.powerName',
						allowBlank : false,
						id : 'powerId1'

					},*/{
									xtype : 'container',
									style : 'padding-left:0px;margin-bottom:4px;',
									id : 'powerId1',
									layout : 'column',
									//hidden : true,
									anchor : '98%,98%',
									items : [{
												xtype : 'label',
												style : 'padding-left:0px;',
												text : '授权范围:',
												width : 105
											}, {
												id : 'powerId2',
												xtype:'textfield',
												name : 'expenseAccountCompany.powerName'
												//width : 240
											
										}]
						
						
					},/*
						 * {
						 * 
						 * xtype : 'radiogroup', width : 160, // readOnly:true,
						 * id : 'powerId', // id:'expenseAccountCompany.power',
						 * fieldLabel : '授权范围', items : [{ boxLabel : '授权范围内',
						 * name : 'expenseAccountCompany.power', //
						 * name:'rb-auto', inputValue : 0, checked : true
						 *  }, { boxLabel : '授权范围外', // name:'rb-auto1', name :
						 * 'expenseAccountCompany.power', inputValue : 1 //
						 * style:'pandding: 0,0px,3,100px' }]
						 *  },
						 */{
						fieldLabel : '备注',
						name : 'expenseAccountCompany.remark',
						xtype : 'textarea',
						maxLength : 400
					},/*
						 * {xtype : 'hidden', name : 'fileIds' },{ xtype :
						 * 'compositefield', fieldLabel : '上传附件', layout :
						 * 'form', items : [{ xtype : 'textfield', fieldLabel :
						 * '地址', name : 'filePath', width : 300, readOnly : true }, {
						 * xtype : 'button', iconCls : 'btn-upload', text :
						 * '请选择', handler : this.upLoadFile }, { xtype :
						 * 'button', iconCls : 'btn-cancel', text : '取消',
						 * handler : this.delLoadFile }] }
						 */{
						xtype : 'compositefield',
						fieldLabel : '附件',
						items : [{
									xtype : 'panel',
									id : 'ExpenseAccountCompanyFormFilePanel',
									name : 'ExpenseAccountCompanyFormFilePanel',
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
						 * ,{ xtype : 'hidden', name :
						 * 'expenseAccountCompany.expenseCompanyFiles'
						 *  }
						 */

			/*
			 * { fieldLabel : 'STATUS', name : 'expenseAccountCompany.status',
			 * allowBlank : false, xtype : 'numberfield' }, { fieldLabel :
			 * 'IS_DELETED', name : 'expenseAccountCompany.isDeleted',
			 * allowBlank : false, xtype : 'numberfield' }, { fieldLabel :
			 * 'CREATE_DATE', name : 'expenseAccountCompany.createDate', xtype :
			 * 'datefield', format : 'Y-m-d', value : new Date() }, { fieldLabel :
			 * 'CREATE_BY', name : 'expenseAccountCompany.createBy', maxLength :
			 * 50 }, { fieldLabel : 'UPDATE_DATE', name :
			 * 'expenseAccountCompany.updateDate', xtype : 'datefield', format :
			 * 'Y-m-d', value : new Date() }, { fieldLabel : 'UPDATE_BY', name :
			 * 'expenseAccountCompany.updateBy', maxLength : 50 }
			 */]
		});
		// 加载表单对应的数据
		if (this.id != null && this.id != 'undefined') {
			this.formPanel.loadData({
				url : __ctxPath + '/admin/getExpenseAccountCompany.do?id='
						+ this.id,
				root : 'data',
				preName : 'expenseAccountCompany',
				success : function(response, obj) {

					var cf = Ext.util.JSON.decode(response.responseText);

					ExpenseAccountCompanyForm
							.setFilePanel(cf.data.expenseCompanyFiles);

			
					// Ext.getCmp('powerId').disable();

					if (tempValue == 0) {
						// 用于历史状态维护查看隐藏保存以及重置按钮
						Ext.getCmp('companySave').hide();
						Ext.getCmp('companyReset').hide();

						if (cf.data.power == 0) {
							Ext
									.getCmp('ExpenseAccountCompanyForm')
									.getCmpByName('expenseAccountCompany.powerName')
									.setValue("授权范围内");

						} else if (cf.data.power == 1) {
							Ext
									.getCmp('ExpenseAccountCompanyForm')
									.getCmpByName('expenseAccountCompany.powerName')
									.setValue("授权范围外");

						} else {
							Ext
									.getCmp('ExpenseAccountCompanyForm')
									.getCmpByName('expenseAccountCompany.power')
									.setValue(0);						

						}

					} else {

						Ext.getCmp('powerId1').hide();
						Ext
									.getCmp('ExpenseAccountCompanyForm')
									.getCmpByName('expenseAccountCompany.power')
									.setValue(0);

					}
				},
				failure : function(form, action) {
					Ext.ux.Toast.msg('操作提示', '对不起，数据加载有误！');
				}
			});
		}
		else{
		
		Ext.getCmp('powerId1').hide();
						/*Ext
									.getCmp('ExpenseAccountCompanyForm')
									.getCmpByName('expenseAccountCompany.power')
									.setValue(0);*/

		
		};

		/*
		 * if (this.docId != null && this.docId != 'undefined') {
		 * this.formPanel.getForm().load({ url : __ctxPath +
		 * '/document/getDocument.do?docId=' + this.docId, waitMsg :
		 * '正在载入数据...', success : function(form, action) { var
		 * doc=Ext.util.JSON.decode(action.response.responseText).data[0]; var
		 * folderId = doc.docFolder.folderId; var folderName =
		 * doc.docFolder.folderName;
		 * Ext.getCmp('DocumentForm.folderId').setValue(folderId);
		 * Ext.getCmp('folderSelect').setValue(folderName); var af =
		 * doc.attachFiles; var filePanel = Ext.getCmp('personFilePanel'); var
		 * fileIds = Ext.getCmp("DocumentForm.fileIds"); for (var i = 0; i <
		 * af.length; i++) { if (fileIds.getValue() != '') {
		 * fileIds.setValue(fileIds.getValue() + ','); }
		 * fileIds.setValue(fileIds.getValue() + af[i].fileId); Ext.DomHelper
		 * .append( filePanel.body, '<span><a href="#"
		 * onclick="FileAttachDetail.show(' + af[i].fileId + ')">' +
		 * af[i].fileName + '</a><img class="img-delete" src="' + __ctxPath +
		 * '/images/system/delete.gif" onclick="removeFile(this,' + af[i].fileId +
		 * ')"/>&nbsp;|&nbsp;</span>'); } }, failure : function(form, action) {
		 * Ext.MessageBox.show({ title : '操作信息', msg : '载入信息失败，请联系管理员！', buttons :
		 * Ext.MessageBox.OK, icon : 'ext-mb-error' }); } }); } return
		 * formPanel;
		 * 
		 * 
		 * 
		 * function removeFile(obj, fileId) { var fileIds =
		 * Ext.getCmp("DocumentForm.fileIds"); var value = fileIds.getValue();
		 * if (value.indexOf(',') < 0) {// 仅有一个附件 fileIds.setValue(''); } else {
		 * value = value.replace(',' + fileId, '').replace(fileId + ',', '');
		 * fileIds.setValue(value); }
		 * 
		 * var el = Ext.get(obj.parentNode); el.remove(); }
		 * 
		 */

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
		var fm = Ext.getCmp('ExpenseAccountCompanyForm');
		var applyAccount = fm
				.getCmpByName('expenseAccountCompany.applyAccount').getValue();
		var companyName = fm
				.getCmpByName('expenseAccountCompany.outerCompanyName')
				.getValue();
       var budgetProjectAccount=fm
				.getCmpByName('expenseAccountCompany.budgetProjectAccount')
				.getValue();
       var monthAccountId=fm
				.getCmpByName('expenseAccountCompany.monthAccountId')
				.getValue();
	  var planPayment=fm
				.getCmpByName('expenseAccountCompany.planPayment')
				.getValue();
				
	var applyId=fm.getCmpByName('expenseAccountCompany.applyId').getValue();	
	var applyName=fm.getCmpByName('expenseAccountCompany.applyName').getValue();	
				
		if (applyAccount == null || applyAccount == '') {
			Ext.ux.Toast.msg('操作提示', '本次申请金额是必填项，请检查！');
			fm.getCmpByName('expenseAccountCompany.applyAccount').focus(true);
			return;

		}

		if (companyName == null || companyName == '') {
			Ext.ux.Toast.msg('操作提示', '收款单位名称是必填项，请检查！');
			fm.getCmpByName('expenseAccountCompany.outerCompanyName')
					.focus(true);
			return;

		}
		
			if (budgetProjectAccount == null || budgetProjectAccount == '') {
			Ext.ux.Toast.msg('操作提示', '项目预算金额是必填项，请检查！');
			fm.getCmpByName('expenseAccountCompany.budgetProjectAccount')
					.focus(true);
			return;

		}
		
			if (monthAccountId == null || monthAccountId == '') {
			Ext.ux.Toast.msg('操作提示', '月度基金计划序列号是必填项，请检查！');
			fm.getCmpByName('expenseAccountCompany.monthAccountId')
					.focus(true);
			return;

		}
			if (planPayment == null || planPayment == '') {
			Ext.ux.Toast.msg('操作提示', '预付款金额是必填项，请检查！');
			fm.getCmpByName('expenseAccountCompany.planPayment')
					.focus(true);
			return;

		}
		if (applyName == null || applyName == '') {
			Ext.ux.Toast.msg('操作提示', '经办人姓名是必填项，请检查！');
			fm.getCmpByName('expenseAccountCompany.applyName')
					.focus(true);
			return;

		}
	if (applyId == null || applyId == '') {
			Ext.ux.Toast.msg('操作提示', '经办人代码是必填项，请检查！');
			fm.getCmpByName('expenseAccountCompany.applyId')
					.focus(true);
			return;

		}
		

		$postForm({
					formPanel : this.formPanel,
					scope : this,
					url : __ctxPath + '/admin/saveExpenseAccountCompany.do',
					callback : function(fp, action) {
						var gridPanel = Ext.getCmp('ExpenseAccountCompanyGrid');
						if (gridPanel != null) {
							gridPanel.getStore().reload();
						}
						this.close();
					}
				});
	},// end of save

	// ** 上传文件

	/*
	 * upLoadFile : function() { var dialog = App.createUploadDialog({ url :
	 * __ctxPath + '/file-upload', file_cat : 'admin/expenseCompany', callback :
	 * function(arr) { var str = ''; var filePath = ''; for (var i = 0; i <
	 * arr.length; i++) { str += arr[i].fileId + ","; filePath +=
	 * arr[i].filepath + ','; } str = str.substring(0, str.length - 1); var fm =
	 * Ext.getCmp('ExpenseAccountCompanyFormWin');
	 * fm.getCmpByName('fileIds').setValue(str);
	 * fm.getCmpByName('filePath').setValue(filePath .substring(0,
	 * filePath.length - 1)); } }); dialog.show('querybtn'); },
	 *  // 删除上传文件
	 * 
	 * delLoadFile : function() { var fm =
	 * Ext.getCmp('ExpenseAccountCompanyFormWin'); var fileIds =
	 * fm.getCmpByName('fileIds').value; if (fileIds != null && fileIds != '' &&
	 * fileIds != 'undefined') { Ext.Msg.confirm('确认信息', '您真的要删除上传文件吗？',
	 * function(btn) { if (btn == 'yes') { Ext.Ajax.request({ url : __ctxPath +
	 * '/system/multiDelFileAttach.do', method : 'post', params : { ids :
	 * fileIds }, success : function() { Ext.ux.Toast.msg('操作提示', '上传文件删除成功！');
	 * fm.getCmpByName('fileIds') .setValue(''); fm.getCmpByName('filePath')
	 * .setValue(''); }, failure : function() { Ext.ux.Toast.msg('操作提示',
	 * '对不起，您上传文件删除失败！'); } }); } }); } else { Ext.ux.Toast.msg('操作提示',
	 * '对不起，你还没有上传文件！'); } }
	 */
	/**
	 * 上传文件
	 */
	upLoadFile : function(self) {
		var formPanel = Ext.getCmp('ExpenseAccountCompanyForm');
		var dialog = App.createUploadDialog({
			file_cat : 'admin/expenseAccountCompany',
			callback : function(arr) {
				var tempFileIds = formPanel.getCmpByName('fileIds').getValue();
				var fileIds = '';
				// if(!(tempFileIds==null||''.equals(tempFileIds)))
				if (!(tempFileIds == null || tempFileIds == '')) {
					fileIds += tempFileIds + ',';

				}

				var filePanel = Ext
						.getCmp('ExpenseAccountCompanyFormFilePanel');
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
											+ '/images/system/delete.gif" onclick="removeResumeFile(this,'
											+ arr[i].fileId
											+ ')"/>&nbsp;|&nbsp;</span>');
				}
				formPanel.getCmpByName('fileIds').setValue(fileIds.substring(0,
						fileIds.length - 1));

				/*
				 * formPanel.getCmpByName('expenseAccountCompany.expenseCompanyFiles').setValue(fileIds.substring(0,fileIds.length -
				 * 1));
				 * alert("----files------"+formPanel.getCmpByName('expenseAccountCompany.expenseCompanyFiles').getValue());
				 */
			}
		});
		dialog.show('ExpenseAccountCompanyForm');
	}

});

/**
 * 上传文件删除
 */
function removeResumeFile(obj, fileId) {
	var fileIds = Ext.getCmp('ExpenseAccountCompanyForm')
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
ExpenseAccountCompanyForm.setFilePanel = function(records) {
	var fileIds = '';
	var filePanel = Ext.getCmp('ExpenseAccountCompanyFormFilePanel');

	for (var i = 0; i < records.length; i++) {
		fileIds += records[i].fileId + ',';
		var del = '<img class="img-delete" src="' + __ctxPath
				+ '/images/system/delete.gif" onclick="removeResumeFile(this,'
				+ records[i].fileId + ')"/>';
		Ext.DomHelper.append(filePanel.body,
				'<span><a href="#" onclick="FileAttachDetail.show('
						+ records[i].fileId + ')">' + records[i].fileName
						+ '</a>' + del + '&nbsp;|&nbsp;</span>');
	}
	Ext.getCmp('ExpenseAccountCompanyForm').getCmpByName('fileIds')
			.setValue(fileIds.substring(0, fileIds.length - 1));
};