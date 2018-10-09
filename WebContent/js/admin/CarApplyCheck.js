CarApplyCheck=Ext.extend(Ext.Window,{
	constructor:function(conf){
		Ext.apply(this,conf);
		this.initUICmps();
		CarApplyCheck.superclass.constructor.call(this,{
			title:'车辆使用申请审批',
			width:600,
			height:420,
			autoScroll:true,
			bodyStyle:'background-color: white',
			maximizable : true,
			modal : true,
			items:[
				this.formPanel
			],
			buttonAlign:'center',
			buttons:[
			{
				xtype:'button',
				text:'通过',
				iconCls:'btn-ok',
				scope:this,
				handler:function(){
					var win=this;
					$request({
						url:__ctxPath+'/admin/checkCarApply.do',
						params:{
							applyId:conf.applyId,
							approvalStatus:1
						},
						success:function(response,options){
							var result=Ext.util.JSON.decode(response.responseText);
							Ext.ux.Toast.msg('操作信息','成功提交：'+ result.message);
							Ext.getCmp('CarApplyGrid').getStore().reload();
							win.close();
						}
					});
				}
			},
			{
				xtype:'button',
				text:'未通过',
				iconCls:'btn-delete_copy',
				scope:this,
				handler:function(){
					var win=this;
					$request({
						url:__ctxPath+'/admin/checkCarApply.do',
						params:{
							applyId:conf.applyId,
							approvalStatus:2
						},
						success:function(response,options){
							var result=Ext.util.JSON.decode(response.responseText);
							Ext.ux.Toast.msg('操作信息','成功提交:' + result.message);
							Ext.getCmp('CarApplyGrid').getStore().reload();
							win.close();
						}
					});
				}
			},{
				xtype:'button',
				text:'关闭',
				iconCls:'btn-close',
				scope:this,
				handler:function(){
					this.close();
				}
			}
			]
		});
	},
	initUICmps:function(){
		
		this.formPanel=new Ext.form.FormPanel({
			xtype:'form',
			bodyStyle:'padding:8px',
			border:false,
			defaults:{
				xtype:'label'
			},
			items:[
				{
					fieldLabel : '车牌号码',
					id : 'carNo'
				},{
					fieldLabel :'用车部门',
					id:'department'
				},
				{
					fieldLabel : '用车人',
					id : 'userFullname'
				},
				{
					fieldLabel:'申请人',
					id : 'proposer'
				},{
					fieldLabel:'申请时间',
					id:'applyDate'
				},
				{
					fieldLabel:'原因',
					id:'reason'
				},{
					fieldLabel:'开始时间',
					id:'startTime'
				},
				{
					fieldLabel:'结束时间',
					id:'endTime'
				},{
					fieldLabel:'里程',
					id:'mileage'
				},
				{
					fieldLabel:'油耗',
					id:'oilUse'
				},
				{
					fieldLabel : '审批状态 ',
					id : 'approvalStatus'
				},{
					fieldLabel : '备注',
					id : 'notes'
				}
			]
		});
		var formPanel=this.formPanel;
		if (this.applyId != null && this.applyId != 'undefined') {
			try{
				$request({
						url : __ctxPath + '/admin/getCarApply.do?applyId=' + this.applyId,
						method:'post',
						success : function(response, option) {
							var data=Ext.util.JSON.decode(response.responseText).data;
							
							Ext.getCmp('carNo').setText(data.car.carNo);
							Ext.getCmp('department').setText(data.department);
							Ext.getCmp('userFullname').setText(data.userFullname);
							Ext.getCmp('proposer').setText(data.proposer);
							Ext.getCmp('applyDate').setText(data.applyDate);
							
							Ext.getCmp('reason').setText(data.reason);
							Ext.getCmp('startTime').setText(data.startTime);
							Ext.getCmp('endTime').setText(data.endTime);
							Ext.getCmp('mileage').setText(data.mileage);
							Ext.getCmp('oilUse').setText(data.oilUse);
							
							
							var approvalText='';
							if(data.approvalStatus==0){
								approvalText='未审批';
							}else if(data.approvalStatus==1){
								approvalText='通过审批';
							}else{
								approvalText='未通过审批';
							}
							Ext.getCmp('approvalStatus').setText(approvalText);
							Ext.getCmp('notes').setText(data.notes);
						},
						failure : function(response, option) {
							Ext.ux.Toast.msg('编辑', '载入失败');
						}
				});
			}catch(e){
			}
		}
		
	}
});