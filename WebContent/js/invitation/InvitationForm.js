/**
 * @author
 * @createtime
 * @class InvitationForm
 * @extends Ext.Window
 * @description InvitationForm表单
 */
InvitationForm = Ext.extend(Ext.Window, {
	// 内嵌FormPanel
	formPanel : null,
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		
		InvitationForm.superclass.constructor.call(this, {
					layout : 'form',
					id : 'InvitationFormWin',
					title : '标案详细信息',
					iconCls : 'menu-invitation',
					width : 822,
					height : 400,
					items : this.formPanel,
					border : false,
					modal : true,
					plain : true,
					buttonAlign : 'center',
					buttons : this.buttons
				});
	},// end of the constructor
	// 初始化组件
	initUIComponents : function() {
		// 初始化form表单
		this.formPanel = new Ext.FormPanel({
			url : __ctxPath + '/invitation/saveInvitation.do',
			layout : 'form',
			frame : false,
			// baseCls:'x-plain',
			layoutConfig : {
				padding : '5',
				pack : 'start',
				align : 'middle'
			},
			defaults : {
				margins : '0 5 0 0'
			},
			id : 'InvitationForm',
			frame : true,
			// autoWidth : true,
			// autoHeight : true,
			formId : 'InvitationFormId',
			items : [{
				xtype : 'fieldset',
				title : '标案信息(带 * 号为必填)',
				layout : 'form',
				/*rowspan : 2,
				labelWidth : 60,
				defaultType : 'textfield',
				width : 400,
				defaults : {
					width : 280
				},*/
				items : [{
					layout : 'column',
					items : [{
						layout : 'form',
						columnWidth : 0.5,
						defaults : {
							width : 200
						},
						items : [{
							name : 'invitation.invitationId',
							id : 'invitationId',
							xtype : 'hidden',
							value : this.invitationId == null
									? ''
									: this.invitationId
						}, {
							fieldLabel : '标案编号*',
							name : 'invitation.invitationNo',
							id : 'invitationNo',
							xtype : 'textfield',
							allowBlank : false,
							blankText : '标案编号不可为空!'
						}, {
							fieldLabel : '标案类型*',
							name : 'invitation.invitationType',
							id : 'invitationType',
							xtype : 'textfield',
							allowBlank : false,
							blankText : '标案类型不可为空!'
						}, {
							fieldLabel : '标案主题*',
							xtype : 'textfield',
							name : 'invitation.theme',
							id : 'theme',
							allowBlank : false,
							blankText : '标案主题不可为空!'
						}, {
							fieldLabel : '标案状态*',
							name : 'invitation.invitationStatus',
							id : 'invitationStatus',
							xtype : 'textfield',
							allowBlank : false,
							blankText : '标案状态不可为空!'
						}, {
							fieldLabel : '对应预算编号',
							xtype : 'textfield',
							name : 'invitation.budgetNo',
							id : 'budgetNo'
						}, {
							fieldLabel : '合同经办人*',
							name : 'invitation.draftsman',
							id : 'draftsman',
							xtype : 'textfield',
							allowBlank : false,
							blankText : '合同经办人不可为空!'
						}, {
							fieldLabel : '项目主办人*',
							name : 'invitation.undertaker',
							id : 'undertaker',
							xtype : 'textfield',
							allowBlank : false,
							blankText : '项目主办人不可为空!'
						}, {
							fieldLabel : '相关项目*',
							name : 'invitation.relatedItem',
							id : 'relatedItem',
							xtype : 'textfield',
							allowBlank : false,
							blankText : '相关项目不可为空!'
						}, {
							fieldLabel : '招标代理机构',
							xtype : 'textfield',
							name : 'invitation.agency',
							id : 'agency'
						}, {
							fieldLabel : '中标金额',
							xtype : 'numberfield',
							name : 'invitation.invitationMoney',
							id : 'invitationMoney'
						}]
					}, {
						layout : 'form',
						columnWidth : 0.5,
						defaults : {
							width : 200
						},
						items : [{
							fieldLabel : '对应的合同编码*',
							name : 'invitation.contractNo',
							id : 'contractNo',
							xtype : 'textfield',
							allowBlank : false,
							blankText : '对应的合同编码不可为空!'
						}, {
							fieldLabel : '项目主办部门*',
							name : 'invitation.undertakerDepartment',
							id : 'undertakerDepartment',
							xtype : 'textfield',
							allowBlank : false,
							blankText : '项目主办部门不可为空!'
						}, {
									fieldLabel : '预算金额',
									xtype : 'numberfield',
									name : 'invitation.budgetMoney',
									id : 'budgetMoney'
								}, {
							fieldLabel : '供应商',
							xtype : 'textfield',
							name : 'invitation.supplier',
							id : 'supplier'
						}, {
									fieldLabel : '备注',
									xtype : 'textarea',
									name : 'invitation.remarks',
									width : 200,
									id : 'remarks'
								}, {
									xtype : 'hidden',
									name : 'invitation.createby',
									value : ''
								}, {
									xtype : 'hidden',
									name : 'invitation.createdate',
									value : new Date().format('Y-m-d H:i:s')
								}, {
									xtype : 'hidden',
									name : 'invitation.lasteditby',
									value : ''
								}, {
									xtype : 'hidden',
									name : 'invitation.lasteditdate',
									value : new Date().format('Y-m-d H:i:s')
								}, {
									xtype : 'compositefield',
									fieldLabel : '标案附件',
									items : [{
										xtype : 'panel',
										id : 'displayInvitationAttach',
										width : 130,
										height : 65,
										frame : true,
										autoScroll : true,
										style : 'padding-left:0px;padding-top:0px;',
										html : ''
									}, {
										xtype : 'button',
										iconCls : 'btn-upload',
										text : '上传',
										width : 62,
										handler : function() {
											var dialog = App
													.createUploadDialog({
														file_cat : 'invitation',
														callback : uploadInvitationAttach
													});
											dialog.show('queryBtn');
										}
									}, {
										xtype : 'hidden',
										name : 'invitationAttachIDs',
										id : 'invitationAttachIDs'
									}]
								}]
					}]
				}]
			}]
		});// end of the formPanel

		if (this.invitationId != null && this.invitationId != 'undefined') {
			this.formPanel.getForm().load({
				deferredRender : false,
				url : __ctxPath + '/invitation/getInvitation.do?invitationId='
						+ this.invitationId,
				waitMsg : '正在载入数据...',
				success : function(form, action) {

					// 载入附件
					var af = action.result.data.invitationAttach;
					var filePanel = Ext.getCmp('displayInvitationAttach');
					var fileIds = Ext.getCmp("invitationAttachIDs");

					for (var i = 0; i < af.length; i++) {
						if (fileIds.getValue() != '') {
							fileIds.setValue(fileIds.getValue() + ',');
						}
						fileIds.setValue(fileIds.getValue() + af[i].fileId);

						Ext.DomHelper
								.append(
										filePanel.body,
										'<span><a href="#" onclick="FileAttachDetail.show('
												+ af[i].fileId
												+ ')">'
												+ af[i].fileName
												+ '</a><img class="img-delete" src="'
												+ __ctxPath
												+ '/images/system/delete.gif" onclick="removeInvitationAttach(this,'
												+ af[i].fileId
												+ ')"/>&nbsp;|&nbsp;</span>');
					}
				},
				failure : function(form, action) {
					Ext.ux.Toast.msg('编辑', '载入失败');
				}
			});
		}// end of load formPanel

		this.buttons = [{
					text : '保存',
					iconCls : 'btn-save',
					handler : function() {
						InvitationForm.saveInvitation();
					}
				}, {
					text : '取消',
					iconCls : 'btn-cancel',
					handler : function() {
						Ext.getCmp('InvitationFormWin').close();
					}
				}]
	}// end of the initUIComponents
});

/**
 * 保存标案方法
 */
InvitationForm.saveInvitation = function() {

	var fp = Ext.getCmp('InvitationForm');

	fp.getForm().submit({
				method : 'post',
				url : __ctxPath + '/invitation/saveInvitation.do',
				waitMsg : '正在提交数据...',
				success : function(fp, action) {
					Ext.ux.Toast.msg('操作信息', '成功保存信息！');
					var grid = Ext.getCmp('InvitationGrid');
					if (grid != null && grid != undefined) {
						Ext.getCmp('InvitationGrid').getStore().reload();
					}
					Ext.getCmp('InvitationFormWin').close();
				},
				failure : function(fp, action) {
					Ext.MessageBox.show({
								title : '操作信息',
								msg : action.result.msg,
								buttons : Ext.MessageBox.OK,
								icon : 'ext-mb-error'
							});
				}
			});

	// if (fp.getForm().isValid()) {}
}

/**
 * 上传合同附件
 */
function uploadInvitationAttach(data) {

	var fileIds = Ext.getCmp('invitationAttachIDs');
	var display = Ext.getCmp('displayInvitationAttach');
	for (var i = 0; i < data.length; i++) {
		if (fileIds.getValue() != '') {
			fileIds.setValue(fileIds.getValue() + ',');
		}
		fileIds.setValue(fileIds.getValue() + data[i].fileId);

		Ext.DomHelper
				.append(
						display.body,
						'<span><a href="#" onclick="FileAttachDetail.show('
								+ data[i].fileId
								+ ')">'
								+ data[i].filename
								+ '</a><img class="img-delete" src="'
								+ __ctxPath
								+ '/images/system/delete.gif" onclick="removeInvitationAttach(this,'
								+ data[i].fileId + ')"/>&nbsp;|&nbsp;</span>');
	}
}
/**
 * 删除合同附件
 * 
 * @param {}
 *            obj
 * @param {}
 *            _fileId
 */
function removeInvitationAttach(obj, _fileId) {
	var fileIds = Ext.getCmp("invitationAttachIDs");
	var value = fileIds.getValue();
	if (value.indexOf(',') < 0) {// 仅有一个附件
		fileIds.setValue('');
	} else {
		value = value.replace(',' + _fileId, '').replace(_fileId + ',', '');
		fileIds.setValue(value);
	}

	var el = Ext.get(obj.parentNode);
	el.remove();

	var invitationId = Ext.getCmp('invitationId').value;
	if (invitationId != null && invitationId != ''
			&& invitationId != 'undefined') {
		Ext.Ajax.request({
					url : __ctxPath + '/invitation/removeFileInvitation.do',
					params : {
						invitationId : invitationId,
						invitationAttachIDs : _fileId
					},
					method : 'post',
					success : function() {
						Ext.Ajax.request({
									url : __ctxPath
											+ '/system/multiDelFileAttach.do',
									params : {
										ids : _fileId
									},
									method : 'post',
									success : function() {
										Ext.ux.Toast.msg("信息提示", "成功删除所选记录！");
									}
								})
					}
				})
	} else {
		Ext.Ajax.request({
					url : __ctxPath + '/system/multiDelFileAttach.do',
					params : {
						ids : _fileId
					},
					method : 'post',
					success : function() {
						Ext.ux.Toast.msg("信息提示", "成功删除所选记录！");
					}
				})
	}
};