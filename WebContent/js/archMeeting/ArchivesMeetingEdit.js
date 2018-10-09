var ArchivesMeetingEdit = function(noticeId,proName,defId,isshow,callback) {
	this.noticeId=noticeId;
	this.isshow=isshow; 
	// 初始化附件文档
	this.docGridPanel = new MeetingNoticeUtil({
		panelId : 'ArchivesMeetingEditfp',
		noticeId : this.noticeId
	}).getGridPanelWithFullTools();
	var formPanel = new Ext.FormPanel({
		url : __ctxPath + '/meetingNotice/saveMeetingNotice.do',
		frame : false,
		border : false,
		id:'ArchivesMeetingEditfp',
		layout : 'form',
		labelWidth : 80,
		width : 740,
		padding : '5px',
		reader : new Ext.data.JsonReader({
					root : 'data'
				}, [{
						name : 'meetingNotice.noticeId',
						mapping : 'noticeId'
					},{
						   name:'meetingNotice.subject',
						   mapping:'subject'		
						}, {
						name : 'meetingNotice.host',
						mapping : 'host'
					}, {
						name : 'meetingNotice.holdDep',
						mapping : 'holdDep'
					}, {
						name : 'meetingNotice.meetingDate',
						mapping : 'meetingDate'
					}, {
						name : 'meetingNotice.meetingPlace',
						mapping : 'meetingPlace'
					}, {
					    name:'meetingNotice.meetingState',
					    mapping:'meetingState'
					}, {
						name : 'meetingNotice.reviewUser',
						mapping : 'reviewUser'
					}, {
						name : 'meetingNotice.departureTime',
						mapping : 'departureTime'
					}, {
						name : 'meetingNotice.departurePlace',
						mapping : 'departurePlace'
					}, {
						name : 'meetingNotice.vehicleInfo',
						mapping : 'vehicleInfo'
					}, {
						name : 'meetingNotice.driverInfo',
						mapping : 'driverInfo'
					}, {
						name : 'meetingNotice.mainDep',
						mapping : 'mainDep'
					}, {
						name:'meetingNotice.mainDepId',
						mapping:'mainDepId'
					}, {
						name:'meetingNotice.status',
						mapping:'status'
					}, {
						name:'meetingNotice.createTime',
						mapping:'createTime'
					}, {
						name:'meetingNotice.creator',
						mapping:'creator'
					}, {
						name:'meetingNotice.creatorId',
						mapping:'creatorId'
					}, {
						name:'meetingNotice.createDep',
						mapping:'createDep'
					}, {
						name:'meetingNotice.createDepId',
						mapping:'createDepId'
					}]),
		items : [{
					xtype : 'textfield',
					fieldLabel : '会议名称',
					name : 'meetingNotice.subject',
					width:640,
					allowBlank : false
				},{
					border : false,
					layout : 'column',
					defaults : {
						border : false,
						columnWidth : .49,
						layout : 'form',
						defaults : {
							width : 270,
							xtype : 'textfield',
							allowBlank : false
						}
					},
					items:[{
							items:[{
								xtype : 'textfield',
								fieldLabel : '召集单位',
								name : 'meetingNotice.holdDep',
								allowBlank : false
							},{
								fieldLabel : '会议时间',	
								name : 'meetingNotice.meetingDate',
								xtype : 'datetimefield',
								format : 'Y-m-d H:i:s',
								id : 'meetingNoticeRceciveEdit.meetingDate',
								editable : false,
								allowBlank : false
							
							}]
					},{
						items:[{
							xtype : 'textfield',
							fieldLabel : '主持人',
							name : 'meetingNotice.host',
							editable : false,
							allowBlank : true
						},{
							xtype : 'textfield',
							fieldLabel : '会议地点',
							name : 'meetingNotice.meetingPlace',
							allowBlank : true
						}]
					},{
						items:[{
							xtype : 'combo',
							fieldLabel : '会议状态',
							name : 'meetingNotice.meetingState',
							triggerAction : 'all',
							editable : false,
							allowBlank : false,
							store : ['会议创建', '会议变更', '会议取消']
						}]
					}]
				},{
					name : 'meetingNotice.status',
					xtype : 'hidden',
					value :  1
				},{
					name : 'meetingNotice.noticeId',
					xtype : 'hidden'
				},{
					xtype : 'fieldset',
					border : false,
					defaults : {
						anchor : '96.3%,96%'
					},
					items : [this.docGridPanel]
				}]
	});
	
    if (this.noticeId != null && this.noticeId != 'undefined') {
    	var noticeId=this.noticeId;
		formPanel.getForm().load({
			deferredRender : false,
			url : __ctxPath + '/meetingNotice/getMeetingNotice.do?id=' + this.noticeId,
			waitMsg : '正在载入数据...',
			method:'post',
			success : function(form, action) {
					
			}
		});
	} 


	var window = new Ext.Window({
				id : 'ReceiveArchivesEdit',
				iconCls : 'menu-archive-draft',
				title : proName,
				width : 775,
				height : 470,
				autoScroll:true,
				modal : true,
				layout : 'form',
				buttonAlign : 'center',
				items : [formPanel],
				buttons : [{
					text : '保存',
					id:'save',
					iconCls : 'btn-save',
					handler : function() {
						var fp = Ext.getCmp('ArchivesMeetingEditfp');
						var docIds = '';
						Ext.getCmp('ArchivesMeetingEditfp.docGridPanel').getStore().each(function(rec){
							docIds += rec.data.fileId+',';
						},this);
						if (fp.getForm().isValid()) {	
							
							fp.getForm().submit({
								method : 'POST',
								waitMsg : '正在提交数据...',
								params: {
									docIds: docIds
								},
								success : function(fp, action) {
									Ext.ux.Toast.msg('操作信息', '成功保存！');
									if (callback != null) {
										callback.call(this);
									}
									window.close();
								},
								failure : function(fp, action) {
									Ext.MessageBox.show({
										title : '操作信息',
										msg : '信息保存出错，请联系管理员！',
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.ERROR
									});
								}
							});
						}
				
					}
				}, {
					text : '关闭',
					iconCls : 'btn-cancel',
					handler : function() {
						window.close();
					}
				}]
			});
	window.show();
};