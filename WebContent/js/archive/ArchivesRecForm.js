/**
 * @createtime:2010-05-25
 * @author Ropen
 * @description 公文拟稿发文界面
 * @class ArchivesRecForm 
 * @extends Ext.Panel
 */
ArchivesRecForm = Ext.extend(Ext.Panel, {
	defId:null,
	setDefId:function(defId){
		this.defId=defId;
	},
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		//this.init();
		ArchivesRecForm.superclass.constructor.call(this, {
			layout:'hbox',
			layoutConfig: {
                            padding:'5',
                            pack:'center',
                            align:'middle'
            },
			title : '公文登记待办',
			id : 'ArchivesRecForm',
			iconCls : 'menu-archive-draft',
			items:[]
		});
		
		this.addFlowStartPanel(this);
	},
	addFlowStartPanel:function(topPanel){
		var archivesId=topPanel.archivesId;
		
		//取到发文流程的配置对应的defId
		Ext.Ajax.request({
			scope : this,
			url : __ctxPath+ '/archive/getFlowArchFlowConf.do?flowType=' + 1,
			success : function(response, options) {
				var rec = Ext.util.JSON.decode(response.responseText);
				if (rec.success) {
					$request({
						url:__ctxPath+ "/flow/getProcessActivity.do",
						params:{
							defId:rec.defId
						},
						success:function(resp,options){
							var panel=null;
							eval('panel= new ('+resp.responseText + ')();');
							//为里面的panel设置流程定义Id
							panel.defId=rec.defId;
							
							topPanel.add(panel);
							topPanel.doLayout();
							// 加载表单对应的数据
							var isSign=topPanel.isSign;
							if (archivesId != null && archivesId != 'undefined') {
								panel.formPanel.getForm().load({
									deferredRender : false,
									url : __ctxPath + '/archive/getArchives.do?archivesId='+ archivesId,
									waitMsg : '正在载入数据...',
									success : function(form, action) {
										var res = Ext.util.JSON.decode(action.response.responseText).data[0];
										if(isSign){
										   Ext.getCmp('ArchivesRecFormVm.archivesId').setValue('');
										   Ext.getCmp('ArchivesRecFormVm.orgArchivesId').setValue(archivesId);
										}
										var res = Ext.util.JSON
												.decode(action.response.responseText).data[0];
										var archRecType=res.archRecType;
										if(archRecType!=null){
											Ext.getCmp('ArchivesRecFormVm.recTypeId').setValue(archRecType.recTypeId);
										}
					                    Ext.getCmp('ArchivesRecFormVm.handelUIds').setValue(res.handlerUids);
										Ext.getCmp('ArchivesRecFormVm.createtime')
												.setValue(new Date(getDateFromFormat(
														res.createtime, "yyyy-MM-dd HH:mm:ss")));
										var docs = res.archivesDocs;
										var filePanel = Ext.getCmp('archivesRecFilePanel');
										var fileIds = Ext.getCmp("archivesRecfileIds");
										for (var i = 0; i < docs.length; i++) {
											if (fileIds.getValue() != '') {
												fileIds.setValue(fileIds.getValue() + ',');
											}
											fileIds.setValue(fileIds.getValue()
													+ docs[i].fileAttach.fileId);
											Ext.DomHelper
													.append(
															filePanel.body,
															'<span><a href="#" onclick="FileAttachDetail.show('
																	+ docs[i].fileAttach.fileId
																	+ ')">'
																	+ docs[i].fileAttach.fileName
																	+ '</a><img class="img-delete" src="'
																	+ __ctxPath
																	+ '/images/system/delete.gif" onclick="ArchivesRecForm.removeFile(this,'
																	+ docs[i].fileAttach.fileId
																	+ ')"/>&nbsp;|&nbsp;</span>');
										}
									},
									failure : function(form, action) {
									}
								});
							}
						}
					});
				}else{
					Ext.ux.Toast.msg('操作信息','你尚未定义发文流程~');
				}
			}
		});
	}
});
ArchivesRecForm.removeFile = function(obj, fileId) {
	var fileIds = Ext.getCmp("archivesRecfileIds");
	var value = fileIds.getValue();
	if (value.indexOf(',') < 0) {// 仅有一个附件
		fileIds.setValue('');
	} else {
		value = value.replace(',' + fileId, '').replace(fileId + ',', '');
		fileIds.setValue(value);
	}

	var el = Ext.get(obj.parentNode);
	el.remove();
}