var ArchivesShareForm = function(archivesId) {
	this.archivesId = archivesId;
	var fp = this.setup();
	var window = new Ext.Window({
				id : 'ArchivesShareFormWin',
				title : '公文分发信息',
				iconCls:'menu-archive-template',
				width : 680,
				height : 400,
				modal : true,
				layout : 'fit',
				border:false,
				buttonAlign : 'center',
				items : [this.setup()],
				buttons : [{
					text : '分发',
					iconCls:'btn-save',
					handler : function() {
						var fp = Ext.getCmp('ArchivesShareForm');
						if (fp.getForm().isValid()) {
							Ext.Ajax.request({
								url : __ctxPath + '/archive/updateSentStatusArchives.do',
								params : {
									'archivesId' : archivesId
								},
								method:'post',
								success : function(response, options) {
									fp.getForm().submit({
										method : 'post',
										waitMsg : '正在提交数据...',
										success : function(fp, action) {
											Ext.ux.Toast.msg('操作信息', '信息成功保存！');
											var grid=Ext.getCmp('ArchivesIssueManageGrid');
											if(grid!=null){
											    grid.getStore().reload();
											}
											window.close();
										},
										failure : function(fp, action) {
											Ext.MessageBox.show({
												title : '操作信息',
												msg : '信息保存出错，请联系管理员！',
												buttons : Ext.MessageBox.OK,
												icon : 'ext-mb-error'
											});
											window.close();
										}
									});
								}
							});
						 	/*Ext.Ajax.request({
								url : __ctxPath + '/leave/updatePublicLeaveArchives.do',
								params : {
								    'archivesId':archivesId,
									'isPublic' : fp.getCmpByName('oneOption').getGroupValue()
								},
								method:'post',
								success : function(response, options) {
								}
							});*/
						}
					}
				}, {
					text : '取消',
					iconCls:'btn-del',
					handler : function() {
						window.close();
					}
				}]
			});
	Ext.Ajax.request({
		  url:__ctxPath+'/archive/selectByArchiveIdArchivesDep.do?archiveId='+this.archivesId,
		  method:'post',
		  success:function(response,options){
		  	var data=Ext.util.JSON.decode(response.responseText);
			if(data.length>0){
				var orgId='';
				var orgName='';
				var sentUserId='';
				var sentUserNames='';
				var m=0;
				var n=0;
				for(var i=0;i<data.length;i++){
					if(data[i][2]=="1"){
						if (m > 0) {
							orgId += ',';
							orgName += ',';
						}
				  		orgId +=data[i][0];
					  	orgName +=data[i][1];
					  	m=m+1;
					}else if(data[i][2]=="2"){
						if (n > 0) {
							sentUserId += ',';
							sentUserNames += ',';
						}
				  		sentUserId +=data[i][0];
					  	sentUserNames +=data[i][1];
					  	n=n+1;
					}
				}
				Ext.getCmp('ArchivesShareForm.sentGroupNames').setValue(orgName);
				Ext.getCmp('ArchivesShareForm.sentGroupIds').setValue(orgId);
				Ext.getCmp('ArchivesShareForm.sentUserNames').setValue(sentUserNames);
				Ext.getCmp('ArchivesShareForm.sentUserIds').setValue(sentUserId);
			} 
		  }
	});
	 /*Ext.Ajax.request({
			url : __ctxPath + '/leave/getIspublicByArchivesIdLeaveArchives.do',
			params : {
				'archivesId' : this.archivesId
			},
			method:'post',
			success : function(response, options) {
				var data = Ext.util.JSON.decode(response.responseText);
				if(data.ispublic==3){
					Ext.getCmp('three').setValue(true);
				}else if(data.ispublic==2){
					Ext.getCmp('two').setValue(true);
				}else if(data.ispublic==1){
					Ext.getCmp('one').setValue(true);
				}else {
					Ext.getCmp('zreo').setValue(true);
				}
			}
	 });*/
	window.show();
};
ArchivesShareForm.prototype.setup = function() {
	var archivesId=this.archivesId;
	var formPanel = new Ext.FormPanel({
				url : __ctxPath + '/archive/saveArchivesDep.do',
				layout : 'form',
				id : 'ArchivesShareForm',
				bodyStyle : 'padding:5px;',
				items : [/*{
					xtype : 'radiogroup',
					allowBlank : false,
					width : 450,
					items : [{
						boxLabel : '外网公开',
						name : 'oneOption',
						id:'three',
						inputValue : 3,
						checked : true,
						listeners : {
								'check' : function(checkbox, checked){
  								if(checked){// 只有在点击时触发
  									Ext.getCmp("ArchivesShareForm.publicRange").setValue("外网、委系统、委内公开");
  								}
							}
						}
					},{
						boxLabel : '委系统公开',
						name : 'oneOption',
						id:'two',
						inputValue : 2,
						listeners : {
							'check' : function(checkbox, checked){
								if(checked){// 只有在点击时触发
									Ext.getCmp("ArchivesShareForm.publicRange").setValue("委系统、委内公开");
								}
						}
					}
					},{
						boxLabel : '委内公开',
						name : 'oneOption',
						id:'one',
						inputValue : 1,
						listeners : {
							'check' : function(checkbox, checked){
								if(checked){// 只有在点击时触发
									Ext.getCmp("ArchivesShareForm.publicRange").setValue("委内公开");
								}
						}
					}
					},{
						boxLabel : '都不公开',
						name : 'oneOption',
						id:'zreo',
						inputValue : 0,
						listeners : {
							'check' : function(checkbox, checked){
								if(checked){// 只有在点击时触发
									Ext.getCmp("ArchivesShareForm.publicRange").setValue("都不公开");
								}
						}
					}
					}],
						fieldLabel : '是否公开'
				},{
					xtype : 'container',
					layout : 'column',
					style : 'padding:0px 0px 8px 0px;margin-left:0px;',
					defaults : {
						allowBlank : false,
						border : false
					},
					items : [{
						xtype : 'label',
						text : '公开范围:',
						width : 120
					}, {
						xtype : 'textfield',
						width : '67%',
						allowBlank : true,
						readOnly : true,
						value:'外网、委系统、委内公开',
						id : 'ArchivesShareForm.publicRange'
					}]
				},*/{
				xtype : 'container',
				layout : 'column',
				style : 'padding:0px 0px 8px 0px;margin-left:0px;',
				defaults : {
					allowBlank : false,
					border : false
				},
				items : [{
							xtype:'hidden',
							name:'archivesId',
							value:archivesId
						},{
							xtype : 'hidden',
							id : 'ArchivesShareForm.sentGroupIds',
							name:'depIds'
						},{
							xtype : 'label',
							text : '分发单位:',
							width : 120
						}, {
							xtype : 'textarea',
							width : '67%',
							height : 210,
							allowBlank : true,
							id : 'ArchivesShareForm.sentGroupNames'
						}, {
							style : 'padding-left:5px;',
							xtype : 'button',
							iconCls : 'menu-department',
							text : '选择单位',
							scope:this,
							handler : function() {
								
								Ext.Ajax.request({
									  url:__ctxPath+'/archive/selectByArchiveIdArchivesDep.do?archiveId='+this.archivesId,
									  method:'post',
									  success:function(response,options){
									  	var data=Ext.util.JSON.decode(response.responseText);
									   var url1=__ctxPath + '/system/sentListDepartment.do?innerLimitLevel=99';
										var url2=__ctxPath + '/system/selectLE3Department.do';
										var depIdsTemp = Ext.getCmp('ArchivesShareForm.sentGroupIds').getValue();
										var depNamesTemp = Ext.getCmp('ArchivesShareForm.sentGroupNames').getValue();
										var array1 = [];
										var array2 = [];
										var map= new Map();
										if(data.length>0){
											for(var i=0;i<data.length;i++){
												  if(data[i][2]=="1"){
											  	  	map.put(data[i][0],data[i][1]);
												  }
											  	}
										}
										if (depIdsTemp != null&& depIdsTemp != '') {
											array1 = depIdsTemp.split(',');
											array2 = depNamesTemp.split(',');
											for (var i = 0; i < array1.length; i++) {
												map.put(array1[i],array2[i]);
											}
										}
										DepSelector.getView(function(formPanel,id, name) {
											Ext.getCmp('ArchivesShareForm.sentGroupNames').setValue(name);
											Ext.getCmp('ArchivesShareForm.sentGroupIds').setValue(id);
										},false,map,url1,url2).show();
											  },
											  failure:function(response,options){
											    Ext.MessageBox.show({
											      title:'操作信息！',
											      msg:'加载出错,请联系管理员',
											      icon:'ext-mb-error',
											      buttons:Ext.MessageBox.OK
											      
											    })
											  }
	                         });
								
							}
						}]},{
							xtype : 'container',
							layout : 'column',
							style : 'padding:0px 0px 8px 0px;margin-left:0px;',
							defaults : {
								allowBlank : false,
								border : false
							},
							items : [{
										xtype:'hidden',
										name:'archivesId',
										value:archivesId
									},{
										xtype : 'hidden',
										id : 'ArchivesShareForm.sentUserIds',
										name:'sentUserIds'
									},{
										xtype : 'label',
										text : '分发个人(机关内部):',
										width : 120
									}, {
										xtype : 'textarea',
										width : '67%',
										height : 80,
										allowBlank : true,
										id : 'ArchivesShareForm.sentUserNames'
									}, {
										style : 'padding-left:5px;',
										xtype : 'button',
										iconCls : 'menu-department',
										text : '选择人员',
										scope:this,
										handler : function() {
											
											Ext.Ajax.request({
												  url:__ctxPath+'/archive/selectByArchiveIdArchivesDep.do?archiveId='+this.archivesId,
												  method:'post',
												  success:function(response,options){
												  	var data=Ext.util.JSON.decode(response.responseText);
												   var url1=__ctxPath + '/system/sentListDepartment.do?externalLimitLevel=1&innerLimitLevel=90';
													var url2=__ctxPath + '/system/selectAppUser.do';
													var depIdsTemp = Ext.getCmp('ArchivesShareForm.sentUserIds').getValue();
													var depNamesTemp = Ext.getCmp('ArchivesShareForm.sentUserNames').getValue();
													var array1 = [];
													var array2 = [];
													var map= new Map();
													if(data.length>0){
														for(var i=0;i<data.length;i++){
															if(data[i][2]=="2"){
														  	  map.put(data[i][0],data[i][1]);
															}
														}
													}
													if (depIdsTemp != null&& depIdsTemp != '') {
														array1 = depIdsTemp.split(',');
														array2 = depNamesTemp.split(',');
														for (var i = 0; i < array1.length; i++) {
															map.put(array1[i],array2[i]);
														}
													}
													SentUserSelector.getView(function(userId, fullName, depName) {
														Ext.getCmp('ArchivesShareForm.sentUserNames').setValue(fullName);
														Ext.getCmp('ArchivesShareForm.sentUserIds').setValue(userId);
													},false,map,url1,url2).show();
														  },
														  failure:function(response,options){
														    Ext.MessageBox.show({
														      title:'操作信息！',
														      msg:'加载出错,请联系管理员',
														      icon:'ext-mb-error',
														      buttons:Ext.MessageBox.OK
														      
														    })
														  }
				                         });
											
										}
									}]}/*,{
										xtype : 'container',
										layout : 'column',
										style : 'padding:0px 0px 8px 0px;margin-left:0px;',
										defaults : {
											allowBlank : false,
											border : false
										},
										items : [{
													xtype:'hidden',
													name:'archivesId',
													value:archivesId
												},{
													xtype : 'hidden',
													id : 'ArchivesShareForm.emailUserIds',
													name:'emailUserIds'
												},{
													xtype : 'label',
													text : '邮件发送:',
													width : 120
												}, {
													xtype : 'textarea',
													width : '67%',
													height : 40,
													allowBlank : true,
													id : 'ArchivesShareForm.emailUserNames'
												}, {
													style : 'padding-left:5px;',
													xtype : 'button',
													iconCls : 'menu-department',
													text : '选择人员',
													scope:this,
													handler : function() {
														//UserSelector.getView(
														DeptOfUserSelector.getView(
															function(userIds,fullnames) {
																Ext.getCmp('ArchivesShareForm.emailUserNames').setValue(fullnames);
																Ext.getCmp('ArchivesShareForm.emailUserIds').setValue(userIds);
															},false,false,null,null).show();
													}
												}]}*/
				]
			});
	return formPanel;

};
