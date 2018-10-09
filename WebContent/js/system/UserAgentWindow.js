/**
 * 
 * @class UserAgentWindow
 * @extends Ext.Windows
 */
UserAgentWindow=Ext.extend(Ext.Window,{
	constructor:function(conf){
		Ext.apply(this,conf);
		this.initUICmps();
		UserAgentWindow.superclass.constructor.call(this,{
			title:'用户'+conf.username+'代办账号设置',
			modal:true,
			iconCls:'btn-super',
			maximizable : true,
			buttonAlign:'center',
			width:700,
			height:200,
			layout:'fit',
			items:[
			       this.formPanel
			],
			buttons:[
						{
							xtype:'button',
							iconCls:'btn-ok',
							scope:this,
							text:'保存',
							handler:function(){
								var win=this;
								var grantUIds='';
								grantUIds =Ext.getCmp('grantUIds').getValue();
								var userId=curUserInfo.userId;
								
								var grantFromDate =Ext.getCmp('grantFromDate').getValue();
								var grantToDate =Ext.getCmp('grantToDate').getValue();
								var startTime = Ext.util.Format.date(grantFromDate, 'Y-m-d H:i:s');
								var endTime = Ext.util.Format.date(grantToDate, 'Y-m-d H:i:s');
								$request({
									url:__ctxPath+'/system/insertAgentAppUser.do',
									params:{
										grantUIds:grantUIds,
										userId:this.userId,
										grantFromDate:startTime,
										grantToDate:endTime
									},
									success:function(response,options){
										var result = Ext.util.JSON.decode(response.responseText);
										if(result.message=='error'){
											win.close();
											Ext.MessageBox.show({
													title : '操作信息',
													msg : '保存失败，代办时间段存在重复！',
													buttons : Ext.MessageBox.OK,
													icon : 'ext-mb-error'
												});
										}else{
											win.close();
											Ext.ux.Toast.msg('操作信息','成功保存代办账号~~');
												Ext.getCmp('UserAgentGrid').getStore().reload({
												params : {
													limit : 25,
													start : 0
												}
											});
										}
										
										//win.close();
									}
								});
							}
						},{
							xtype:'button',
							iconCls:'btn-cancel',
							text:'取消',
							scope:this,
							handler:function(){
								this.close();
							}
						}
						]
		});
	},
	initUICmps:function(){
		this.formPanel = new Ext.FormPanel({
			layout : 'column',
			bodyStyle : 'padding:1px;',
			border : false,
			autoScroll : true,
			id : 'MySelfUserAgentForm',
			defaults : {
				border : false,
				anchor : '98%,98%'
			},
			items : [
					{
						columnWidth : 0.5,
						layout : 'form',
						labelWidth : 100,
						items : {
							fieldLabel : '代办开始时间',
							width : 200,
							name : 'grantFromDate',
							id : 'grantFromDate',
							xtype : 'datetimefield',
							format : 'Y-m-d H:i:s',
							anchor : '90%',
							value : new Date()
						}
					},	{
						columnWidth : 0.5,
						layout : 'form',
						labelWidth : 100,
						items : {
							fieldLabel : '代办结束时间',
							width : 200,
							name : 'grantToDate',
							id : 'grantToDate',
							xtype : 'datetimefield',
							format : 'Y-m-d H:i:s',
							anchor : '90%',
							value : new Date()
						}
					},	{
						columnWidth : 1,
						layout : 'form',
						labelWidth : 100,
						items : {

						xtype : 'container',
						layout : 'column',
						style : 'padding:0px 0px 8px 0px;margin-left:0px;',
						defaults : {
							border : false
						},
						items : [{
							xtype : 'label',
							style : 'padding:0px 0px 0px 0px;',
							text : '代办人:',
							width : 105
						}, {
							// columnWidth:.6,
							xtype : 'textfield',
							name : 'grantUNames',
							id : 'grantUNames',
							width : '70%',
							readOnly : true
						}, {
							xtype : 'hidden',
							name : 'grantUIds',
							id: 'grantUIds'
						}, {
							xtype : 'button',
							iconCls : 'menu-department',
							text : '选择代办人',
							handler : function() {
								var issuerId = Ext.getCmp('grantUIds').getValue();
								var reporterName =Ext.getCmp('grantUNames').getValue();
								var array1=[];
								var array2=[];									
								var m = new Map();
								if(issuerId!=null && issuerId!=''){
										array1 = issuerId.split(',');
										array2 = reporterName.split(',');
										for(var i=0;i<array1.length;i++){	
											m.put(array1[i],array2[i]);
										}
								}
								AllDeptOfUserSelector.getView(
										function(userIds, fullnames) {
											Ext.getCmp('grantUIds').setValue(userIds);
											Ext.getCmp('grantUNames').setValue(fullnames);
										}, false, false, m)
								.show();
							}
						}]
					
						}
					}
					 
			]
		});
	}
});